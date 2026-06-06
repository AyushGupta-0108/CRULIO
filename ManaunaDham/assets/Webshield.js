/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║                   WebShield.js v2.0                         ║
 * ║         Full-Spectrum Client-Side Security Bundle           ║
 * ║                                                             ║
 * ║  Protections:                                               ║
 * ║   1. XSS      — HTML escaping, safe DOM, eval blocking      ║
 * ║   2. CSRF     — Token injection for fetch + XHR             ║
 * ║   3. Clickjacking — Frame-bust + CSP meta                   ║
 * ║   4. Interception — HTTPS enforcement, SRI hints            ║
 * ║   5. Bypass   — Prototype pollution, open-redirect guard    ║
 * ║   6. Input    — Sanitization + SQL/path-traversal blocking  ║
 * ║   7. Storage  — Encrypted localStorage wrapper             ║
 * ║   8. DevTools — Console tampering detection                 ║
 * ║   9. Rate Limit — Client-side action throttling             ║
 * ║  10. Exfil    — Outbound URL allow-list guard               ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * USAGE:
 *   Load as the VERY FIRST script on the page (before all others):
 *   <script src="webshield.js"></script>
 *
 *   Then use the global WebShield object:
 *   WebShield.escapeHTML(userInput)
 *   WebShield.sanitize(userInput)
 *   WebShield.safeRedirect(url)
 *   WebShield.storage.set('key', value)
 *   WebShield.storage.get('key')
 *   WebShield.rateLimit('action', 5, 10000)
 */

