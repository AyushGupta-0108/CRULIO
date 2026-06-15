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

    .msc-reel {
      border-radius: 10px; overflow: hidden; margin-bottom: 12px;
      border: 1.5px solid #eee; background: #000;
      display: flex; align-items: center; justify-content: center;
      position: relative; cursor: pointer;
    }
    .msc-reel-thumb {
      width: 100%; display: block; border-radius: 8px;
    }
    .msc-reel-play {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%,-50%);
      background: rgba(0,0,0,0.55); border-radius: 50%;
      width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;
      font-size: 20px; color: white;
    }

    /* fact row */
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
  btn.innerHTML = `🙏 Customer Support`;
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

  const DISCLAIMER = `
    <div class="msc-alert">
      ⚠️ <b>Customer support sirf paid services ke liye hai</b> — Hotel, Taxi, Food.<br>
      Darshan / Jal / Mahant Ji ki info ke liye website pages dekhein.
    </div>`;

  function contactBlock(prefilledMsg) {
    const waMsg = encodeURIComponent(prefilledMsg);
    return `
      ${DISCLAIMER}
      <div class="msc-label">📞 Humse Sampark Karein</div>
      <button class="msc-opt wa" onclick="window.open('https://wa.me/${CONFIG.whatsappNumber}?text=${waMsg}','_blank')">
        💬 WhatsApp par Message Karein
      </button>
      <button class="msc-opt call" onclick="window.location.href='tel:${CONFIG.callNumber}'">
        📞 Call Karein — ${CONFIG.callNumber}
      </button>`;
  }

  // ══════════════════════════════════════
  // SCREENS
  // ══════════════════════════════════════

  window.mscShowMain = function () { showMain(); };
  window.showMain = showMain;

  function showMain() {
    render(`
      <div class="msc-greet">Jai Shree Shyam 🙏</div>
      <div class="msc-sub">Aap kaise help chahte hain?</div>

      <div class="msc-label">📚 Free Jaankari</div>
      <button class="msc-opt" onclick="showInfoMenu()">🛕 Darshan, Jal, Mahant Ji ke baare mein</button>
      <button class="msc-opt" onclick="showHotelRulesMenu()">🏨 Hotel — Check-in / Rules / Timing</button>

      <hr class="msc-div">
      <div class="msc-label">🛎️ Paid Services — Booking / Query</div>
      <button class="msc-opt green" onclick="showServiceMenu('hotel')">🏨 Hotel Booking</button>
      <button class="msc-opt green" onclick="showServiceMenu('taxi')">🚕 Taxi Booking</button>
      <button class="msc-opt green" onclick="showServiceMenu('food')">🍽️ Food Order</button>

      <hr class="msc-div">
      <div class="msc-label">📹 Hamaari Seva Dekhein</div>
      <a class="msc-yt" href="${CONFIG.social.ytChannel}/shorts/GLnD9qJ3WQA" target="_blank">
        <div class="msc-yt-icon">▶️</div>
        <div>
          <div class="msc-yt-text">Manauna Dham — Platform Tour</div>
          <div class="msc-yt-sub">YouTube Shorts · ${CONFIG.social.ytHandle}</div>
        </div>
      </a>
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

  // ── INFO MENU ──────────────────────────
  window.showInfoMenu = function () {
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">🛕 Free Jaankari</div>
      <div class="msc-sub">Kis topic ke baare mein jaanna chahte hain?</div>

      <button class="msc-opt" onclick="showPatientTokenInfo()">🔖 Patient Token — kaise milta hai?</button>
      <button class="msc-opt" onclick="showMahantTiming()">🕐 Mahant Ji kab baithte hain?</button>
      <button class="msc-opt" onclick="showWaitTime()">⏳ Kitna time lagta hai — line mein?</button>
      <button class="msc-opt" onclick="showShyamJalInfo()">💧 Shyam Jal kaise milta hai?</button>
      <button class="msc-opt" onclick="window.open('${CONFIG.pages.khatushyam}','_blank')">🛕 Khatu Shyam Ji ke baare mein</button>
      <button class="msc-opt" onclick="window.open('${CONFIG.pages.mahant}','_blank')">🧘 Mahant Ji ke baare mein</button>
      <button class="msc-opt" onclick="window.open('${CONFIG.pages.main}','_blank')">🏠 Manauna Dham ke baare mein</button>

      <hr class="msc-div">
      <div class="msc-warn">
        ℹ️ Inki puri jaankari humne website par likhi hai. Kripya page zaroor dekhein —
        aapke sabhi sawaalon ke jawab wahan milenge.
      </div>
      <button class="msc-opt ghost" onclick="showMain()">← Wapas</button>
    `);
  };

  // ── PATIENT TOKEN INFO ─────────────────
  window.showPatientTokenInfo = function () {
    render(`
      ${breadcrumb([{label: "🛕 Free Jaankari", fn: "showInfoMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🔖 Patient Token — Kaise Milta Hai?</div>

      <div class="msc-info">
        <b>✅ Patient Token ke liye patient ka khud present hona zaroori hai.</b><br>
        Family member ke jaane par token nahi milta — sirf Shyam Jal milta hai general line se.
      </div>

      <div class="msc-label">📋 Step-by-Step Process</div>
      <div class="msc-fact"><span class="msc-fact-icon">1️⃣</span><span>Manauna Dham pahunchein — Main Gate se andar jayein.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">2️⃣</span><span>Patient Token counter par line mein lagein (mandir ground ke andar).</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">3️⃣</span><span>Token milne par Mahant Ji ke paas jayein, apni problem batayein.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">4️⃣</span><span>Mahant Ji apne haathon se Abhimantrit Shyam Jal denge aur ashirwad denge.</span></div>

      <div class="msc-warn">
        📱 <b>Online advance booking</b> ke liye <b>"Manauna Dham" official app</b> download karein (Play Store / App Store).<br>
        Walk-in ke liye koi advance booking nahi hoti — seedha aakar line mein lagein.
      </div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.patient}','_blank')">📖 Poori Jaankari — Patient Page Dekhein</button>
      <button class="msc-opt ghost" onclick="showInfoMenu()">← Wapas</button>
    `);
  };

  // ── MAHANT JI TIMING ───────────────────
  window.showMahantTiming = function () {
    render(`
      ${breadcrumb([{label: "🛕 Free Jaankari", fn: "showInfoMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🕐 Mahant Ji — Timing & Availability</div>

      <div class="msc-label">📅 Darshan Timing</div>
      <div class="msc-fact"><span class="msc-fact-icon">🙏</span><span><b>Darshan:</b> Subah 7 AM – Raat 9 PM</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">🔔</span><span><b>Aarti:</b> Subah 8 AM aur Shaam 5 PM</span></div>

      <div class="msc-alert">
        ❌ <b>Mangalwar (Tuesday) & Budhwar (Wednesday)</b> — Mahant Ji nahi baithte.<br>
        Yeh unke regular off days hain. In dino Patient Token system <b>available nahi</b> hota.<br><br>
        ⚠️ Kabhi-kabhi <b>urgent kaam</b> ki wajah se kisi bhi din Mahant Ji unavailable ho sakte hain — yeh advance mein pata nahi chalta.
      </div>

      <div class="msc-info">
        💡 <b>Tip:</b> Door se aa rahe hain toh <b>Tuesday–Wednesday avoid karein</b>. Baki dino aana safer hai.
      </div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.patient}','_blank')">📖 Patient Page par aur jaankari dekhein</button>
      <button class="msc-opt ghost" onclick="showInfoMenu()">← Wapas</button>
    `);
  };

  // ── WAIT TIME (manually written — not on any page) ──
  window.showWaitTime = function () {
    render(`
      ${breadcrumb([{label: "🛕 Free Jaankari", fn: "showInfoMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">⏳ Kitna Time Lagta Hai?</div>

      <div class="msc-label">🕐 Approximate Wait Times</div>
      <div class="msc-fact"><span class="msc-fact-icon">🎫</span><span><b>Patient Token line:</b> Generally 30 min – 2 ghante lag sakte hain, rush par depend karta hai.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">💧</span><span><b>General Shyam Jal line:</b> Patient token line se lambi hoti hai — zyada bheed hoti hai.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">✅</span><span><b>Patient Token walon ko</b> comparatively jaldi darshan milta hai.</span></div>

      <div class="msc-warn">
        📅 <b>Tuesday & Wednesday avoid karein</b> — Mahant Ji nahi baithte in dino.<br>
        Peak season (weekends, festivals) mein wait time aur badh sakta hai.
      </div>

      <div class="msc-blue">
        ℹ️ Yeh jaankari ground-level anubhav par based hai — official source nahi.
        Actual time rush ke hisaab se change ho sakta hai.
      </div>

      <button class="msc-opt ghost" onclick="showInfoMenu()">← Wapas</button>
    `);
  };

  // ── SHYAM JAL INFO ─────────────────────
  window.showShyamJalInfo = function () {
    render(`
      ${breadcrumb([{label: "🛕 Free Jaankari", fn: "showInfoMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">💧 Shyam Jal — Kaise Milta Hai?</div>

      <div class="msc-info">
        Shyam Jal <b>sirf Manauna Dham mandir ground ke andar ek official counter</b> se milta hai.<br>
        Bahar se koi bhi Shyam Jal genuine nahi hota — dhokha ho sakta hai.
      </div>

      <div class="msc-label">📋 Do Tarike</div>
      <div class="msc-fact"><span class="msc-fact-icon">🎫</span><span><b>Patient Token waalon ko:</b> Mahant Ji apne haath se Abhimantrit Shyam Jal dete hain — yeh sabse pavitra form hai.</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">💧</span><span><b>General visitors:</b> Official counter se Shyam Jal lein, phir general line mein lagein. Har bottle ₹20 ki hai.</span></div>

      <div class="msc-warn">
        ⚠️ Meesho ya kisi bhi online platform se Shyam Jal mat khareedein — yeh adhikrit nahi hai.<br>
        Roz subah <b>11:55 AM se pehle</b> ek dhakkan peena chahiye (Mahant Ji ka nirdesh).
      </div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.jal}','_blank')">📖 Shyam Jal ki poori jaankari dekhein</button>
      <button class="msc-opt ghost" onclick="showInfoMenu()">← Wapas</button>
    `);
  };

  // ── HOTEL RULES MENU (manually written — not on any page) ──
  window.showHotelRulesMenu = function () {
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">🏨 Hotel — Check-in / Rules / Timing</div>
      <div class="msc-sub">Kya jaanna chahte hain?</div>

      <button class="msc-opt" onclick="showCheckinInfo()">🕐 Check-in / Checkout Timing</button>
      <button class="msc-opt" onclick="showEarlyCheckin()">⚡ Early Check-in Possible Hai?</button>
      <button class="msc-opt" onclick="showAdvanceFeeInfo()">💳 Advance Fee — Refundable Hai?</button>
      <button class="msc-opt" onclick="showHotelContactInfo()">📞 Hotel ka Contact Number</button>
      <button class="msc-opt" onclick="showReceiptInfo()">📄 Booking Receipt kahan milti hai?</button>

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="window.open('${CONFIG.pages.hotels}','_blank')">🏨 Hotels Page dekhein</button>
      <button class="msc-opt ghost" onclick="showMain()">← Wapas</button>
    `);
  };

  window.showCheckinInfo = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel Rules", fn: "showHotelRulesMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">🕐 Check-in & Checkout Timing</div>

      <div class="msc-label">⏰ Standard Timings</div>
      <div class="msc-fact"><span class="msc-fact-icon">✅</span><span><b>Check-in:</b> Dopahar 1:00 PM ke baad</span></div>
      <div class="msc-fact"><span class="msc-fact-icon">🚪</span><span><b>Checkout:</b> Subah 11:00 AM se pehle</span></div>

      <div class="msc-info">
        📄 Hotel pahunchne par <b>booking receipt</b> zaroor saath laayen — jo payment ke baad download karne ka option aata hai.<br><br>
        💰 <b>Baaki payment hotel par check-in ke waqt karein</b> (advance nahi, sirf remaining amount).
      </div>

      <button class="msc-opt ghost" onclick="showHotelRulesMenu()">← Wapas</button>
    `);
  };

  window.showEarlyCheckin = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel Rules", fn: "showHotelRulesMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">⚡ Early Check-in</div>

      <div class="msc-warn">
        ⚠️ Early check-in ki <b>hum guarantee nahi kar sakte</b>.<br><br>
        Agar hotel pahunchte waqt koi room khaali hoga toh mil sakta hai — lekin yeh confirm karna possible nahi hai advance mein.<br><br>
        <b>Hotel par pahunchne ke baad hi pata chalega.</b>
      </div>

      <div class="msc-blue">
        💡 Best approach: <b>Dopahar 1 PM ke aas-paas pahunchein</b> taaki standard check-in time par room pakka mile.
      </div>

      <button class="msc-opt ghost" onclick="showHotelRulesMenu()">← Wapas</button>
    `);
  };

  window.showAdvanceFeeInfo = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel Rules", fn: "showHotelRulesMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">💳 Advance Fee — Refund Policy</div>

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
        📋 <b>Cancel / change karna ho toh:</b> Jaldi se jaldi humse WhatsApp par baat karein.
      </div>

      <button class="msc-opt wa" onclick="window.open('https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent("Namaste 🙏\n\nMujhe hotel booking cancel/change karni hai.\n\n_Sent via ManaunaDham_")}','_blank')">
        💬 WhatsApp par Contact Karein
      </button>
      <button class="msc-opt ghost" onclick="showHotelRulesMenu()">← Wapas</button>
    `);
  };

  window.showHotelContactInfo = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel Rules", fn: "showHotelRulesMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">📞 Hotel Contact Number</div>

      <div class="msc-info">
        📄 Hotel ka contact number aapki <b>booking receipt par likha hota hai</b>.<br><br>
        Payment complete hone ke baad receipt download karein — uspe hotel ki saari details mil jaayengi.
      </div>

      <div class="msc-warn">
        ⚠️ Agar receipt nahi mili ya problem hai toh humse WhatsApp par baat karein — hum help karenge.
      </div>

      <button class="msc-opt wa" onclick="window.open('https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent("Namaste 🙏\n\nMujhe hotel contact number chahiye — receipt nahi mili.\n\n_Sent via ManaunaDham_")}','_blank')">
        💬 WhatsApp par Contact Karein
      </button>
      <button class="msc-opt ghost" onclick="showHotelRulesMenu()">← Wapas</button>
    `);
  };

  window.showReceiptInfo = function () {
    render(`
      ${breadcrumb([{label: "🏨 Hotel Rules", fn: "showHotelRulesMenu()"}])}
      <div class="msc-greet" style="font-size:14px;">📄 Booking Receipt</div>

      <div class="msc-info">
        ✅ Payment complete hone ke baad <b>receipt download karne ka option aata hai</b>.<br><br>
        <b>Receipt mein milega:</b><br>
        • Hotel ka naam aur address<br>
        • Hotel ka contact number<br>
        • Check-in / Checkout date<br>
        • Booking confirmation number<br>
        • Remaining amount jo hotel par dena hai
      </div>

      <div class="msc-warn">
        📌 Receipt saath zaroor laayen hotel check-in ke waqt — yeh identity proof hai aapki booking ka.
      </div>

      <div class="msc-alert">
        ❓ Receipt nahi mili? Humse WhatsApp par baat karein.
      </div>

      <button class="msc-opt wa" onclick="window.open('https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent("Namaste 🙏\n\nMujhe booking receipt nahi mili. Kripya help karein.\n\n_Sent via ManaunaDham_")}','_blank')">
        💬 WhatsApp par Contact Karein
      </button>
      <button class="msc-opt ghost" onclick="showHotelRulesMenu()">← Wapas</button>
    `);
  };

  // ── SERVICE MENU ───────────────────────
  window.showServiceMenu = function (service) {
    const labels = {
      hotel: { emoji: "🏨", name: "Hotel Booking",  page: CONFIG.pages.hotels },
      taxi:  { emoji: "🚕", name: "Taxi Booking",   page: CONFIG.pages.transport },
      food:  { emoji: "🍽️", name: "Food Order",    page: CONFIG.pages.food },
    };
    const s = labels[service];
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">${s.emoji} ${s.name}</div>
      <div class="msc-sub">Aap kya jaanna chahte hain?</div>

      <button class="msc-opt green" onclick="showHowToBook('${service}')">
        ❓ Book karna hai — kaise karein?
      </button>
      <button class="msc-opt green" onclick="showAlreadyBooked('${service}')">
        ✅ Maine already book kar liya — mujhe kuch poochna hai
      </button>

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="window.open('${s.page}','_blank')">📋 ${s.name} page dekhein</button>
      <button class="msc-opt ghost" onclick="showMain()">← Wapas</button>
    `);
  };

  // ── HOW TO BOOK ────────────────────────
  window.showHowToBook = function (service) {
    const labels = {
      hotel: { emoji: "🏨", name: "Hotel Booking",  ytLink: CONFIG.youtube.hotel, ytTitle: "Hotel kaise book karein — Step by step" },
      taxi:  { emoji: "🚕", name: "Taxi Booking",   ytLink: CONFIG.youtube.taxi,  ytTitle: "Taxi kaise book karein — Step by step" },
      food:  { emoji: "🍽️", name: "Food Order",    ytLink: CONFIG.youtube.food,  ytTitle: "Khana kaise order karein — Step by step" },
    };
    const s = labels[service];
    const preMsg = `Namaste 🙏\n\nMujhe ${s.name} ke baare mein kuch poochna tha.\n\n_Sent via ManaunaDham_`;

    render(`
      ${breadcrumb([{label: s.emoji + " " + s.name, fn: "showServiceMenu('" + service + "')"}])}
      <div class="msc-greet" style="font-size:14px;">${s.emoji} ${s.name} — Kaise Karein?</div>

      <div class="msc-info">
        📹 Humne ek <b>step-by-step video</b> banaya hai. Pehle yeh dekh lein —
        zyaadatar sawaalon ke jawab mil jaate hain!
      </div>

      <a class="msc-yt" href="${s.ytLink}" target="_blank">
        <div class="msc-yt-icon">▶️</div>
        <div>
          <div class="msc-yt-text">${s.ytTitle}</div>
          <div class="msc-yt-sub">YouTube par dekhein · ManaunaDham</div>
        </div>
      </a>

      <div class="msc-warn">
        ⚠️ Agar video dekhne ke baad bhi query hai, tabhi neeche contact karein.
      </div>

      ${contactBlock(preMsg)}

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="showServiceMenu('${service}')">← Wapas</button>
    `);
  };

  // ── ALREADY BOOKED ─────────────────────
  window.showAlreadyBooked = function (service) {
    const labels = {
      hotel: { emoji: "🏨", name: "Hotel Booking" },
      taxi:  { emoji: "🚕", name: "Taxi Booking"  },
      food:  { emoji: "🍽️", name: "Food Order"   },
    };
    const s = labels[service];

    // Extra hotel-specific options
    const hotelExtra = service === "hotel" ? `
      <button class="msc-opt green" onclick="showHotelRulesMenu()">
        🏨 Check-in timing / Rules jaanni hain
      </button>
      <button class="msc-opt green" onclick="showHotelContactInfo()">
        📞 Hotel ka contact number chahiye
      </button>
      <button class="msc-opt green" onclick="showReceiptInfo()">
        📄 Receipt nahi mili
      </button>
    ` : "";

    render(`
      ${breadcrumb([{label: s.emoji + " " + s.name, fn: "showServiceMenu('" + service + "')"}])}
      <div class="msc-greet" style="font-size:14px;">${s.emoji} ${s.name} — Query</div>
      <div class="msc-sub">Aapki query kya hai?</div>

      <div class="msc-label">Query type chunein</div>
      ${hotelExtra}
      <button class="msc-opt green" onclick="showBookedContact('${service}', 'Booking confirm nahi mili')">
        📩 Booking confirm nahi mili
      </button>
      <button class="msc-opt green" onclick="showBookedContact('${service}', 'Booking cancel / change karni hai')">
        🔄 Booking cancel / change karni hai
      </button>
      <button class="msc-opt green" onclick="showBookedContact('${service}', 'Payment se related query')">
        💳 Payment se related query
      </button>
      <button class="msc-opt green" onclick="showBookedContact('${service}', 'Koi aur sawaal')">
        💬 Koi aur sawaal
      </button>

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="showServiceMenu('${service}')">← Wapas</button>
    `);
  };

  window.showBookedContact = function (service, queryType) {
    const labels = {
      hotel: { emoji: "🏨", name: "Hotel Booking" },
      taxi:  { emoji: "🚕", name: "Taxi Booking"  },
      food:  { emoji: "🍽️", name: "Food Order"   },
    };
    const s = labels[service];
    const preMsg = `Namaste 🙏\n\nMujhe ${s.name} ke baare mein poochna tha.\n\nQuery: ${queryType}\n\n_Sent via ManaunaDham_`;

    render(`
      ${breadcrumb([
        {label: s.emoji + " " + s.name, fn: "showServiceMenu('" + service + "')"},
        {label: "Already Booked",       fn: "showAlreadyBooked('" + service + "')"},
      ])}
      <div class="msc-greet" style="font-size:14px;">${s.emoji} ${queryType}</div>

      ${contactBlock(preMsg)}

      <hr class="msc-div">
      <button class="msc-opt ghost" onclick="showAlreadyBooked('${service}')">← Wapas</button>
    `);
  };

  // ══════════════════════════════════════
  // INIT
  // ══════════════════════════════════════
  showMain();

})();
