/* ============================================================
   ManaunaFood — standalone food ordering widget
   Self-contained: menu browsing + live "order chit" + WhatsApp
   handoff. No dependency on chatbot.js / manauna-support-chat.js.

   Usage:
     <script src=".../assets/food-order.js"></script>
     <script>
       ManaunaFood.init({
         defaultWhatsapp: "917817803342",
         restaurants: [
           {
             id: "food-plaza",
             name: "Food Plaza Aonla",
             tagline: "Chaap King · AC Family Dining",
             whatsapp: "917817803342",          // optional override
             menuImages: ["https://...menu1.webp", "..."],
             categories: [
               { title: "🔥 Famous Chaaps", items: [
                 { id: "fp-malai", name: "Malai Chaap", price: 130 },
                 { id: "fp-afghani", name: "Afghani Chaap", price: 130, startingAt: true }
               ]}
             ]
           }
         ]
       });
     </script>

     <button onclick="ManaunaFood.open('food-plaza')">Order Now</button>
     <button onclick="ManaunaFood.quickAdd('food-plaza','fp-malai')">+ Add</button>
   ============================================================ */

(function () {
  if (window.ManaunaFood) return; // already loaded

  // ---------------------------------------------------------
  // STATE
  // ---------------------------------------------------------
  var S = {
    restaurants: {},        // id -> restaurant config
    order: ["food-plaza", "shiv-pizza"], // fallback display order (overwritten by init order)
    activeId: null,
    carts: {},              // restaurantId -> { itemId: qty }
    notes: {},              // restaurantId -> string
    name: "", phone: "", address: "",
    tab: "menu",            // 'menu' | 'chit'  (mobile)
    isOpen: false,
    lastFocus: null
  };

  var DEFAULT_WHATSAPP = "917817803342";

  // ---------------------------------------------------------
  // STYLES
  // ---------------------------------------------------------
  function ensureFonts() {
    if (document.getElementById("mf-fonts")) return;
    var link = document.createElement("link");
    link.id = "mf-fonts";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600..900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap";
    document.head.appendChild(link);
  }

  function injectStyles() {
    if (document.getElementById("mf-styles")) return;
    var css = document.createElement("style");
    css.id = "mf-styles";
    css.textContent = "" +
".mf-root{--mf-maroon:#7a0000;--mf-maroon-deep:#4d0000;--mf-gold:#d4a017;--mf-paper:#fffdf6;--mf-cream:#fff6e6;--mf-green:#1a7a3a;--mf-green-deep:#13602d;--mf-ink:#2b2118;--mf-ink-soft:#6b5d4f;--mf-line:#e8dcc4;font-family:'Plus Jakarta Sans',Segoe UI,Arial,sans-serif;}" +
".mf-overlay{position:fixed;inset:0;background:rgba(20,10,4,.55);backdrop-filter:blur(2px);z-index:999998;display:none;align-items:flex-end;justify-content:center;opacity:0;transition:opacity .25s ease;}" +
".mf-overlay.mf-show{display:flex;opacity:1;}" +
"@media(min-width:768px){.mf-overlay{align-items:center;padding:24px;}}" +
".mf-modal{background:var(--mf-cream);width:100%;max-width:880px;max-height:92vh;border-radius:22px 22px 0 0;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 -10px 50px rgba(0,0,0,.35);transform:translateY(24px);transition:transform .3s cubic-bezier(.2,.8,.2,1);}" +
".mf-overlay.mf-show .mf-modal{transform:translateY(0);}" +
"@media(min-width:768px){.mf-modal{border-radius:20px;max-height:88vh;}}" +
".mf-head{background:linear-gradient(135deg,var(--mf-maroon),var(--mf-maroon-deep));color:#fff;padding:16px 18px;display:flex;align-items:flex-start;justify-content:space-between;gap:10px;flex-shrink:0;}" +
".mf-head h2{font-family:'Fraunces',Georgia,serif;font-weight:700;font-size:19px;margin:0 0 2px;line-height:1.2;}" +
".mf-head p{margin:0;font-size:12.5px;opacity:.85;}" +
".mf-close{background:rgba(255,255,255,.16);border:none;color:#fff;width:30px;height:30px;border-radius:50%;font-size:17px;cursor:pointer;flex-shrink:0;display:flex;align-items:center;justify-content:center;line-height:1;}" +
".mf-close:hover{background:rgba(255,255,255,.28);}" +
".mf-tabs{display:flex;flex-shrink:0;border-bottom:1px solid var(--mf-line);background:var(--mf-paper);}" +
"@media(min-width:768px){.mf-tabs{display:none;}}" +
".mf-tab{flex:1;padding:12px 8px;text-align:center;font-weight:700;font-size:13.5px;color:var(--mf-ink-soft);background:none;border:none;cursor:pointer;border-bottom:3px solid transparent;}" +
".mf-tab.mf-active{color:var(--mf-maroon);border-bottom-color:var(--mf-gold);}" +
".mf-body{display:flex;flex:1;min-height:0;overflow:hidden;}" +
".mf-panel-menu{flex:1.25;min-width:0;overflow-y:auto;padding:14px 16px 90px;}" +
".mf-panel-chit{flex:1;min-width:0;overflow-y:auto;padding:16px;background:var(--mf-paper);border-left:1px dashed var(--mf-line);}" +
"@media(max-width:767px){.mf-panel-menu,.mf-panel-chit{flex:none;width:100%;display:none;border-left:none;padding-bottom:18px;}.mf-panel-menu.mf-shown,.mf-panel-chit.mf-shown{display:block;}}" +
".mf-chips{display:flex;gap:6px;overflow-x:auto;padding-bottom:10px;margin-bottom:6px;-ms-overflow-style:none;scrollbar-width:none;}" +
".mf-chips::-webkit-scrollbar{display:none;}" +
".mf-chip{flex-shrink:0;background:#fff;border:1.5px solid var(--mf-line);color:var(--mf-maroon);font-weight:700;font-size:12.5px;padding:6px 12px;border-radius:20px;cursor:pointer;white-space:nowrap;}" +
".mf-chip:hover{border-color:var(--mf-maroon);}" +
".mf-menulink{display:flex;align-items:center;gap:6px;background:none;border:1.5px solid var(--mf-gold);color:var(--mf-maroon-deep);font-weight:700;font-size:12.5px;padding:7px 13px;border-radius:20px;cursor:pointer;margin-bottom:14px;}" +
".mf-menulink:hover{background:#fff8e8;}" +
".mf-cat{margin-bottom:18px;}" +
".mf-cat h4{font-family:'Fraunces',Georgia,serif;color:var(--mf-maroon);font-size:15.5px;margin:0 0 8px;}" +
".mf-item{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:10px 0;border-bottom:1px solid var(--mf-line);}" +
".mf-item:last-child{border-bottom:none;}" +
".mf-item-name{font-weight:600;font-size:14.5px;color:var(--mf-ink);}" +
".mf-item-price{display:block;font-size:12.5px;color:var(--mf-ink-soft);margin-top:1px;}" +
".mf-stepper{display:flex;align-items:center;gap:8px;flex-shrink:0;}" +
".mf-add-btn{background:var(--mf-maroon);color:#fff;border:none;font-weight:700;font-size:13px;padding:8px 14px;border-radius:18px;cursor:pointer;}" +
".mf-add-btn:hover{background:var(--mf-maroon-deep);}" +
".mf-qty-grp{display:flex;align-items:center;gap:10px;background:#fff;border:1.5px solid var(--mf-maroon);border-radius:18px;padding:4px 6px;}" +
".mf-qty-btn{width:24px;height:24px;border-radius:50%;border:none;background:var(--mf-maroon);color:#fff;font-size:15px;font-weight:700;cursor:pointer;display:flex;align-items:center;justify-content:center;line-height:1;}" +
".mf-qty-btn:hover{background:var(--mf-maroon-deep);}" +
".mf-qty-num{font-weight:800;font-size:14px;color:var(--mf-ink);min-width:14px;text-align:center;}" +
".mf-disclaimer{font-size:11.5px;color:var(--mf-ink-soft);margin-top:10px;background:#fff8e8;border:1px solid #f0dca0;border-radius:8px;padding:8px 10px;}" +
".mf-chit-card{background:var(--mf-paper);border:1px solid var(--mf-line);border-radius:14px;position:relative;overflow:hidden;margin-bottom:16px;}" +
".mf-chit-perf{height:10px;background:repeating-linear-gradient(90deg,var(--mf-cream) 0 6px,transparent 6px 12px);}" +
".mf-chit-inner{padding:16px 16px 14px;}" +
".mf-chit-title{font-family:'Fraunces',Georgia,serif;font-weight:700;color:var(--mf-maroon);font-size:15px;margin:0 0 10px;display:flex;align-items:center;gap:6px;}" +
".mf-chit-empty{font-size:13px;color:var(--mf-ink-soft);text-align:center;padding:18px 6px;line-height:1.6;}" +
".mf-chit-row{display:flex;align-items:baseline;gap:6px;font-size:13.5px;color:var(--mf-ink);margin-bottom:7px;}" +
".mf-chit-row .mf-cn{font-weight:600;flex-shrink:0;}" +
".mf-chit-row .mf-cdots{flex:1;border-bottom:1px dotted #b9a98a;position:relative;top:-4px;}" +
".mf-chit-row .mf-cp{font-weight:700;flex-shrink:0;font-family:'Plus Jakarta Sans',monospace;}" +
".mf-chit-row .mf-crm{background:none;border:none;color:#b00;font-size:15px;cursor:pointer;padding:0 0 0 2px;line-height:1;}" +
".mf-chit-total{display:flex;justify-content:space-between;align-items:baseline;border-top:2px solid var(--mf-ink);margin-top:10px;padding-top:10px;font-weight:800;font-size:15.5px;color:var(--mf-maroon);}" +
".mf-chit-total span:last-child{font-family:'Plus Jakarta Sans',monospace;}" +
".mf-field-label{display:block;font-weight:700;font-size:12.5px;color:var(--mf-ink);margin:14px 0 6px;}" +
".mf-input,.mf-textarea{width:100%;padding:10px 12px;border:1.5px solid var(--mf-line);border-radius:9px;font-size:14px;font-family:inherit;box-sizing:border-box;background:#fff;color:var(--mf-ink);}" +
".mf-input:focus,.mf-textarea:focus{outline:none;border-color:var(--mf-maroon);}" +
".mf-textarea{resize:none;height:62px;}" +
".mf-err{color:#b00020;font-size:11.5px;margin-top:4px;display:none;}" +
".mf-err.mf-show-err{display:block;}" +
".mf-send-btn{width:100%;background:var(--mf-green);color:#fff;border:none;font-weight:800;font-size:15px;padding:14px;border-radius:12px;cursor:pointer;margin-top:16px;display:flex;align-items:center;justify-content:center;gap:8px;}" +
".mf-send-btn:hover{background:var(--mf-green-deep);}" +
".mf-fineprint{font-size:11.5px;color:var(--mf-ink-soft);text-align:center;margin-top:10px;line-height:1.5;}" +
".mf-mobilebar{position:absolute;left:0;right:0;bottom:0;background:linear-gradient(135deg,var(--mf-maroon),var(--mf-maroon-deep));color:#fff;padding:12px 16px;display:none;align-items:center;justify-content:space-between;gap:10px;}" +
".mf-mobilebar.mf-shown{display:flex;}" +
"@media(min-width:768px){.mf-mobilebar{display:none !important;}}" +
".mf-mobilebar b{font-size:14px;}" +
".mf-mobilebar small{display:block;opacity:.8;font-size:11px;font-weight:400;}" +
".mf-mobilebar button{background:#fff;color:var(--mf-maroon);border:none;font-weight:800;font-size:13px;padding:9px 16px;border-radius:18px;cursor:pointer;}" +
".mf-lightbox{position:fixed;inset:0;background:rgba(0,0,0,.92);z-index:999999;display:none;align-items:center;justify-content:center;flex-direction:column;}" +
".mf-lightbox.mf-show{display:flex;}" +
".mf-lightbox img{max-width:92vw;max-height:78vh;border-radius:6px;object-fit:contain;}" +
".mf-lb-controls{display:flex;align-items:center;gap:18px;margin-top:18px;}" +
".mf-lb-controls button{background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.3);color:#fff;width:42px;height:42px;border-radius:50%;font-size:18px;cursor:pointer;}" +
".mf-lb-controls button:hover{background:rgba(255,255,255,.22);}" +
".mf-lb-close{position:absolute;top:18px;right:20px;background:rgba(255,255,255,.12);border:1px solid rgba(255,255,255,.3);color:#fff;width:38px;height:38px;border-radius:50%;font-size:18px;cursor:pointer;}" +
".mf-lb-count{color:rgba(255,255,255,.7);font-size:12.5px;margin-top:10px;}" +
"@media(prefers-reduced-motion:reduce){.mf-overlay,.mf-modal{transition:none !important;}}" +
"body.mf-noscroll{overflow:hidden;}";
    document.head.appendChild(css);
  }

  // ---------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------
  function fmt(n) { return "₹" + Number(n).toLocaleString("en-IN"); }
  function activeRestaurant() { return S.restaurants[S.activeId]; }
  function cart() { return S.carts[S.activeId] || (S.carts[S.activeId] = {}); }
  function cartCount() {
    var c = cart(), n = 0;
    for (var k in c) n += c[k];
    return n;
  }
  function cartTotal() {
    var r = activeRestaurant(), c = cart(), total = 0;
    if (!r) return 0;
    r.categories.forEach(function (cat) {
      cat.items.forEach(function (it) {
        if (c[it.id]) total += c[it.id] * it.price;
      });
    });
    return total;
  }
  function hasStartingAtInCart() {
    var r = activeRestaurant(), c = cart(), found = false;
    if (!r) return false;
    r.categories.forEach(function (cat) {
      cat.items.forEach(function (it) {
        if (c[it.id] && it.startingAt) found = true;
      });
    });
    return found;
  }
  function findItem(restaurant, itemId) {
    var found = null;
    restaurant.categories.forEach(function (cat) {
      cat.items.forEach(function (it) { if (it.id === itemId) found = it; });
    });
    return found;
  }

  // ---------------------------------------------------------
  // DOM BUILD (once)
  // ---------------------------------------------------------
  var els = {};

  function buildDom() {
    if (els.overlay) return;

    var overlay = document.createElement("div");
    overlay.className = "mf-overlay mf-root";
    overlay.innerHTML =
      '<div class="mf-modal" role="dialog" aria-modal="true" aria-labelledby="mf-rname">' +
        '<div class="mf-head">' +
          '<div><h2 id="mf-rname"></h2><p id="mf-rtag"></p></div>' +
          '<button class="mf-close" aria-label="Close">×</button>' +
        '</div>' +
        '<div class="mf-tabs">' +
          '<button class="mf-tab mf-active" data-tab="menu">🍽️ Menu</button>' +
          '<button class="mf-tab" data-tab="chit">🧾 Your Chit <span id="mf-tabcount"></span></button>' +
        '</div>' +
        '<div class="mf-body" style="position:relative;">' +
          '<div class="mf-panel-menu mf-shown" id="mf-panel-menu"></div>' +
          '<div class="mf-panel-chit" id="mf-panel-chit"></div>' +
          '<div class="mf-mobilebar" id="mf-mobilebar">' +
            '<div><b id="mf-mb-total"></b><small id="mf-mb-sub">items in your chit</small></div>' +
            '<button id="mf-mb-view">View Chit →</button>' +
          '</div>' +
        '</div>' +
      '</div>';
    document.body.appendChild(overlay);
    els.overlay = overlay;
    els.modal = overlay.querySelector(".mf-modal");
    els.rname = overlay.querySelector("#mf-rname");
    els.rtag = overlay.querySelector("#mf-rtag");
    els.menuPanel = overlay.querySelector("#mf-panel-menu");
    els.chitPanel = overlay.querySelector("#mf-panel-chit");
    els.tabs = overlay.querySelectorAll(".mf-tab");
    els.tabcount = overlay.querySelector("#mf-tabcount");
    els.mobilebar = overlay.querySelector("#mf-mobilebar");
    els.mbTotal = overlay.querySelector("#mf-mb-total");
    els.mbSub = overlay.querySelector("#mf-mb-sub");

    overlay.querySelector(".mf-close").addEventListener("click", close);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    overlay.querySelector("#mf-mb-view").addEventListener("click", function () { setTab("chit"); });
    els.tabs.forEach(function (t) {
      t.addEventListener("click", function () { setTab(t.getAttribute("data-tab")); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && S.isOpen) close();
    });

    // Lightbox
    var lb = document.createElement("div");
    lb.className = "mf-lightbox mf-root";
    lb.innerHTML =
      '<button class="mf-lb-close" aria-label="Close">×</button>' +
      '<img id="mf-lb-img" alt="Menu">' +
      '<div class="mf-lb-controls">' +
        '<button id="mf-lb-prev" aria-label="Previous">‹</button>' +
        '<button id="mf-lb-next" aria-label="Next">›</button>' +
      '</div>' +
      '<div class="mf-lb-count" id="mf-lb-count"></div>';
    document.body.appendChild(lb);
    els.lb = lb;
    els.lbImg = lb.querySelector("#mf-lb-img");
    els.lbCount = lb.querySelector("#mf-lb-count");
    lb.querySelector(".mf-lb-close").addEventListener("click", closeLightbox);
    lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    lb.querySelector("#mf-lb-prev").addEventListener("click", function () { stepLightbox(-1); });
    lb.querySelector("#mf-lb-next").addEventListener("click", function () { stepLightbox(1); });
  }

  function setTab(tab) {
    S.tab = tab;
    els.tabs.forEach(function (t) {
      t.classList.toggle("mf-active", t.getAttribute("data-tab") === tab);
    });
    els.menuPanel.classList.toggle("mf-shown", tab === "menu");
    els.chitPanel.classList.toggle("mf-shown", tab === "chit");
    updateMobileBar();
  }

  function updateMobileBar() {
    var n = cartCount();
    var show = n > 0 && S.tab === "menu";
    els.mobilebar.classList.toggle("mf-shown", show);
    els.mbTotal.textContent = fmt(cartTotal());
    els.mbSub.textContent = n + (n === 1 ? " item in your chit" : " items in your chit");
  }

  // ---------------------------------------------------------
  // RENDER MENU
  // ---------------------------------------------------------
  function renderMenu() {
    var r = activeRestaurant();
    if (!r) return;
    var html = "";

    if (r.categories.length > 1) {
      html += '<div class="mf-chips">';
      r.categories.forEach(function (cat, i) {
        html += '<button class="mf-chip" data-jump="mf-cat-' + i + '">' + cat.title + "</button>";
      });
      html += "</div>";
    }

    if (r.menuImages && r.menuImages.length) {
      html += '<button class="mf-menulink" data-viewmenu="1">📋 View full menu card</button>';
    }

    r.categories.forEach(function (cat, i) {
      html += '<div class="mf-cat" id="mf-cat-' + i + '"><h4>' + cat.title + "</h4>";
      cat.items.forEach(function (it) {
        var qty = cart()[it.id] || 0;
        html += '<div class="mf-item" data-item="' + it.id + '">' +
          '<div><span class="mf-item-name">' + it.name + '</span>' +
          '<span class="mf-item-price">' + fmt(it.price) + (it.startingAt ? "+" : "") + "</span></div>" +
          '<div class="mf-stepper">' + stepperHtml(it.id, qty) + "</div></div>";
      });
      html += "</div>";
    });

    els.menuPanel.innerHTML = html;

    els.menuPanel.querySelectorAll("[data-jump]").forEach(function (chip) {
      chip.addEventListener("click", function () {
        var target = document.getElementById(chip.getAttribute("data-jump"));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    var viewMenuBtn = els.menuPanel.querySelector("[data-viewmenu]");
    if (viewMenuBtn) {
      viewMenuBtn.addEventListener("click", function () { openLightbox(r.menuImages, 0); });
    }
    bindStepperEvents(els.menuPanel);
  }

  function stepperHtml(itemId, qty) {
    if (qty <= 0) {
      return '<button class="mf-add-btn" data-add="' + itemId + '">+ Add</button>';
    }
    return '<div class="mf-qty-grp">' +
      '<button class="mf-qty-btn" data-dec="' + itemId + '" aria-label="Remove one">−</button>' +
      '<span class="mf-qty-num">' + qty + "</span>" +
      '<button class="mf-qty-btn" data-inc="' + itemId + '" aria-label="Add one">+</button>' +
      "</div>";
  }

  function bindStepperEvents(scope) {
    scope.querySelectorAll("[data-add],[data-inc]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-add") || btn.getAttribute("data-inc");
        changeQty(id, 1);
      });
    });
    scope.querySelectorAll("[data-dec]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        changeQty(btn.getAttribute("data-dec"), -1);
      });
    });
  }

  function changeQty(itemId, delta) {
    var c = cart();
    var q = (c[itemId] || 0) + delta;
    if (q <= 0) delete c[itemId];
    else c[itemId] = q;
    refreshAll();
  }

  // ---------------------------------------------------------
  // RENDER CHIT
  // ---------------------------------------------------------
  function renderChit() {
    var r = activeRestaurant();
    if (!r) return;
    var c = cart();
    var rows = "";
    var any = false;

    r.categories.forEach(function (cat) {
      cat.items.forEach(function (it) {
        if (c[it.id]) {
          any = true;
          rows += '<div class="mf-chit-row" data-row="' + it.id + '">' +
            '<span class="mf-cn">' + c[it.id] + "× " + it.name + "</span>" +
            '<span class="mf-cdots"></span>' +
            '<span class="mf-cp">' + fmt(c[it.id] * it.price) + (it.startingAt ? "+" : "") + "</span>" +
            '<button class="mf-crm" data-rm="' + it.id + '" aria-label="Remove">×</button>' +
            "</div>";
        }
      });
    });

    var total = cartTotal();
    var disclaimer = hasStartingAtInCart()
      ? '<div class="mf-disclaimer">⚠️ Items marked <b>+</b> start at the listed price — exact amount (size/toppings) will be confirmed by the restaurant on WhatsApp.</div>'
      : "";

    var chitBody = any
      ? rows + '<div class="mf-chit-total"><span>Total</span><span>' + fmt(total) + "</span></div>" + disclaimer
      : '<div class="mf-chit-empty">Your chit is empty.<br>Tap <b>+ Add</b> on any dish in the Menu tab — or just describe your order below. 🍽️</div>';

    var note = S.notes[S.activeId] || "";
    var name = S.name, phone = S.phone, address = S.address;

    els.chitPanel.innerHTML =
      '<div class="mf-chit-card"><div class="mf-chit-perf"></div><div class="mf-chit-inner">' +
        '<p class="mf-chit-title">🧾 Order Chit — ' + r.name + "</p>" +
        chitBody +
      "</div></div>" +
      '<label class="mf-field-label" for="mf-note">Special requests / off-menu items</label>' +
      '<textarea class="mf-textarea" id="mf-note" placeholder="e.g. less spicy, extra raita, 2 rotis on the side...">' + escapeHtml(note) + "</textarea>" +

      '<label class="mf-field-label" for="mf-name">Your name</label>' +
      '<input class="mf-input" id="mf-name" type="text" placeholder="Full name" value="' + escapeHtml(name) + '">' +
      '<div class="mf-err" id="mf-err-name">Please enter your name.</div>' +

      '<label class="mf-field-label" for="mf-phone">Phone number</label>' +
      '<input class="mf-input" id="mf-phone" type="tel" placeholder="10-digit mobile number" value="' + escapeHtml(phone) + '">' +
      '<div class="mf-err" id="mf-err-phone">Please enter a valid phone number.</div>' +

      '<label class="mf-field-label" for="mf-address">Delivery address</label>' +
      '<textarea class="mf-textarea" id="mf-address" placeholder="Hotel name / temple area / exact location">' + escapeHtml(address) + "</textarea>" +
      '<div class="mf-err" id="mf-err-address">Please enter a delivery address.</div>' +
      '<div class="mf-err" id="mf-err-empty">Add at least one dish, or describe your order above.</div>' +

      '<button class="mf-send-btn" id="mf-send">📲 Send Chit on WhatsApp</button>' +
      '<p class="mf-fineprint">Cash on delivery · We\'ll confirm availability &amp; final bill on WhatsApp.</p>';

    els.tabcount.textContent = cartCount() > 0 ? "(" + cartCount() + ")" : "";

    els.chitPanel.querySelectorAll("[data-rm]").forEach(function (btn) {
      btn.addEventListener("click", function () { changeQty(btn.getAttribute("data-rm"), -9999); });
    });
    els.chitPanel.querySelector("#mf-note").addEventListener("input", function (e) {
      S.notes[S.activeId] = e.target.value;
    });
    els.chitPanel.querySelector("#mf-name").addEventListener("input", function (e) { S.name = e.target.value; });
    els.chitPanel.querySelector("#mf-phone").addEventListener("input", function (e) { S.phone = e.target.value; });
    els.chitPanel.querySelector("#mf-address").addEventListener("input", function (e) { S.address = e.target.value; });
    els.chitPanel.querySelector("#mf-send").addEventListener("click", sendOrder);
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function refreshAll() {
    renderMenu();
    renderChit();
    updateMobileBar();
  }

  // ---------------------------------------------------------
  // SEND
  // ---------------------------------------------------------
  function showErr(id, show) {
    var el = els.chitPanel.querySelector("#" + id);
    if (el) el.classList.toggle("mf-show-err", !!show);
  }

  function sendOrder() {
    var r = activeRestaurant();
    var note = (S.notes[S.activeId] || "").trim();
    var hasCart = cartCount() > 0;
    var name = (S.name || "").trim();
    var phone = (S.phone || "").trim();
    var address = (S.address || "").trim();

    var ok = true;
    if (!hasCart && !note) { showErr("mf-err-empty", true); ok = false; } else showErr("mf-err-empty", false);
    if (!name) { showErr("mf-err-name", true); ok = false; } else showErr("mf-err-name", false);
    if (!phone || phone.replace(/\D/g, "").length < 10) { showErr("mf-err-phone", true); ok = false; } else showErr("mf-err-phone", false);
    if (!address) { showErr("mf-err-address", true); ok = false; } else showErr("mf-err-address", false);
    if (!ok) return;

    var lines = [];
    var c = cart();
    r.categories.forEach(function (cat) {
      cat.items.forEach(function (it) {
        if (c[it.id]) lines.push("• " + c[it.id] + "x " + it.name + " — " + fmt(c[it.id] * it.price) + (it.startingAt ? "+" : ""));
      });
    });

    var msg = "🍽️ FOOD ORDER — " + r.name + "\n\n";
    if (lines.length) {
      msg += "Order:\n" + lines.join("\n") + "\n\nSubtotal: " + fmt(cartTotal()) + (hasStartingAtInCart() ? " (variable items confirmed by restaurant)" : "") + "\n";
    }
    if (note) msg += "\nSpecial requests:\n" + note + "\n";
    msg += "\nName: " + name + "\nPhone: " + phone + "\nAddress: " + address + "\n\n_Sent via crulio.com/ManaunaDham_";

    var wa = (r.whatsapp || S.defaultWhatsapp || DEFAULT_WHATSAPP);
    window.location.href = "https://wa.me/" + wa + "?text=" + encodeURIComponent(msg.trim());
  }

  // ---------------------------------------------------------
  // OPEN / CLOSE
  // ---------------------------------------------------------
  function open(restaurantId) {
    buildDom();
    var id = restaurantId || S.activeId || Object.keys(S.restaurants)[0];
    if (!S.restaurants[id]) return;
    S.activeId = id;
    var r = S.restaurants[id];
    els.rname.textContent = r.name;
    els.rtag.textContent = r.tagline || "";
    setTab("menu");
    refreshAll();

    S.lastFocus = document.activeElement;
    els.overlay.classList.add("mf-show");
    document.body.classList.add("mf-noscroll");
    S.isOpen = true;
    setTimeout(function () { els.modal.querySelector(".mf-close").focus(); }, 50);
  }

  function close() {
    if (!els.overlay) return;
    els.overlay.classList.remove("mf-show");
    document.body.classList.remove("mf-noscroll");
    S.isOpen = false;
    if (S.lastFocus && S.lastFocus.focus) S.lastFocus.focus();
  }

  function quickAdd(restaurantId, itemId) {
    buildDom();
    open(restaurantId);
    var r = activeRestaurant();
    var item = findItem(r, itemId);
    if (item) changeQty(itemId, 1);
    setTab("chit");
  }

  // ---------------------------------------------------------
  // LIGHTBOX (shared utility — also used for page galleries)
  // ---------------------------------------------------------
  var lbState = { images: [], index: 0 };

  function openLightbox(images, startIndex) {
    buildDom();
    lbState.images = images || [];
    lbState.index = startIndex || 0;
    if (!lbState.images.length) return;
    showLightboxImage();
    els.lb.classList.add("mf-show");
    document.body.classList.add("mf-noscroll");
  }

  function closeLightbox() {
    els.lb.classList.remove("mf-show");
    if (!S.isOpen) document.body.classList.remove("mf-noscroll");
  }

  function stepLightbox(delta) {
    var n = lbState.images.length;
    lbState.index = (lbState.index + delta + n) % n;
    showLightboxImage();
  }

  function showLightboxImage() {
    els.lbImg.src = lbState.images[lbState.index];
    els.lbCount.textContent = (lbState.images.length > 1)
      ? (lbState.index + 1) + " / " + lbState.images.length
      : "";
    var controls = els.lb.querySelector(".mf-lb-controls");
    controls.style.display = lbState.images.length > 1 ? "flex" : "none";
  }

  // ---------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------
  function init(config) {
    ensureFonts();
    injectStyles();
    S.defaultWhatsapp = (config && config.defaultWhatsapp) || DEFAULT_WHATSAPP;
    (config.restaurants || []).forEach(function (r) {
      S.restaurants[r.id] = r;
    });
    if (!S.activeId && config.defaultRestaurant) S.activeId = config.defaultRestaurant;
  }

  window.ManaunaFood = {
    init: init,
    open: open,
    close: close,
    quickAdd: quickAdd,
    lightbox: openLightbox
  };
})();
