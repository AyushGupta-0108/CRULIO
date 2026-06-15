(function () {
  if (document.getElementById("manauna-support-loaded")) return;

  const marker = document.createElement("div");
  marker.id = "manauna-support-loaded";
  document.body.appendChild(marker);

  // ══════════════════════════════════════
  // CONFIG
  // ══════════════════════════════════════
  const CONFIG = {
    whatsappNumber: "917817803342",
    callNumber: "+91-78178-03342",
    youtube: {
      hotel: "YOUR_HOTEL_BOOKING_VIDEO_LINK",
      taxi:  "YOUR_TAXI_BOOKING_VIDEO_LINK",
      food:  "YOUR_FOOD_ORDER_VIDEO_LINK",
      intro: "https://youtube.com/shorts/GLnD9qJ3WQA",
    },
    social: {
      instagram: "https://www.instagram.com/reel/DZjn3zsBunT/",
      igHandle:  "@crulionetworks",
      ytChannel: "https://www.youtube.com/@crulionetworks",
      ytHandle:  "@crulionetworks",
    },
    pages: {
      jal:        "https://www.crulio.com/ManaunaDham/jal",
      patient:    "https://www.crulio.com/ManaunaDham/patient",
      mahant:     "https://www.crulio.com/ManaunaDham/mahant",
      khatushyam: "https://www.crulio.com/ManaunaDham/khatushyam",
      hotels:     "https://www.crulio.com/ManaunaDham/hotels",
      transport:  "https://www.crulio.com/ManaunaDham/transport",
      food:       "https://www.crulio.com/ManaunaDham/food",
      main:       "https://www.crulio.com/ManaunaDham",
    }
  };

  // ══════════════════════════════════════
  // STYLES
  // ══════════════════════════════════════
  const style = document.createElement("style");
  style.innerHTML = `
    .msc-btn {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: linear-gradient(135deg, #7a0000, #4d0000);
      color: white;
      padding: 14px 20px;
      border-radius: 30px;
      font-weight: bold;
      cursor: pointer;
      z-index: 999999;
      font-family: Segoe UI, Arial, sans-serif;
      box-shadow: 0 4px 16px rgba(122,0,0,0.45);
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
      user-select: none;
      transition: transform 0.15s, box-shadow 0.15s;
    }
    .msc-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(122,0,0,0.55); }

    .msc-box {
      display: none;
      position: fixed;
      bottom: 80px;
      left: 20px;
      width: 340px;
      max-height: 74vh;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 14px 40px rgba(0,0,0,.26);
      z-index: 999999;
      overflow: hidden;
      font-family: Segoe UI, Arial, sans-serif;
      animation: mscSlideUp 0.2s ease;
    }
    @keyframes mscSlideUp {
      from { opacity:0; transform: translateY(12px); }
      to   { opacity:1; transform: translateY(0); }
    }

    .msc-header {
      background: linear-gradient(135deg, #7a0000, #4d0000);
      color: white;
      padding: 14px 16px;
      font-weight: 700;
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .msc-header-sub { font-size: 11px; font-weight: 400; opacity: 0.8; margin-top: 2px; }
    .msc-close { cursor: pointer; font-size: 22px; line-height: 1; opacity: 0.8; padding: 2px 4px; }
    .msc-close:hover { opacity: 1; }

    .msc-body {
      padding: 14px;
      overflow-y: auto;
      max-height: calc(74vh - 64px);
      font-size: 14px;
    }

    .msc-breadcrumb {
      display: flex; align-items: center; gap: 4px;
      font-size: 11px; color: #999; margin-bottom: 12px; flex-wrap: wrap;
    }
    .msc-breadcrumb span { cursor: pointer; color: #7a0000; }
    .msc-breadcrumb span:hover { text-decoration: underline; }
    .msc-breadcrumb .sep { color: #ccc; }

    .msc-opt {
      display: block; width: 100%; margin-bottom: 8px;
      padding: 11px 14px; border-radius: 9px;
      border: 1.5px solid #7a0000; background: white; color: #7a0000;
      font-weight: 600; cursor: pointer; text-align: left;
      font-size: 14px; transition: background 0.15s, color 0.15s, transform 0.1s;
      line-height: 1.45; font-family: Segoe UI, Arial, sans-serif;
    }
    .msc-opt:hover { background: #7a0000; color: white; transform: translateX(2px); }
    .msc-opt.green  { border-color: #1a7a3a; color: #1a7a3a; }
    .msc-opt.green:hover { background: #1a7a3a; color: white; }
    .msc-opt.wa     { border-color: #25D366; color: #25D366; }
    .msc-opt.wa:hover { background: #25D366; color: white; }
    .msc-opt.call   { border-color: #1565C0; color: #1565C0; }
    .msc-opt.call:hover { background: #1565C0; color: white; }
    .msc-opt.ghost  { border-color: #ccc; color: #888; font-weight: 400; font-size: 13px; }
    .msc-opt.ghost:hover { background: #f5f5f5; color: #555; transform: none; }
    .msc-opt.blue   { border-color: #1565C0; color: #1565C0; }
    .msc-opt.blue:hover { background: #1565C0; color: white; }

    .msc-label {
      font-size: 11px; font-weight: 700; text-transform: uppercase;
      letter-spacing: 1px; color: #aaa; margin: 14px 0 6px;
    }
    .msc-label:first-child { margin-top: 2px; }

    .msc-info {
      background: #f0fdf4; border: 1.5px solid #81c784;
      border-radius: 9px; padding: 10px 13px;
      font-size: 13px; color: #1a5c2a; margin-bottom: 12px; line-height: 1.65;
    }
    .msc-warn {
      background: #fff8e1; border: 1.5px solid #ffe082;
      border-radius: 9px; padding: 10px 13px;
      font-size: 13px; color: #5a4000; margin-bottom: 12px; line-height: 1.65;
    }
    .msc-alert {
      background: #fef2f2; border: 1.5px solid #fca5a5;
      border-radius: 9px; padding: 10px 13px;
      font-size: 13px; color: #7f1d1d; margin-bottom: 12px; line-height: 1.65;
    }
    .msc-blue {
      background: #eff6ff; border: 1.5px solid #93c5fd;
      border-radius: 9px; padding: 10px 13px;
      font-size: 13px; color: #1e3a5f; margin-bottom: 12px; line-height: 1.65;
    }

    .msc-div { border: none; border-top: 1px solid #f0e8d8; margin: 12px 0; }

    .msc-yt {
      background: #fff3f3; border: 1.5px solid #f5c6c6;
      border-radius: 10px; padding: 12px 14px; margin-bottom: 12px;
      display: flex; align-items: center; gap: 12px;
      cursor: pointer; transition: background 0.15s; text-decoration: none;
    }
    .msc-yt:hover { background: #ffe8e8; }
    .msc-yt-icon { font-size: 28px; flex-shrink: 0; }
    .msc-yt-text { font-size: 13px; color: #7a0000; font-weight: 600; line-height: 1.4; }
    .msc-yt-sub  { font-size: 11px; color: #999; font-weight: 400; margin-top: 2px; }

    .msc-greet { font-size: 15px; font-weight: 700; color: #7a0000; margin-bottom: 3px; }
    .msc-sub   { font-size: 13px; color: #777; margin-bottom: 14px; line-height: 1.5; }

    .msc-input {
      width: 100%; padding: 9px 11px;
      border: 1.5px solid #ddd; border-radius: 7px;
      font-size: 14px; margin: 6px 0 12px; box-sizing: border-box;
      font-family: Segoe UI, Arial, sans-serif;
    }
    .msc-input:focus { outline: none; border-color: #7a0000; }

    /* social strip */
    .msc-social {
      display: flex; gap: 8px; margin-top: 4px; margin-bottom: 12px;
    }
    .msc-social-card {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      gap: 4px; padding: 10px 6px; border-radius: 10px;
      border: 1.5px solid #eee; background: #fafafa;
      cursor: pointer; text-decoration: none;
      transition: background 0.15s, border-color 0.15s;
      font-family: Segoe UI, Arial, sans-serif;
    }
    .msc-social-card:hover { background: #f0f0f0; border-color: #ccc; }
    .msc-social-card.ig { border-color: #e1306c22; }
    .msc-social-card.ig:hover { background: #fff0f5; border-color: #e1306c; }
    .msc-social-card.yt { border-color: #ff000022; }
    .msc-social-card.yt:hover { background: #fff5f5; border-color: #ff0000; }
    .msc-social-icon { font-size: 20px; }
    .msc-social-handle { font-size: 10px; color: #555; font-weight: 600; }
    .msc-social-label  { font-size: 10px; color: #999; }

    .msc-fact { display: flex; align-items: flex-start; gap: 8px; margin-bottom: 7px; font-size: 13px; color: #333; }
    .msc-fact-icon { flex-shrink:0; font-size:15px; }

    @media (max-width: 480px) {
      .msc-box { width: calc(100vw - 20px); left: 10px; bottom: 74px; max-height: calc(100vh - 94px); }
      .msc-body { font-size: 15px; }
      .msc-opt  { font-size: 15px; padding: 12px 14px; }
    }
  `;
  document.head.appendChild(style);

  // ══════════════════════════════════════
  // DOM
  // ══════════════════════════════════════
  const btn = document.createElement("div");
  btn.className = "msc-btn";
  btn.innerHTML = `📞`;
  btn.onclick = () => {
    if (box.style.display === "block") {
      box.style.display = "none";
    } else {
      box.style.display = "block";
      showMain();
    }
  };

  const box = document.createElement("div");
  box.className = "msc-box";
  box.innerHTML = `
    <div class="msc-header">
      <div>
        <div>🙏 Manauna Dham</div>
        <div class="msc-header-sub">Customer Support</div>
      </div>
      <span class="msc-close">×</span>
    </div>
    <div class="msc-body" id="mscContent"></div>
  `;
  box.querySelector(".msc-close").onclick = () => { box.style.display = "none"; };

  document.body.appendChild(btn);
  document.body.appendChild(box);

  // ══════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════
  function render(html) {
    document.getElementById("mscContent").innerHTML = html;
  }

  function breadcrumb(steps) {
    let html = `<div class="msc-breadcrumb">🏠 <span onclick="mscShowMain()">Home</span>`;
    steps.forEach(s => {
      html += `<span class="sep">›</span><span onclick="${s.fn}">${s.label}</span>`;
    });
    html += `</div>`;
    return html;
  }

  function waBtn(msg, label) {
    return `<button class="msc-opt wa" onclick="window.open('https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}','_blank')">${label || "💬 WhatsApp par Contact Karein"}</button>`;
  }

  function backBtn(fn, label) {
    return `<button class="msc-opt ghost" onclick="${fn}">← ${label || "Back"}</button>`;
  }

  // ══════════════════════════════════════
  // SCREENS
  // ══════════════════════════════════════

  window.mscShowMain = function () { showMain(); };
  window.showMain = showMain;

  // ──────────────────────────────────────
  // HOME
  // ──────────────────────────────────────
  function showMain() {
    render(`
      <div class="msc-greet">Jai Shree Shyam 🙏</div>
      <div class="msc-sub">Aapka sawaal kis baare mein hai?</div>

      <div class="msc-label">🛕 Jaankari</div>
      <button class="msc-opt" onclick="showPatientTokenMenu()">🔖 Patient Token</button>
      <button class="msc-opt" onclick="showShyamJalMenu()">💧 Shyam Jal</button>
      <button class="msc-opt" onclick="showMahantMenu()">🧘 Mahant Ji</button>

      <hr class="msc-div">
      <div class="msc-label">🛎️ Booking / Services</div>
      <button class="msc-opt green" onclick="showHotelMenu()">🏨 Hotel</button>
      <button class="msc-opt green" onclick="showTaxiMenu()">🚕 Taxi / Cab</button>
      <button class="msc-opt green" onclick="showFoodMenu()">🍽️ Food Order</button>

      <hr class="msc-div">
      <div class="msc-label">ℹ️ About</div>
      <button class="msc-opt" onclick="showAboutCrulio()">🌐 Crulio ke baare mein</button>

      <hr class="msc-div">
      <div class="msc-label">📹 Follow Us</div>

      <div class="msc-social">
        <a class="msc-social-card ig" href="${CONFIG.social.instagram}" target="_blank">
          <span class="msc-social-icon">📸</span>
          <span class="msc-social-handle">${CONFIG.social.igHandle}</span>
          <span class="msc-social-label">Instagram</span>
        </a>
        <a class="msc-social-card yt" href="${CONFIG.social.ytChannel}" target="_blank">
          <span class="msc-social-icon">▶️</span>
          <span class="msc-social-handle">${CONFIG.social.ytHandle}</span>
          <span class="msc-social-label">YouTube</span>
        </a>
      </div>
    `);
  }

  // ══════════════════════════════════════
  // 1. PATIENT TOKEN
  // ══════════════════════════════════════

  window.showPatientTokenMenu = function () {
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">🔖 Patient Token</div>
      <div class="msc-sub">Kya jaanna chahte hain?</div>

      <button class="msc-opt" onclick="showPatientBookOnline()">📱 Online advance booking kaise karein?</button>
      <button class="msc-opt" onclick="showPatientBookOffline()">🚶 Walk-in (offline) par kaise milta hai?</button>
      <button class="msc-opt" onclick="showPatientEligibility()">👥 Kisko milta hai Patient Token?</button>
      <button class="msc-opt" onclick="showPatientAfterToken()">⏱️ Token milne ke baad Mahant Ji se milne mein kitna samay?</button>
      <button class="msc-opt" onclick="showPatientCantCome()">🏠 Patient khud nahi aa sakta - kya karein?</button>

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="window.open('${CONFIG.pages.patient}','_blank')">📖 Patient Token page dekhein</button>
      ${backBtn("showMain()")}
    `);
  };

  window.showPatientBookOnline = function () {
    render(`
      ${breadcrumb([{label: "🔖 Patient Token", fn: "showPatientTokenMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">📱 Online Advance Booking</div>

      <div class="msc-info">
        ✅ Online advance booking ke liye <b>"Manauna Dham" official app</b> download karein.<br><br>
        📲 Available on: <b>Play Store</b> (Android) aur <b>App Store</b> (iPhone)
      </div>

      <div class="msc-warn">
        ⚠️ Patient ko saath leke jae darshan ke liye.
      </div>

      <div class="msc-blue">
        💡 <b>Tip:</b> Online booking se aapko jaldi token milta hai - bheed mein line nahi lagni padti.
      </div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.patient}','_blank')">📖 Patient page par aur jaankari dekhein</button>
      ${backBtn("showPatientTokenMenu()")}
    `);
  };

  window.showPatientBookOffline = function () {
    render(`
      ${breadcrumb([{label: "🔖 Patient Token", fn: "showPatientTokenMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🚶 Walk-in (Offline) Process</div>

      <div class="msc-label">📋 Step-by-Step</div>
      <div class="msc-fact"><span class="msc-fact-icon">1️⃣</span><span>Manauna Dham pahunchein - Main Gate se andar jayein.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">2️⃣</span><span><b>Shyam Jal counter par jaayein</b> aur pehle Shyam Jal khareedein (₹20/bottle).</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">3️⃣</span><span><b>Patient Token counter</b> par line mein lagein (mandir ground ke andar).</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">4️⃣</span><span>Token milne par apna number aane ka intezaar karein.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">5️⃣</span><span>Number aane par Mahant Ji ke paas jayein, apni problem batayein.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">6️⃣</span><span>Mahant Ji apne haathon se Abhimantrit Shyam Jal denge aur ashirwad denge.</span></div>

      <div class="msc-info">
        ⏱️ Patient Token line general line se <b>comparatively fast</b> hoti hai.
      </div>

      <div class="msc-alert">
        ❌ Walk-in ke liye <b>kisiko paise na de</b> - seedha aakar counter par jaayein.
      </div>

      ${backBtn("showPatientTokenMenu()")}
    `);
  };

  window.showPatientEligibility = function () {
    render(`
      ${breadcrumb([{label: "🔖 Patient Token", fn: "showPatientTokenMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">👥 Kisko Milta Hai Patient Token?</div>

      <div class="msc-info">
        ✅ <b>Patient Token sirf un logon ko milta hai jinhe Mahant Ji se seedha darshan lena ho</b> - yaani jo khud beemar hain ya koi gambhir samasya hai.
      </div>

      <div class="msc-label">✅ Token milega</div>
      <div class="msc-fact"><span class="msc-fact-icon">✔️</span><span>Patient jo <b>cancer ya stratecher pe ho</b></span></div>
      <div class="msc-fact"><span class="msc-fact-icon">✔️</span><span>Koi gambhir samasya waale log</span></div>

      <div class="msc-label">❌ Token nahi milega</div>
      <div class="msc-fact"><span class="msc-fact-icon">❌</span><span><b>Sirf or sirf</b> patient ko hi milega healthy insaan ko nhi milega</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">❌</span><span>Patient ghar par ho aur koi aur jaaye unki jgh - yeh valid nahi hai</span></div>

      <div class="msc-warn">
        ℹ️ Baaki log jo patients nahi hai aur mahant ji ke darshan krna chahta hai vo normal line mai lage jal lene ke baad
      </div>

      <button class="msc-opt" onclick="showPatientCantCome()">🏠 Patient khud nahi aa sakta - kya karein?</button>
      ${backBtn("showPatientTokenMenu()")}
    `);
  };

  window.showPatientAfterToken = function () {
    render(`
      ${breadcrumb([{label: "🔖 Patient Token", fn: "showPatientTokenMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">⏱️ Token ke Baad Kitna Samay Lagta Hai?</div>

      <div class="msc-label">🕐 Approximate Time</div>
      <div class="msc-fact"><span class="msc-fact-icon">🎫</span><span><b>Patient Token line:</b> Approx. <b>30 min – 2 ghante</b> - rush par depend karta hai.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">💧</span><span><b>General (Normal) line:</b> Patient token line se lambi hoti hai - zyada bheed hoti hai.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">✅</span><span>Patient Token walon ko <b>comparatively jaldi</b> darshan milta hai general visitors se.</span></div>

      <div class="msc-warn">
        📅 <b>Tuesday & Wednesday ko avoid karein</b> - Mahant Ji in dino nahi baithte.<br>
        Peak season (weekends, festivals) mein wait time aur badh sakta hai.
      </div>

      <div class="msc-blue">
        ℹ️ Yeh estimate ground-level experience par based hai. Actual time rush ke hisaab se change ho sakta hai.
      </div>

      ${backBtn("showPatientTokenMenu()")}
    `);
  };

  window.showPatientCantCome = function () {
    render(`
      ${breadcrumb([{label: "🔖 Patient Token", fn: "showPatientTokenMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🏠 Patient Khud Nahi Aa Sakta</div>

      <div class="msc-alert">
        ❌ Agar patient khud nahi aa sakta toh <b>Patient Token nahi milega</b>.<br>
        Token sirf patient ke khud present hone par milta hai.
      </div>

      <div class="msc-warn">
        💡 Is situation mein family member jaa sakta hai aur:<br><br>
        • <b>Normal line</b> mein lag ke mahant ji se mil sakte hai<br>
      </div>

    

  
      <button class="msc-opt ghost" onclick="window.open('${CONFIG.pages.jal}','_blank')">💧 Shyam Jal puri jaankari</button>
      ${backBtn("showPatientTokenMenu()")}
    `);
  };

  // ══════════════════════════════════════
  // 2. SHYAM JAL
  // ══════════════════════════════════════

  window.showShyamJalMenu = function () {
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">💧 Shyam Jal</div>
      <div class="msc-sub">Kya jaanna chahte hain?</div>

      <button class="msc-opt" onclick="showShyamJalKyaHai()">❓ Shyam Jal kya hai?</button>
      <button class="msc-opt" onclick="showShyamJalKahan()">📍 Kahan milta hai? (Kaise lein)</button>
      <button class="msc-opt" onclick="showShyamJalKabPiyen()">🕐 Kab aur kitna piyen?</button>
      <button class="msc-opt" onclick="showShyamJalOnline()">🛒 Online/Meesho se le sakte hain?</button>
      <button class="msc-opt" onclick="showShyamJalFaq()">❓ Aksar Pooche Jaane Waale Sawaal</button>

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="window.open('${CONFIG.pages.jal}','_blank')">📖 Shyam Jal page dekhein</button>
      ${backBtn("showMain()")}
    `);
  };

  window.showShyamJalKyaHai = function () {
    render(`
      ${breadcrumb([{label: "💧 Shyam Jal", fn: "showShyamJalMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">❓ Shyam Jal Kya Hai?</div>

      <div class="msc-info">
        Manauna Dham <b>Shri Khatu Shyam Ji ki Janmbhoomi</b> hai. Yahan ka Shyam Jal <b>Mahant Omendra Chauhan Ji</b> dwara <b>Abhimantrit</b> kiya jata hai.<br><br>
        Har bottle mein Mahant Ji ka aashirwad hota hai.<br><br>
        💧 Manauna Dham ka jal shareer aur ghar ki <b>negative energies ko door</b> karta hai aur <b>Shri Khatu Shyam Ji ka aashirwad</b> milta hai.
      </div>

      <div class="msc-label">✨ Labh (Benefits)</div>
      <div class="msc-fact"><span class="msc-fact-icon">✅</span><span>Shareer ki negative urja door hoti hai</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">✅</span><span>Shri Khatu Shyam Ji ka aashirwad milta hai</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">✅</span><span>Ghar ke sabhi logo ko de sakte hain</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">✅</span><span>Koi side effect nahi hota - yeh sirf positive prabhav dalta hai</span></div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.jal}','_blank')">📖 Poori jaankari dekhein</button>
      ${backBtn("showShyamJalMenu()")}
    `);
  };

  window.showShyamJalKahan = function () {
    render(`
      ${breadcrumb([{label: "💧 Shyam Jal", fn: "showShyamJalMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">📍 Shyam Jal Kahan Se Milta Hai?</div>

      <div class="msc-alert">
        ⚠️ Shyam Jal <b>sirf Manauna Dham mandir ground ke andar ek official counter</b> se milta hai.<br>
        Bahar se ya online koi bhi Shyam Jal genuine nahi hota.
      </div>

      <div class="msc-label">📋 Do Tarike</div>
      <div class="msc-fact"><span class="msc-fact-icon">🎫</span><span><b>Patient Token waalon ko (SABSE PAVITRA):</b><br>Pehle Shyam Jal counter se Jal khareedein → fir Patient Token counter par line lagein → token milne par Mahant Ji seedha apne haath se Abhimantrit Jal denge.</span></div>
      <div class="msc-fact" style="margin-top:8px;"><span class="msc-fact-icon">💧</span><span><b>General visitors (bina token ke):</b><br>Official Shyam Jal counter se bottle lein (₹20 each), phir normal darshan line mein lagein.</span></div>

      <div class="msc-info">
        🏷️ Bottle <b>₹20</b> ki hai aur plastic bottle mein milti hai jiske cap par <b>official Manauna Dham logo</b> hota hai.<br><br>
        Jitni chahein utni bottles le jaa sakte hain.
      </div>

      <div class="msc-warn">
        ⚠️ Mahant Ji <b>Tuesday & Wednesday</b> ko nahi baithte. Kabhi-kabhi urgent kaam se anya din bhi unavailable ho sakte hain.
      </div>

      ${backBtn("showShyamJalMenu()")}
    `);
  };

  window.showShyamJalKabPiyen = function () {
    render(`
      ${breadcrumb([{label: "💧 Shyam Jal", fn: "showShyamJalMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🕐 Kab Aur Kitna Piyen?</div>

      <div class="msc-info">
        📌 <b>Mahant Ji ka nirdesh:</b><br><br>
        • Roz subah <b>11:55 AM se pehle</b> ek dhakkan (cap) Shyam Jal piyen<br>
        • Ghar ke <b>poore parivar</b> ko de sakte hain<br>
        • Jitni baar chahein utna le ke jaa sakte hain dham se
      </div>

      <div class="msc-blue">
        ℹ️ Koi side effect nahi hota. Yeh Abhimantrit jal hai - sirf positive prabhav dalta hai.
      </div>

      ${backBtn("showShyamJalMenu()")}
    `);
  };

  window.showShyamJalOnline = function () {
    render(`
      ${breadcrumb([{label: "💧 Shyam Jal", fn: "showShyamJalMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🛒 Online / Meesho se Le Sakte Hain?</div>

      <div class="msc-alert">
        ❌ <b>Bilkul nahi.</b><br><br>
        Shyam Jal mandir dwara online mangwana <b>mana hai</b>.<br>
        Meesho ya kisi bhi online platform se becha jaane wala Shyam Jal <b>adhikrit nahi</b> hai - yeh dhokha ho sakta hai.<br><br>
        Duplicate aur naqli bottles market mein milti hain - isliye hamesha official counter se hi lein.
      </div>

      <div class="msc-info">
        ✅ <b>Saccha Shyam Jal paane ka ek hi rasta hai:</b><br>
        Khud Manauna Dham aayen aur mandir ground ke andar official counter se lein.
      </div>

      ${backBtn("showShyamJalMenu()")}
    `);
  };

  window.showShyamJalFaq = function () {
    render(`
      ${breadcrumb([{label: "💧 Shyam Jal", fn: "showShyamJalMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">❓ Shyam Jal - FAQ</div>

      <div class="msc-label">Sawaal aur Jawab</div>
      <div class="msc-info"><b>Q: Kya roz le sakta hoon?</b><br>Haan. Mahant Ji kehte hain roz subah 11:55 AM se pehle ek dhakkan zaroor piyen.</div>
      <div class="msc-info"><b>Q: Kya poore parivar ko de sakte hain?</b><br>Haan, zaroor. Ghar mein sabko fayda milta hai.</div>
      <div class="msc-info"><b>Q: Koi side effect toh nahi?</b><br>Nahi. Yeh Abhimantrit jal hai - koi side effect nahi hota.</div>
      <div class="msc-info"><b>Q: Agar main Manauna Dham nahi aa sakta?</b><br>Aap humse WhatsApp par baat kar sakte hain - hum koshish karenge solution dhundhne ki.</div>

      ${backBtn("showShyamJalMenu()")}
    `);
  };

  // ══════════════════════════════════════
  // 3. MAHANT JI
  // ══════════════════════════════════════

  window.showMahantMenu = function () {
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">🧘 Mahant Ji</div>
      <div class="msc-sub">Kya jaanna chahte hain?</div>

      <button class="msc-opt" onclick="showMahantAbout()">🙏 Mahant Ji ke baare mein</button>
      <button class="msc-opt" onclick="showMahantMilneTarike()">👁️ Mahant Ji se milne ke 2 tarike</button>
      <button class="msc-opt" onclick="showMahantTiming()">🕐 Kab baithte hain? (Timing & Off Days)</button>

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="window.open('${CONFIG.pages.mahant}','_blank')">📖 Mahant Ji ka page dekhein</button>
      ${backBtn("showMain()")}
    `);
  };

  window.showMahantAbout = function () {
    render(`
      ${breadcrumb([{label: "🧘 Mahant Ji", fn: "showMahantMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🙏 Mahant Omendra Chauhan Ji</div>

      <div class="msc-info">
        <b>Mahant Omendra Chauhan Ji</b> Manauna Dham ke pradhan sant hain.<br><br>
        Woh <b>Shyam Jal ko Abhimantrit</b> karte hain - har bottle mein unka aashirwad hota hai.<br><br>
        Patient Token se aane wale bhakton ko woh apne haathon se Jal dete hain aur unki samasya sunkar <b>ashirwad dete hain</b>.
      </div>

  

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.mahant}','_blank')">📖 Mahant Ji ki poori jaankari dekhein</button>
      ${backBtn("showMahantMenu()")}
    `);
  };

  window.showMahantMilneTarike = function () {
    render(`
      ${breadcrumb([{label: "🧘 Mahant Ji", fn: "showMahantMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">👁️ Mahant Ji Se Milne Ke 2 Tarike</div>

      <div class="msc-info">
        <b>⭐ Sabse Pehle:</b> Shyam Jal counter se Jal zaroor khareedein - yeh pehla kadam hai.
      </div>

      <div class="msc-label">Tarika 1 - Patient Token (Best Option)</div>
      <div class="msc-fact"><span class="msc-fact-icon">🎫</span><span>Patient khud present ho toh <b>Patient Token counter</b> par jaayein aur token lein.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">✅</span><span>Token milne par Mahant Ji ke paas seedha jaayein - woh <b>apne haathon se Abhimantrit Shyam Jal</b> denge aur ashirwad denge.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">⏱️</span><span>Line comparatively fast hoti hai.</span></div>

      <div class="msc-label">Tarika 2 - Normal / General Line</div>
      <div class="msc-fact"><span class="msc-fact-icon">💧</span><span>Patient token nahi hai toh <b>Normal line</b> mein lagein.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">⚠️</span><span>Mahant Ji ka <b>personal darshan bhi hoga</b> - Shyam Jal counter se Jal milega.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">⏱️</span><span>Yeh line Patient Token line se <b>lambi hoti hai</b>.</span></div>

      <div class="msc-label">⏰ Timing</div>
      <div class="msc-fact"><span class="msc-fact-icon">🙏</span><span><b>Darshan:</b> Subah 7 AM – Raat 9 PM</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">🔔</span><span><b>Aarti:</b> Subah 8 AM aur Shaam 5 PM</span></div>

      <div class="msc-alert">
        ❌ <b>Tuesday & Wednesday</b> - Mahant Ji nahi baithte.<br>
        In dino Patient Token system available nahi hota.
      </div>

      ${backBtn("showMahantMenu()")}
    `);
  };

  window.showMahantTiming = function () {
    render(`
      ${breadcrumb([{label: "🧘 Mahant Ji", fn: "showMahantMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🕐 Mahant Ji - Timing & Off Days</div>

      <div class="msc-label">📅 Regular Timing</div>
      <div class="msc-fact"><span class="msc-fact-icon">🙏</span><span><b>Darshan:</b> Subah 7 AM – Raat 9 PM</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">🔔</span><span><b>Aarti:</b> Subah 8 AM aur Shaam 5 PM</span></div>

      <div class="msc-alert">
        ❌ <b>Mangalwar (Tuesday) & Budhwar (Wednesday)</b> - Mahant Ji nahi baithte.<br>
        Yeh unke regular off days hain. In dino Patient Token system <b>available nahi</b> hota.<br><br>
        ⚠️ Kabhi-kabhi <b>urgent kaam</b> ki wajah se kisi bhi din Mahant Ji unavailable ho sakte hain - yeh advance mein pata nahi chalta.
      </div>

      <div class="msc-info">
        💡 <b>Tip:</b> Door se aa rahe hain toh <b>Tuesday–Wednesday avoid karein</b>. Baki dino aana safer hai.
      </div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.patient}','_blank')">📖 Patient page par aur jaankari</button>
      ${backBtn("showMahantMenu()")}
    `);
  };

  // ══════════════════════════════════════
  // 4. HOTEL
  // ══════════════════════════════════════

  window.showHotelMenu = function () {
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">🏨 Hotel</div>
      <div class="msc-sub">Aap kya jaanna chahte hain?</div>

      <div class="msc-label">📋 Jaankari</div>
      <button class="msc-opt" onclick="showHotelCheckin()">🕐 Check-in & Checkout timing</button>
      <button class="msc-opt" onclick="showHotelEarlyCheckin()">⚡ Early check-in possible hai?</button>
      <button class="msc-opt" onclick="showHotelAdvanceFee()">💳 Advance fee - refundable hai?</button>
      <button class="msc-opt" onclick="showHotelReceipt()">📄 Booking receipt kahan milegi?</button>
      <button class="msc-opt" onclick="showHotelManagerNumber()">📞 Hotel manager ka number</button>
      <button class="msc-opt" onclick="showHotelDateChange()">📅 Booking dates change karni hain</button>
      <button class="msc-opt" onclick="showHotelAddress()">📍 Hotel ka address kahan dekhein?</button>

      <hr class="msc-div">
      <div class="msc-label">🛎️ Booking / Query</div>
      <button class="msc-opt green" onclick="showHotelBookNew()">➕ Naya booking karna hai</button>
      <button class="msc-opt green" onclick="showHotelAlreadyBooked()">✅ Maine book kar liya - kuch poochna hai</button>

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="window.open('${CONFIG.pages.hotels}','_blank')">🏨 Hotels page dekhein</button>
      ${backBtn("showMain()")}
    `);
  };

  window.showHotelCheckin = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel", fn: "showHotelMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🕐 Check-in & Checkout Timing</div>

      <div class="msc-label">⏰ Standard Timings</div>
      <div class="msc-fact"><span class="msc-fact-icon">✅</span><span><b>Check-in:</b> Dopahar 1:00 PM ke baad</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">🚪</span><span><b>Checkout:</b> Subah 11:00 AM se pehle</span></div>

      <div class="msc-info">
        📄 Hotel pahunchne par <b>booking receipt</b> zaroor saath laayen.<br><br>
        💰 <b>Baaki payment hotel par check-in ke waqt karein</b> - receipt mein likha bacha hua amount dena hoga.
      </div>

      ${backBtn("showHotelMenu()")}
    `);
  };

  window.showHotelEarlyCheckin = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel", fn: "showHotelMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">⚡ Early Check-in</div>

      <div class="msc-warn">
        ⚠️ Early check-in ki <b>hum guarantee nahi kar sakte</b>.<br><br>
        Agar hotel pahunchte waqt koi room khaali hoga toh mil sakta hai - lekin yeh confirm karna possible nahi hai advance mein.<br><br>
        <b>Hotel par pahunchne ke baad hi pata chalega.</b>
      </div>

      <div class="msc-blue">
        💡 Best approach: <b>Dopahar 1 PM ke aas-paas pahunchein</b> taaki standard check-in time par room pakka mile.
      </div>

      ${backBtn("showHotelMenu()")}
    `);
  };

  window.showHotelAdvanceFee = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel", fn: "showHotelMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">💳 Advance Fee - Refund Policy</div>

      <div class="msc-alert">
        ❌ <b>Advance fee non-refundable hai.</b><br><br>
        Booking cancel karne par advance amount wapas nahi milta.<br>
        Isliye booking confirm karne se pehle dates pakki kar lein.
      </div>

      <div class="msc-info">
        ✅ Baaki payment (remaining amount) hotel par check-in ke waqt karein.<br>
        Advance payment sirf booking secure karne ke liye hoti hai.
      </div>

      <div class="msc-warn">
        📋 <b>Booking dates change karna ho toh:</b> Jaldi se jaldi humse WhatsApp par baat karein.
      </div>

      ${waBtn("Namaste 🙏\n\nMujhe hotel booking cancel/change karni hai.\n\n_Sent via ManaunaDham_")}
      ${backBtn("showHotelMenu()")}
    `);
  };

  window.showHotelReceipt = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel", fn: "showHotelMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">📄 Booking Receipt</div>

      <div class="msc-info">
        ✅ Payment complete hone ke baad <b>receipt download karne ka option aata hai</b>.<br><br>
        <b>Receipt mein milega:</b><br>
        • Hotel ka contact number<br>
        • Check-in / Checkout date<br>
        • Booking confirmation number<br>
        • Remaining amount jo hotel par dena hai<br>
        • Booking se related saari jaankari
      </div>

      <div class="msc-warn">
        📌 Receipt saath zaroor laayen hotel check-in ke waqt - yeh aapki booking ka identity proof hai.
      </div>

      <div class="msc-alert">
        ❓ Receipt nahi mili? Humse WhatsApp par baat karein.
      </div>

      ${waBtn("Namaste 🙏\n\nMujhe booking receipt nahi mili. Kripya help karein.\n\n_Sent via ManaunaDham_")}
      ${backBtn("showHotelMenu()")}
    `);
  };

  window.showHotelManagerNumber = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel", fn: "showHotelMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">📞 Hotel Manager Ka Number</div>

      <div class="msc-info">
        📄 Hotel manager ka contact number aapki <b>booking receipt par likha hota hai</b>.<br><br>
        Payment complete hone ke baad receipt download karein - uspe hotel ki saari contact details mil jaayengi.
      </div>

      <div class="msc-warn">
        ⚠️ Agar receipt nahi mili ya problem hai toh humse WhatsApp par baat karein - hum help karenge.
      </div>

      ${waBtn("Namaste 🙏\n\nMujhe hotel contact number chahiye - receipt nahi mili.\n\n_Sent via ManaunaDham_")}
      ${backBtn("showHotelMenu()")}
    `);
  };

  window.showHotelDateChange = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel", fn: "showHotelMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">📅 Booking Dates Change</div>

      <div class="msc-warn">
        ⚠️ Dates change karna <b>guaranteed nahi</b> hai - availability par depend karta hai.<br><br>
        Jaldi se jaldi humse contact karein - last minute mein mushkil ho sakti hai.
      </div>

      <div class="msc-alert">
        ❌ Agar booking cancel ho jaaye toh <b>advance fee wapas nahi milti</b>.
      </div>

      ${waBtn("Namaste 🙏\n\nMujhe apni hotel booking ki dates change karni hain.\n\nBooking ka naam / confirmation number:\nCurrent dates:\nNew dates jo chahiye:\n\n_Sent via ManaunaDham_", "💬 WhatsApp par Dates Change Request Karein")}
      ${backBtn("showHotelMenu()")}
    `);
  };

  window.showHotelAddress = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel", fn: "showHotelMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">📍 Hotel Ka Address</div>

      <div class="msc-info">
        📄 Hotel ka <b>exact address aapki booking receipt mein</b> hota hai.<br><br>
        Payment ke baad receipt download karein - usme hotel ka address, Google Maps link sab milega.
      </div>

      <div class="msc-blue">
        🏨 Hotels page par <b>har hotel ki location aur basic details</b> bhi dekh sakte hain.
      </div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.hotels}','_blank')">🏨 Hotels page - address dekhein</button>
      ${waBtn("Namaste 🙏\n\nMujhe apne hotel ka address chahiye.\n\n_Sent via ManaunaDham_", "💬 WhatsApp par Address Maangein")}
      ${backBtn("showHotelMenu()")}
    `);
  };

  window.showHotelBookNew = function () {
    const preMsg = "Namaste 🙏\n\nMujhe Manauna Dham ke liye hotel book karna hai.\n\n_Sent via ManaunaDham_";
    render(`
      ${breadcrumb([{label: "🏨 Hotel", fn: "showHotelMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🏨 Hotel Book Karna Hai</div>

      <div class="msc-info">
        📹 Humne ek <b>step-by-step video</b> banaya hai. Pehle yeh dekh lein - zyaadatar sawaalon ke jawab mil jaate hain!
      </div>

      <a class="msc-yt" href="${CONFIG.youtube.hotel}" target="_blank">
        <div class="msc-yt-icon">▶️</div>
        <div>
          <div class="msc-yt-text">Hotel kaise book karein - Step by step</div>
          <div class="msc-yt-sub">YouTube par dekhein · ManaunaDham</div>
        </div>
      </a>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.hotels}','_blank')">🏨 Hotels page par jaayein aur book karein</button>

      <div class="msc-warn">⚠️ Agar page dekhne ke baad bhi query hai toh neeche contact karein.</div>

      ${waBtn(preMsg)}
      <button class="msc-opt call" onclick="window.location.href='tel:${CONFIG.callNumber}'">📞 Call Karein - ${CONFIG.callNumber}</button>
      ${backBtn("showHotelMenu()")}
    `);
  };

  window.showHotelAlreadyBooked = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel", fn: "showHotelMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">✅ Booking Ho Gayi - Query</div>
      <div class="msc-sub">Aapki query kya hai?</div>

      <button class="msc-opt green" onclick="showHotelCheckin()">🕐 Check-in timing jaanni hai</button>
      <button class="msc-opt green" onclick="showHotelReceipt()">📄 Receipt nahi mili</button>
      <button class="msc-opt green" onclick="showHotelManagerNumber()">📞 Hotel ka number chahiye</button>
      <button class="msc-opt green" onclick="showHotelDateChange()">📅 Dates change karni hain</button>
      <button class="msc-opt green" onclick="showHotelAddress()">📍 Hotel ka address chahiye</button>
      <button class="msc-opt green" onclick="showHotelBookedContact('Booking confirm nahi mili')">📩 Booking confirm nahi mili</button>
      <button class="msc-opt green" onclick="showHotelBookedContact('Payment se related query')">💳 Payment se related query</button>
      <button class="msc-opt green" onclick="showHotelBookedContact('Koi aur sawaal')">💬 Koi aur sawaal</button>

      ${backBtn("showHotelMenu()")}
    `);
  };

  window.showHotelBookedContact = function (queryType) {
    const preMsg = `Namaste 🙏\n\nMeri hotel booking ke baare mein poochna tha.\n\nQuery: ${queryType}\n\n_Sent via ManaunaDham_`;
    render(`
      ${breadcrumb([
        {label: "🏨 Hotel", fn: "showHotelMenu()"},
        {label: "Already Booked", fn: "showHotelAlreadyBooked()"},
      ])}
      <div class="msc-greet" style="font-size:14px;">🏨 ${queryType}</div>

      ${waBtn(preMsg)}
      <button class="msc-opt call" onclick="window.location.href='tel:${CONFIG.callNumber}'">📞 Call Karein - ${CONFIG.callNumber}</button>

      ${backBtn("showHotelAlreadyBooked()", "Back")}
    `);
  };

  // ══════════════════════════════════════
  // 5. TAXI / CAB
  // ══════════════════════════════════════

  window.showTaxiMenu = function () {
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">🚕 Taxi / Cab</div>
      <div class="msc-sub">Aap kya jaanna chahte hain?</div>

      <div class="msc-label">📋 Jaankari & Pricing</div>
      <button class="msc-opt" onclick="showTaxiPrices()">💰 Kitna kiraya lagega? (Prices)</button>
      <button class="msc-opt" onclick="showTaxiRoutes()">🗺️ Kahan se kahan tak service hai?</button>
      <button class="msc-opt" onclick="showTaxiAdvanceFee()">💳 Advance kitna dena hoga?</button>
      <button class="msc-opt" onclick="showTaxiCabType()">🚗 Kaun sa cab available hai?</button>
      <button class="msc-opt" onclick="showTaxiDistance()">📏 Manauna Dham kitna door hai?</button>

      <hr class="msc-div">
      <div class="msc-label">🛎️ Booking / Query</div>
      <button class="msc-opt green" onclick="showTaxiBookNew()">➕ Cab book karna hai</button>
      <button class="msc-opt green" onclick="showTaxiAlreadyBooked()">✅ Maine book kar liya - kuch poochna hai</button>

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="window.open('${CONFIG.pages.transport}','_blank')">🚕 Transport page dekhein</button>
      ${backBtn("showMain()")}
    `);
  };

  window.showTaxiPrices = function () {
    render(`
      ${breadcrumb([{label: "🚕 Taxi", fn: "showTaxiMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">💰 Taxi Prices</div>

      <div class="msc-label">📋 Route-wise Fares (7-Seater)</div>
      <div class="msc-fact"><span class="msc-fact-icon">🚉</span><span><b>Bareilly Railway Station → Dham:</b> from ₹1,599 (One Way)</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">✈️</span><span><b>Bareilly Airport → Dham:</b>  from ₹1,599 (One Way)</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">📌</span><span><b>Anywhere in Bareilly → Dham:</b> from ₹1,599 (One Way)</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">🛫</span><span><b>Delhi Airport (IGI) → Dham:</b> from ₹3,099 (One Way, 7-Seater)</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">↩️</span><span><b>Return Trip:</b> Bareilly return from ₹2,999 (bigger discount)</span></div>

      <div class="msc-info">
        💡 <b>Return trip par zyada discount milta hai.</b> Book karte waqt "Return Trip" select karein.<br><br>
        🎁 Upto ₹200 discount bhi available hai - booking form mein apply karein.
      </div>

      <div class="msc-blue">
        📌 Other U.P. cities ya Other Delhi/NCR locations ke liye price WhatsApp par confirm hoga.
      </div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.transport}','_blank')">🚕 Exact price check karein (booking form)</button>
      ${backBtn("showTaxiMenu()")}
    `);
  };

  window.showTaxiRoutes = function () {
    render(`
      ${breadcrumb([{label: "🚕 Taxi", fn: "showTaxiMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🗺️ Service Routes</div>

      <div class="msc-label">✅ Available Pickup Points</div>
      <div class="msc-fact"><span class="msc-fact-icon">🏙️</span><span><b>Bareilly</b> - Station, Airport, ya koi bhi jagah</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">📍</span><span><b>Other U.P. Cities</b> - Price WhatsApp par confirm hoga</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">✈️</span><span><b>Delhi Airport (IGI)</b> - Terminal 1, 2, ya 3</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">🏛️</span><span><b>Other Delhi/NCR</b> (Noida, Gurgaon, etc.) - Price WhatsApp par confirm hoga</span></div>

      <div class="msc-info">
        🏁 <b>Destination:</b> Sabhi trips ka destination Manauna Dham (Aonla, Bareilly) hai.<br><br>
        ↩️ <b>Return Trip:</b> Same pickup ya different drop location bhi available hai.
      </div>

      ${backBtn("showTaxiMenu()")}
    `);
  };

  window.showTaxiAdvanceFee = function () {
    render(`
      ${breadcrumb([{label: "🚕 Taxi", fn: "showTaxiMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">💳 Advance Payment</div>

      <div class="msc-info">
        ✅ Booking confirm karne ke liye sirf <b>15% advance online pay</b> karna hota hai.<br><br>
        Remaining <b>85% fare driver ko seedha pickup ke waqt dein</b>.
      </div>

      <div class="msc-warn">
        ⚠️ Online payment mein <b>5% platform fee bhi lagti hai</b> - yeh booking management ke liye hoti hai aur ek baar charge hoti hai.<br><br>
        Yaani Total Pay Now = 15% advance + 5% platform fee.
      </div>

      <div class="msc-alert">
        ❌ <b>Advance aur platform fee non-refundable hain.</b> Booking cancel karne par wapas nahi milte.
      </div>

      ${backBtn("showTaxiMenu()")}
    `);
  };

  window.showTaxiCabType = function () {
    render(`
      ${breadcrumb([{label: "🚕 Taxi", fn: "showTaxiMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🚗 Available Cab Types</div>

      <div class="msc-info">
        ✅ <b>7-Seater cab available hai</b> - spacious aur comfortable, families ke liye best.<br>
        Up to 7 passengers + luggage easily fit hota hai.
      </div>

      <div class="msc-warn">
        🔜 <b>5-Seater (Sedan/Hatchback)</b> - Coming Soon. Abhi sirf 7-Seater available hai.
      </div>

      ${backBtn("showTaxiMenu()")}
    `);
  };

  window.showTaxiDistance = function () {
    render(`
      ${breadcrumb([{label: "🚕 Taxi", fn: "showTaxiMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">📏 Manauna Dham - Distance</div>

      <div class="msc-label">🗺️ Route Distances</div>
      <div class="msc-fact"><span class="msc-fact-icon">🚉</span><span><b>Bareilly Station:</b> ~43 km · ~1 hr 15 min</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">✈️</span><span><b>Bareilly Airport:</b> ~51 km · ~1 hr 25 min</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">🛫</span><span><b>Delhi Airport (IGI):</b> ~250 km · ~4.5 – 5 hrs</span></div>

      <div class="msc-blue">
        📍 Manauna Dham address:<br>
        Shri Shyam Ji Mandir, Manauna, Tehsil - Aonla,<br>
        District - Bareilly, Uttar Pradesh - 243301
      </div>

      <button class="msc-opt" onclick="window.open('https://maps.app.goo.gl/bF7V8LSARG6mNSy97','_blank')">🗺️ Google Maps par Location Dekhein</button>
      ${backBtn("showTaxiMenu()")}
    `);
  };

  window.showTaxiBookNew = function () {
    const preMsg = "Jai Shyam! 🙏\n\nMujhe Manauna Dham ke liye cab chahiye.\n\n_Sent via ManaunaDham_";
    render(`
      ${breadcrumb([{label: "🚕 Taxi", fn: "showTaxiMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🚕 Cab Book Karna Hai</div>

      <div class="msc-info">
        📹 Pehle <b>step-by-step video</b> dekh lein - booking process samajh aayegi!
      </div>

      <a class="msc-yt" href="${CONFIG.youtube.taxi}" target="_blank">
        <div class="msc-yt-icon">▶️</div>
        <div>
          <div class="msc-yt-text">Taxi kaise book karein - Step by step</div>
          <div class="msc-yt-sub">YouTube par dekhein · ManaunaDham</div>
        </div>
      </a>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.transport}','_blank')">🚕 Transport page par jaayein aur book karein</button>

      <div class="msc-warn">⚠️ Agar page dekhne ke baad bhi query hai toh neeche contact karein.</div>

      ${waBtn(preMsg)}
      <button class="msc-opt call" onclick="window.location.href='tel:${CONFIG.callNumber}'">📞 Call Karein - ${CONFIG.callNumber}</button>
      ${backBtn("showTaxiMenu()")}
    `);
  };

  window.showTaxiAlreadyBooked = function () {
    render(`
      ${breadcrumb([{label: "🚕 Taxi", fn: "showTaxiMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">✅ Booking Ho Gayi - Query</div>
      <div class="msc-sub">Aapki query kya hai?</div>

      <button class="msc-opt green" onclick="showTaxiBookedContact('Driver ka number chahiye')">📞 Driver ka number chahiye</button>
      <button class="msc-opt green" onclick="showTaxiReceiptInfo()">📄 Receipt nahi mili</button>
      <button class="msc-opt green" onclick="showTaxiBookedContact('Booking confirm nahi mili')">📩 Booking confirm nahi mili</button>
      <button class="msc-opt green" onclick="showTaxiBookedContact('Booking cancel / change karni hai')">🔄 Booking cancel / change karni hai</button>
      <button class="msc-opt green" onclick="showTaxiBookedContact('Payment se related query')">💳 Payment se related query</button>
      <button class="msc-opt green" onclick="showTaxiBookedContact('Koi aur sawaal')">💬 Koi aur sawaal</button>

      ${backBtn("showTaxiMenu()")}
    `);
  };

  window.showTaxiReceiptInfo = function () {
    render(`
      ${breadcrumb([
        {label: "🚕 Taxi", fn: "showTaxiMenu()"},
        {label: "Already Booked", fn: "showTaxiAlreadyBooked()"},
      ])}
      <div class="msc-greet" style="font-size:14px;">📄 Taxi Booking Receipt</div>

      <div class="msc-info">
        ✅ Payment complete hone ke baad <b>receipt download krne ka option aata hai</b>.<br><br>
        <b>Receipt mein milega:</b><br>
        • Driver helpline number<br>
        • Pickup date & time<br>
        • Invoice / Booking number<br>
        • Advance paid aur remaining 85% amount<br>
        • Cab type aur trip details
      </div>

      <div class="msc-warn">
        📌 Pickup ke waqt driver ko yeh receipt dikhaayen.<br>
        85% fare driver ko directly dein at pickup.
      </div>


      <div class="msc-alert">
        ❓ Receipt nahi mili? Humse WhatsApp par sampark karein.
      </div>

      ${waBtn("Namaste 🙏\n\nMujhe taxi booking receipt nahi mili. Kripya help karein.\n\n_Sent via ManaunaDham_")}
      ${backBtn("showTaxiAlreadyBooked()", "Back")}
    `);
  };

  window.showTaxiBookedContact = function (queryType) {
    const preMsg = `Namaste 🙏\n\nMeri taxi booking ke baare mein poochna tha.\n\nQuery: ${queryType}\n\n_Sent via ManaunaDham_`;
    render(`
      ${breadcrumb([
        {label: "🚕 Taxi", fn: "showTaxiMenu()"},
        {label: "Already Booked", fn: "showTaxiAlreadyBooked()"},
      ])}
      <div class="msc-greet" style="font-size:14px;">🚕 ${queryType}</div>

      ${waBtn(preMsg)}
      <button class="msc-opt call" onclick="window.location.href='tel:${CONFIG.callNumber}'">📞 Call Karein - ${CONFIG.callNumber}</button>
      <div class="msc-info" style="margin-top:8px;">ℹ️ <b>Driver ka number booking receipt mein share kiya jaayega.</b></div>

      ${backBtn("showTaxiAlreadyBooked()", "Back")}
    `);
  };

  // ══════════════════════════════════════
  // 6. FOOD
  // ══════════════════════════════════════

  window.showFoodMenu = function () {
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">🍽️ Food Order</div>
      <div class="msc-sub">Aap kya jaanna chahte hain?</div>

      <div class="msc-label">📋 Jaankari</div>
      <button class="msc-opt" onclick="showFoodDelivery()">🚚 Food kahan deliver hoga?</button>
      <button class="msc-opt" onclick="showFoodType()">🥗 Khane ka type (Satvik / Veg?)</button>

      <hr class="msc-div">
      <div class="msc-label">🛎️ Booking / Query</div>
      <button class="msc-opt green" onclick="showFoodBookNew()">➕ Khana order karna hai</button>
      <button class="msc-opt green" onclick="showFoodAlreadyOrdered()">✅ Maine order kar liya - kuch poochna hai</button>

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="window.open('${CONFIG.pages.food}','_blank')">🍽️ Food page dekhein</button>
      ${backBtn("showMain()")}
    `);
  };

  window.showFoodDelivery = function () {
    render(`
      ${breadcrumb([{label: "🍽️ Food", fn: "showFoodMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🚚 Food Delivery Location</div>

      <div class="msc-info">
        📍 Food delivery <b>aapke hotel/dharamshala</b> ya <b>mandir ke bahar designated area</b> mein milti hai.
      </div>

      <div class="msc-alert">
        ❌ <b>Mandir ke andar delivery possible nahi hai.</b>
      </div>

      <div class="msc-blue">
        💡 Order karte waqt apna exact location / room number zaroor bataayen.
      </div>

      ${backBtn("showFoodMenu()")}
    `);
  };

  window.showFoodType = function () {
    render(`
      ${breadcrumb([{label: "🍽️ Food", fn: "showFoodMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🥗 Khane Ka Type</div>

      <div class="msc-info">
        ✅ Manauna Dham mein <b>satvik (pure vegetarian)</b> khana milta hai - pilgrimage ke anukool.<br><br>
        Delicious, fresh meals local restaurants se available hain.
      </div>

      <div class="msc-blue">
        💡 Pre-order available hai - pehle se order karein taaki waqt par mile.
      </div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.food}','_blank')">🍽️ Menu dekhein - Food page</button>
      ${backBtn("showFoodMenu()")}
    `);
  };

  window.showFoodBookNew = function () {
    const preMsg = "Namaste 🙏\n\nMujhe Manauna Dham mein khana order karna hai.\n\n_Sent via ManaunaDham_";
    render(`
      ${breadcrumb([{label: "🍽️ Food", fn: "showFoodMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🍽️ Khana Order Karna Hai</div>

      <div class="msc-info">
        📹 Pehle <b>step-by-step video</b> dekh lein!
      </div>

      <a class="msc-yt" href="${CONFIG.youtube.food}" target="_blank">
        <div class="msc-yt-icon">▶️</div>
        <div>
          <div class="msc-yt-text">Khana kaise order karein - Step by step</div>
          <div class="msc-yt-sub">YouTube par dekhein · ManaunaDham</div>
        </div>
      </a>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.food}','_blank')">🍽️ Food page par jaayein aur order karein</button>

      <div class="msc-warn">⚠️ Agar page dekhne ke baad bhi query hai toh neeche contact karein.</div>

      ${waBtn(preMsg)}
      ${backBtn("showFoodMenu()")}
    `);
  };

  window.showFoodAlreadyOrdered = function () {
    render(`
      ${breadcrumb([{label: "🍽️ Food", fn: "showFoodMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">✅ Order Ho Gaya - Query</div>
      <div class="msc-sub">Aapki query kya hai?</div>

      <button class="msc-opt green" onclick="showFoodOrderedContact('Order confirm nahi mila')">📩 Order confirm nahi mila</button>
      <button class="msc-opt green" onclick="showFoodOrderedContact('Delivery nahi aayi')">🚚 Delivery nahi aayi</button>
      <button class="msc-opt green" onclick="showFoodOrderedContact('Order cancel karni hai')">🔄 Order cancel karni hai</button>
      <button class="msc-opt green" onclick="showFoodOrderedContact('Payment se related query')">💳 Payment se related query</button>
      <button class="msc-opt green" onclick="showFoodOrderedContact('Koi aur sawaal')">💬 Koi aur sawaal</button>

      ${backBtn("showFoodMenu()")}
    `);
  };

  window.showFoodOrderedContact = function (queryType) {
    const preMsg = `Namaste 🙏\n\nMere food order ke baare mein poochna tha.\n\nQuery: ${queryType}\n\n_Sent via ManaunaDham_`;
    render(`
      ${breadcrumb([
        {label: "🍽️ Food", fn: "showFoodMenu()"},
        {label: "Already Ordered", fn: "showFoodAlreadyOrdered()"},
      ])}
      <div class="msc-greet" style="font-size:14px;">🍽️ ${queryType}</div>

      ${waBtn(preMsg)}
      <button class="msc-opt call" onclick="window.location.href='tel:${CONFIG.callNumber}'">📞 Call Karein - ${CONFIG.callNumber}</button>

      ${backBtn("showFoodAlreadyOrdered()", "Back")}
    `);
  };

  // ══════════════════════════════════════
  // 7. ABOUT CRULIO
  // ══════════════════════════════════════

  window.showAboutCrulio = function () {
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">🌐 Crulio - ManaunaDham Platform</div>

      <div class="msc-info">
        <b>Crulio Networks</b> ek <b>destination-based pilgrim services platform</b> hai.<br><br>
        ManaunaDham (crulio.com/ManaunaDham) Crulio ka pehla destination hai - jahan aap <b>free information</b> ke saath saath <b>hotel booking, cab, aur food order</b> kar sakte hain - sab ek jagah par.
      </div>

      <div class="msc-label">ℹ️ Important Note</div>
      <div class="msc-warn">
        ⚠️ Crulio aur ManaunaDham.org.in ek <b>independent pilgrim services platform</b> hai.<br>
        Hum mandir management se affiliated nahi hain. Hum sirf bhakton ki madad karte hain.
      </div>

      <div class="msc-label">✅ Hamaari Services</div>
      <div class="msc-fact"><span class="msc-fact-icon">🏨</span><span>Verified hotel/dharamshala bookings</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">🚕</span><span>Cab/taxi booking (Bareilly, U.P., Delhi)</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">🍽️</span><span>Food delivery coordination</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">📚</span><span>Shyam Jal, Patient Token, Mahant Ji ki jaankari</span></div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.main}','_blank')">🏠 ManaunaDham main page dekhein</button>
      <div class="msc-social" style="margin-top:12px;">
        <a class="msc-social-card ig" href="${CONFIG.social.instagram}" target="_blank">
          <span class="msc-social-icon">📸</span>
          <span class="msc-social-handle">${CONFIG.social.igHandle}</span>
          <span class="msc-social-label">Instagram</span>
        </a>
        <a class="msc-social-card yt" href="${CONFIG.social.ytChannel}" target="_blank">
          <span class="msc-social-icon">▶️</span>
          <span class="msc-social-handle">${CONFIG.social.ytHandle}</span>
          <span class="msc-social-label">YouTube</span>
        </a>
      </div>
      ${backBtn("showMain()")}
    `);
  };

  // ══════════════════════════════════════
  // INIT
  // ══════════════════════════════════════
  showMain();


})();