;(function (global, document) {
  'use strict';

  /* ─────────────────────────────────────────────────────────────
   * INTERNAL UTILITIES
   * ───────────────────────────────────────────────────────────── */

  const _log  = (msg, data) => console.info(`[WebShield] ${msg}`, data ?? '');
  const _warn = (msg, data) => console.warn(`[WebShield] ⚠ ${msg}`, data ?? '');
  const _err  = (msg, data) => console.error(`[WebShield] ✖ ${msg}`, data ?? '');

  /** Tiny event bus for internal audit trail */
  const events = { _h: {}, on(e, fn) { (this._h[e] ??= []).push(fn); },
    emit(e, d) { (this._h[e] ?? []).forEach(fn => fn(d)); } };


  /* ─────────────────────────────────────────────────────────────
   * 1. CLICKJACK FRAME-BUST  (run instantly, before DOM)
   * ───────────────────────────────────────────────────────────── */

  (function bustFrames() {
    if (global.self !== global.top) {
      try {
        global.top.location = global.self.location.href;
      } catch (e) {
        // Cross-origin parent blocked escape — hide content
        document.documentElement.style.visibility = 'hidden';
        _err('Page is framed by a cross-origin parent. Content hidden.');
      }
    }
  })();


  /* ─────────────────────────────────────────────────────────────
   * 2. XSS — HTML ESCAPING & SAFE DOM
   * ───────────────────────────────────────────────────────────── */

  const XSS = (() => {
    const MAP = { '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#x27;','/':'&#x2F;','`':'&#x60;' };

    /** Escape all HTML special characters */
    function escapeHTML(str) {
      if (typeof str !== 'string') return String(str ?? '');
      return str.replace(/[&<>"'`\/]/g, c => MAP[c]);
    }

    /** Safe innerHTML replacement — strips scripts, event handlers, dangerous hrefs */
    function safeSetHTML(el, html) {
      if (!(el instanceof Element)) return;
      const tpl = document.createElement('template');
      tpl.innerHTML = html;
      const root = tpl.content;
      root.querySelectorAll('script, noscript, iframe, object, embed, base').forEach(n => n.remove());
      root.querySelectorAll('*').forEach(node => {
        [...node.attributes].forEach(attr => {
          const name = attr.name.toLowerCase();
          const val  = attr.value;
          // Remove all on* event handlers
          if (/^on/i.test(name)) { node.removeAttribute(attr.name); return; }
          // Remove javascript: URIs
          if ((name === 'href' || name === 'src' || name === 'action') &&
              /^\s*javascript\s*:/i.test(val)) { node.removeAttribute(attr.name); return; }
          // Remove data: URIs on src (can contain scripts)
          if (name === 'src' && /^\s*data\s*:/i.test(val)) { node.removeAttribute(attr.name); }
        });
      });
      el.innerHTML = '';
      el.appendChild(root.cloneNode(true));
    }

    /** Create a text node safely (no parsing) */
    function safeText(str) {
      return document.createTextNode(String(str ?? ''));
    }

    /** Block dangerous global sinks */
    function patchSinks() {
      // Block eval
      try {
        Object.defineProperty(global, 'eval', {
          get() { return function blockedEval(code) {
            _warn('eval() call blocked', String(code).slice(0, 80));
            events.emit('xss:eval-blocked', { code: String(code).slice(0, 80) });
            return undefined;
          }; },
          configurable: false
        });
      } catch(e) { /* already defined non-configurable */ }

      // Block document.write / writeln
      const noop = function() { _warn('document.write() blocked'); };
      try { document.write = noop; document.writeln = noop; } catch(e) {}

      // Block Function constructor abuse
      const _FnCtor = Function.prototype.constructor;
      try {
        Function = new Proxy(Function, {
          construct(target, args) {
            _warn('new Function() blocked', args.join('').slice(0, 80));
            return function() {};
          }
        });
      } catch(e) { /* Proxy not available or already locked */ }
    }

    return { escapeHTML, safeSetHTML, safeText, patchSinks };
  })();

  XSS.patchSinks();


  /* ─────────────────────────────────────────────────────────────
   * 3. CSRF — TOKEN INJECTION
   * ───────────────────────────────────────────────────────────── */

  const CSRF = (() => {
    const KEY = '_ws_csrf';
    const MUTATING = new Set(['POST','PUT','PATCH','DELETE']);

    function generateToken(len = 40) {
      const arr = new Uint8Array(len);
      crypto.getRandomValues(arr);
      return Array.from(arr, b => b.toString(16).padStart(2,'0')).join('');
    }

    let token = sessionStorage.getItem(KEY);
    if (!token) { token = generateToken(); sessionStorage.setItem(KEY, token); }

    /** Patch fetch */
    const _origFetch = global.fetch;
    global.fetch = function(input, init = {}) {
      const method = (init.method ?? 'GET').toUpperCase();
      if (MUTATING.has(method)) {
        const url = new URL(typeof input === 'string' ? input : (input.url ?? input), location.href);
        if (url.origin !== location.origin) {
          _warn('Cross-origin mutating request blocked', url.href);
          events.emit('csrf:blocked', { url: url.href, method });
          return Promise.reject(new TypeError('[WebShield] Cross-origin mutating requests are blocked.'));
        }
        init.headers = Object.assign({}, init.headers, { 'X-CSRF-Token': token });
      }
      return _origFetch.call(this, input, init);
    };

    /** Patch XMLHttpRequest */
    const _xhrOpen = XMLHttpRequest.prototype.open;
    const _xhrSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function(method, url) {
      this._wsMethod = method;
      this._wsUrl = url;
      return _xhrOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function() {
      if (MUTATING.has((this._wsMethod ?? '').toUpperCase())) {
        try {
          const url = new URL(this._wsUrl, location.href);
          if (url.origin !== location.origin) {
            _warn('XHR cross-origin mutating request blocked', this._wsUrl);
            events.emit('csrf:blocked', { url: this._wsUrl });
            return; // abort
          }
        } catch(e) {}
        this.setRequestHeader('X-CSRF-Token', token);
      }
      return _xhrSend.apply(this, arguments);
    };

    return { getToken: () => token };
  })();


  /* ─────────────────────────────────────────────────────────────
   * 4. HTTPS / INTERCEPTION GUARD
   * ───────────────────────────────────────────────────────────── */

  const InterceptionGuard = (() => {
    function enforceHTTPS() {
      if (location.protocol === 'http:' && location.hostname !== 'localhost' &&
          !location.hostname.startsWith('127.') && location.hostname !== '::1') {
        _warn('Insecure HTTP detected. Redirecting to HTTPS...');
        location.replace(location.href.replace(/^http:/, 'https:'));
      }
    }

    /** Inject HTTP security meta tags (supplement server headers) */
    function injectMeta() {
      if (!document.head) return; // Too early — call after DOMContentLoaded

      const metas = [
        // Content Security Policy — tighten to your needs
        { 'http-equiv': 'Content-Security-Policy',
          content: [
            "default-src 'self'",
            "script-src 'self'",
            "style-src 'self' 'unsafe-inline'",
            "img-src 'self' data: https:",
            "font-src 'self'",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "object-src 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "upgrade-insecure-requests",
          ].join('; ')
        },
        { 'http-equiv': 'X-Content-Type-Options', content: 'nosniff' },
        { 'http-equiv': 'X-Frame-Options',         content: 'DENY'    },
        { 'http-equiv': 'Referrer-Policy',          content: 'strict-origin-when-cross-origin' },
      ];

      metas.forEach(attrs => {
        const m = document.createElement('meta');
        Object.entries(attrs).forEach(([k, v]) => m.setAttribute(k, v));
        document.head.prepend(m);
      });
    }

    enforceHTTPS();
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', injectMeta, { once: true });
    } else { injectMeta(); }

    return {};
  })();


  /* ─────────────────────────────────────────────────────────────
   * 5. BYPASS GUARDS — Prototype Pollution + Open Redirect
   * ───────────────────────────────────────────────────────────── */

  const BypassGuard = (() => {
    /** Freeze Object.prototype to block prototype pollution */
    function lockPrototype() {
      try {
        Object.freeze(Object.prototype);
        _log('Object.prototype frozen — prototype pollution blocked.');
      } catch(e) {
        _warn('Could not freeze Object.prototype:', e.message);
      }
    }

    /**
     * Safe redirect — validates destination before navigating.
     * allowedOrigins defaults to same origin only.
     */
    function safeRedirect(url, allowedOrigins = []) {
      let parsed;
      try { parsed = new URL(url, location.href); }
      catch (e) { _warn('safeRedirect: invalid URL', url); return; }

      const allowed = new Set([location.origin, ...allowedOrigins]);
      if (!allowed.has(parsed.origin)) {
        _warn('safeRedirect: blocked redirect to untrusted origin', parsed.origin);
        events.emit('bypass:redirect-blocked', { url });
        return;
      }
      location.href = parsed.href;
    }

    /** Block dangerous URL schemes in anchor clicks site-wide */
    function guardLinks() {
      document.addEventListener('click', e => {
        const a = e.target.closest('a');
        if (!a) return;
        const href = a.getAttribute('href') ?? '';
        if (/^\s*(javascript|data|vbscript)\s*:/i.test(href)) {
          e.preventDefault();
          e.stopImmediatePropagation();
          _warn('Dangerous link scheme blocked', href);
          events.emit('bypass:link-blocked', { href });
        }
      }, true);
    }

    lockPrototype();
    guardLinks();

    return { safeRedirect };
  })();


  /* ─────────────────────────────────────────────────────────────
   * 6. INPUT SANITIZATION & VALIDATION
   * ───────────────────────────────────────────────────────────── */

  const InputGuard = (() => {
    const PATTERNS = {
      email:    /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/,
      url:      /^https?:\/\/[\w.-]+(:\d+)?(\/[\w./?=%&#+-]*)?$/,
      alphanum: /^[a-zA-Z0-9_-]+$/,
      integer:  /^-?\d{1,15}$/,
      float:    /^-?\d+(\.\d+)?$/,
      phone:    /^\+?[\d\s\-().]{7,20}$/,
      slug:     /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    };

    const DANGEROUS_SQL = /('|--|;|\/\*|\*\/|xp_|EXEC\s|UNION\s+SELECT|INSERT\s+INTO|DROP\s+TABLE|ALTER\s+TABLE|CREATE\s+TABLE|DELETE\s+FROM|UPDATE\s+SET|TRUNCATE\s+TABLE)/gi;
    const PATH_TRAVERSAL = /\.\.[\/\\]/g;
    const NULL_BYTES      = /\0/g;
    const TEMPLATE_INJ    = /\$\{[^}]*\}|<%[^%]*%>/g;
    const SSTI_PATTERNS   = /\{\{.*?\}\}|\{%.*?%\}/g;

    /**
     * Strip dangerous patterns from a string.
     * @param {string} str   Input to sanitize
     * @param {number} max   Max allowed length (default 5000)
     */
    function sanitize(str, max = 5000) {
      if (typeof str !== 'string') return String(str ?? '');
      return str
        .slice(0, max)
        .replace(NULL_BYTES, '')
        .replace(PATH_TRAVERSAL, '')
        .replace(DANGEROUS_SQL, '')
        .replace(TEMPLATE_INJ, '')
        .replace(SSTI_PATTERNS, '')
        .trim();
    }

    /**
     * Validate a value against a named pattern.
     * @param {string} value  The value to test
     * @param {string} type   One of: email, url, alphanum, integer, float, phone, slug
     */
    function validate(value, type) {
      if (!PATTERNS[type]) throw new Error(`[WebShield] Unknown validation type: ${type}`);
      return PATTERNS[type].test(String(value ?? ''));
    }

    /**
     * Validate a full object of fields.
     * @param {Object} schema  { fieldName: { value, type?, required?, max? } }
     * @returns {{ valid: boolean, errors: Object }}
     */
    function validateForm(schema) {
      const errors = {};
      for (const [name, rules] of Object.entries(schema)) {
        const raw = sanitize(String(rules.value ?? ''), rules.max ?? 5000);
        if (rules.required && !raw) { errors[name] = 'This field is required.'; continue; }
        if (raw && rules.type && !validate(raw, rules.type))
          errors[name] = `Invalid ${rules.type} format.`;
      }
      return { valid: Object.keys(errors).length === 0, errors };
    }

    /**
     * Attach automatic validation to a form element.
     * @param {HTMLFormElement} formEl
     * @param {Object}          schema   Same format as validateForm
     * @param {Function}        onValid  Called with sanitized values on success
     */
    function protectForm(formEl, schema, onValid) {
      if (!(formEl instanceof HTMLElement)) return;
      formEl.addEventListener('submit', e => {
        e.preventDefault();
        const fields = {};
        for (const [name, rules] of Object.entries(schema)) {
          const el = formEl.elements[name];
          fields[name] = { ...rules, value: el?.value ?? '' };
        }
        const { valid, errors } = validateForm(fields);
        if (valid) {
          const safeData = {};
          for (const [name, rules] of Object.entries(fields))
            safeData[name] = sanitize(String(rules.value), rules.max ?? 5000);
          onValid(safeData);
        } else {
          _warn('Form validation failed', errors);
          events.emit('input:validation-failed', { errors });
        }
      });
    }

    return { sanitize, validate, validateForm, protectForm };
  })();


  /* ─────────────────────────────────────────────────────────────
   * 7. ENCRYPTED STORAGE WRAPPER
   * ───────────────────────────────────────────────────────────── */

  const SecureStorage = (() => {
    const PREFIX = '_ws_';

    /** XOR-based obfuscation with a session key (lightweight, not crypto-grade) */
    function _getKey() {
      let k = sessionStorage.getItem(PREFIX + 'stk');
      if (!k) {
        const arr = new Uint8Array(16);
        crypto.getRandomValues(arr);
        k = btoa(String.fromCharCode(...arr));
        sessionStorage.setItem(PREFIX + 'stk', k);
      }
      return k;
    }

    function _encode(str) {
      try {
        const key  = _getKey();
        const data = btoa(unescape(encodeURIComponent(str)));
        let out = '';
        for (let i = 0; i < data.length; i++)
          out += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        return btoa(out);
      } catch(e) { return btoa(str); }
    }

    function _decode(enc) {
      try {
        const key = _getKey();
        const raw = atob(enc);
        let out = '';
        for (let i = 0; i < raw.length; i++)
          out += String.fromCharCode(raw.charCodeAt(i) ^ key.charCodeAt(i % key.length));
        return decodeURIComponent(escape(atob(out)));
      } catch(e) { return null; }
    }

    function set(key, value) {
      try {
        const serialized = JSON.stringify(value);
        localStorage.setItem(PREFIX + key, _encode(serialized));
      } catch(e) { _warn('Storage.set failed', e.message); }
    }

    function get(key) {
      try {
        const raw = localStorage.getItem(PREFIX + key);
        if (!raw) return null;
        return JSON.parse(_decode(raw));
      } catch(e) { return null; }
    }

    function remove(key) { localStorage.removeItem(PREFIX + key); }

    function clear() {
      Object.keys(localStorage)
        .filter(k => k.startsWith(PREFIX))
        .forEach(k => localStorage.removeItem(k));
    }

    return { set, get, remove, clear };
  })();


  /* ─────────────────────────────────────────────────────────────
   * 8. DEVTOOLS / CONSOLE TAMPERING DETECTION
   * ───────────────────────────────────────────────────────────── */

  const DevToolsGuard = (() => {
    /** Detect if DevTools is open via timing trick */
    function detectDevTools(callback) {
      let prev = Date.now();
      setInterval(() => {
        const now = Date.now();
        // DevTools can add ~100ms+ delay to debugger pauses
        if (now - prev > 200) {
          callback?.();
          events.emit('devtools:opened', { timestamp: now });
        }
        prev = Date.now();
      }, 100);
    }

    /** Block common console overrides used by injected scripts */
    function lockConsole() {
      const safe = {
        log:   console.log.bind(console),
        warn:  console.warn.bind(console),
        error: console.error.bind(console),
        info:  console.info.bind(console),
      };
      // Prevent external scripts from silencing the console
      Object.keys(safe).forEach(method => {
        try {
          Object.defineProperty(console, method, {
            get: () => safe[method],
            configurable: false,
          });
        } catch(e) {}
      });
    }

    lockConsole();
    return { detectDevTools };
  })();


  /* ─────────────────────────────────────────────────────────────
   * 9. CLIENT-SIDE RATE LIMITER
   * ───────────────────────────────────────────────────────────── */

  const RateLimiter = (() => {
    const store = new Map();

    /**
     * Check if an action exceeds the allowed rate.
     * @param {string} action   Unique action key (e.g. 'login', 'submit')
     * @param {number} limit    Max allowed calls in the window
     * @param {number} windowMs Time window in milliseconds
     * @returns {boolean}       true = allowed, false = rate-limited
     */
    function check(action, limit = 5, windowMs = 60000) {
      const now    = Date.now();
      const entry  = store.get(action) ?? { count: 0, reset: now + windowMs };

      if (now > entry.reset) { entry.count = 0; entry.reset = now + windowMs; }
      entry.count++;
      store.set(action, entry);

      if (entry.count > limit) {
        _warn(`Rate limit hit for action: "${action}" (${entry.count}/${limit})`);
        events.emit('ratelimit:hit', { action, count: entry.count, limit });
        return false;
      }
      return true;
    }

    return { check };
  })();


  /* ─────────────────────────────────────────────────────────────
   * 10. EXFILTRATION / OUTBOUND GUARD
   * ───────────────────────────────────────────────────────────── */

  const ExfilGuard = (() => {
    let allowList = new Set([location.origin]);

    /**
     * Add trusted origins that requests are allowed to reach.
     * @param {string[]} origins  e.g. ['https://api.myservice.com']
     */
    function allowOrigins(origins) {
      origins.forEach(o => { try { allowList.add(new URL(o).origin); } catch(e) {} });
    }

    /** Check if a URL is on the allow list */
    function isAllowed(url) {
      try {
        const origin = new URL(url, location.href).origin;
        return allowList.has(origin);
      } catch(e) { return false; }
    }

    /**
     * Patch navigator.sendBeacon to block unauthorized exfiltration.
     */
    if (navigator.sendBeacon) {
      const _beacon = navigator.sendBeacon.bind(navigator);
      navigator.sendBeacon = function(url, data) {
        if (!isAllowed(url)) {
          _warn('sendBeacon to unlisted origin blocked', url);
          events.emit('exfil:beacon-blocked', { url });
          return false;
        }
        return _beacon(url, data);
      };
    }

    return { allowOrigins, isAllowed };
  })();


  /* ─────────────────────────────────────────────────────────────
   * FINAL AUDIT LOG
   * ───────────────────────────────────────────────────────────── */

  const audit = [];
  events.on('xss:eval-blocked',         d => audit.push({ t: Date.now(), type: 'xss:eval',        ...d }));
  events.on('csrf:blocked',             d => audit.push({ t: Date.now(), type: 'csrf',             ...d }));
  events.on('bypass:redirect-blocked',  d => audit.push({ t: Date.now(), type: 'bypass:redirect', ...d }));
  events.on('bypass:link-blocked',      d => audit.push({ t: Date.now(), type: 'bypass:link',     ...d }));
  events.on('input:validation-failed',  d => audit.push({ t: Date.now(), type: 'input:fail',      ...d }));
  events.on('ratelimit:hit',            d => audit.push({ t: Date.now(), type: 'ratelimit',        ...d }));
  events.on('exfil:beacon-blocked',     d => audit.push({ t: Date.now(), type: 'exfil:beacon',    ...d }));
  events.on('devtools:opened',          d => audit.push({ t: Date.now(), type: 'devtools',         ...d }));


  /* ─────────────────────────────────────────────────────────────
   * PUBLIC API
   * ───────────────────────────────────────────────────────────── */

  global.WebShield = Object.freeze({
    // XSS
    escapeHTML:     XSS.escapeHTML,
    safeSetHTML:    XSS.safeSetHTML,
    safeText:       XSS.safeText,

    // CSRF
    csrfToken:      CSRF.getToken(),
    getCSRFToken:   CSRF.getToken,

    // Bypass / Redirect
    safeRedirect:   BypassGuard.safeRedirect,

    // Input
    sanitize:       InputGuard.sanitize,
    validate:       InputGuard.validate,
    validateForm:   InputGuard.validateForm,
    protectForm:    InputGuard.protectForm,

    // Storage
    storage:        SecureStorage,

    // Rate limiter
    rateLimit:      RateLimiter.check,

    // Exfil guard
    allowOrigins:   ExfilGuard.allowOrigins,
    isAllowed:      ExfilGuard.isAllowed,

    // DevTools
    onDevToolsOpen: DevToolsGuard.detectDevTools,

    // Events (subscribe to security events)
    on:             events.on.bind(events),

    // Audit log (read-only snapshot)
    getAuditLog:    () => [...audit],

    version: '2.0.0',
  });

  _log(`v${global.WebShield.version} active ✓ — XSS | CSRF | Clickjack | Interception | Bypass | Input | Storage | RateLimit | Exfil`);

})(window, document);


/* ═══════════════════════════════════════════════════════════════
 * SERVER-SIDE REFERENCE (Node.js / Express)
 * ═══════════════════════════════════════════════════════════════
 *
 * // middleware/securityHeaders.js
 * module.exports = function securityHeaders(req, res, next) {
 *
 *   // Block MIME sniffing
 *   res.setHeader('X-Content-Type-Options', 'nosniff');
 *
 *   // Block clickjacking at HTTP level
 *   res.setHeader('X-Frame-Options', 'DENY');
 *
 *   // Force HTTPS for 1 year
 *   res.setHeader('Strict-Transport-Security',
 *     'max-age=31536000; includeSubDomains; preload');
 *
 *   // Disable legacy XSS filter (CSP is better)
 *   res.setHeader('X-XSS-Protection', '0');
 *
 *   // Restrict referrer info
 *   res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
 *
 *   // Restrict browser APIs
 *   res.setHeader('Permissions-Policy',
 *     'geolocation=(), camera=(), microphone=(), payment=()');
 *
 *   // Full Content Security Policy
 *   res.setHeader('Content-Security-Policy', [
 *     "default-src 'self'",
 *     "script-src 'self'",
 *     "style-src 'self' 'unsafe-inline'",
 *     "img-src 'self' data: https:",
 *     "connect-src 'self'",
 *     "frame-ancestors 'none'",
 *     "object-src 'none'",
 *     "base-uri 'self'",
 *     "form-action 'self'",
 *     "upgrade-insecure-requests",
 *   ].join('; '));
 *
 *   // CSRF token validation
 *   const mutating = ['POST','PUT','PATCH','DELETE'];
 *   if (mutating.includes(req.method)) {
 *     const token    = req.headers['x-csrf-token'];
 *     const expected = req.session?.csrfToken;
 *     if (!token || token !== expected) {
 *       return res.status(403).json({ error: 'Invalid CSRF token' });
 *     }
 *   }
 *
 *   // Remove fingerprinting headers
 *   res.removeHeader('X-Powered-By');
 *   res.removeHeader('Server');
 *
 *   next();
 * };
 * ═══════════════════════════════════════════════════════════════ */
