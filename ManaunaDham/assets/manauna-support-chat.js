(function () {
  if (document.getElementById("manauna-support-loaded")) return;

  const marker = document.createElement("div");
  marker.id = "manauna-support-loaded";
  document.body.appendChild(marker);

  // ══════════════════════════════════════
  // CONFIG — replace YouTube links & phone
  // ══════════════════════════════════════
  const CONFIG = {
    whatsappNumber: "917817803342",
    callNumber: "+91-78178-03342",
    youtube: {
      hotel:     "YOUR_HOTEL_BOOKING_VIDEO_LINK",
      taxi:      "YOUR_TAXI_BOOKING_VIDEO_LINK",
      food:      "YOUR_FOOD_ORDER_VIDEO_LINK",
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
    .msc-header-sub {
      font-size: 11px;
      font-weight: 400;
      opacity: 0.8;
      margin-top: 2px;
    }
    .msc-close {
      cursor: pointer;
      font-size: 22px;
      line-height: 1;
      opacity: 0.8;
      padding: 2px 4px;
    }
    .msc-close:hover { opacity: 1; }

    .msc-body {
      padding: 14px;
      overflow-y: auto;
      max-height: calc(74vh - 64px);
      font-size: 14px;
    }

    /* Breadcrumb */
    .msc-breadcrumb {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      color: #999;
      margin-bottom: 12px;
      flex-wrap: wrap;
    }
    .msc-breadcrumb span { cursor: pointer; color: #7a0000; }
    .msc-breadcrumb span:hover { text-decoration: underline; }
    .msc-breadcrumb .sep { color: #ccc; }

    /* Buttons */
    .msc-opt {
      display: block;
      width: 100%;
      margin-bottom: 8px;
      padding: 11px 14px;
      border-radius: 9px;
      border: 1.5px solid #7a0000;
      background: white;
      color: #7a0000;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      font-size: 14px;
      transition: background 0.15s, color 0.15s, transform 0.1s;
      line-height: 1.45;
      font-family: Segoe UI, Arial, sans-serif;
    }
    .msc-opt:hover { background: #7a0000; color: white; transform: translateX(2px); }
    .msc-opt.green { border-color: #1a7a3a; color: #1a7a3a; }
    .msc-opt.green:hover { background: #1a7a3a; color: white; }
    .msc-opt.wa { border-color: #25D366; color: #25D366; }
    .msc-opt.wa:hover { background: #25D366; color: white; }
    .msc-opt.call { border-color: #1565C0; color: #1565C0; }
    .msc-opt.call:hover { background: #1565C0; color: white; }
    .msc-opt.ghost { border-color: #ccc; color: #888; font-weight: 400; font-size: 13px; }
    .msc-opt.ghost:hover { background: #f5f5f5; color: #555; transform: none; }

    /* Labels */
    .msc-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #aaa;
      margin: 14px 0 6px;
    }
    .msc-label:first-child { margin-top: 2px; }

    /* Info boxes */
    .msc-info {
      background: #f0fdf4;
      border: 1.5px solid #81c784;
      border-radius: 9px;
      padding: 10px 13px;
      font-size: 13px;
      color: #1a5c2a;
      margin-bottom: 12px;
      line-height: 1.65;
    }
    .msc-warn {
      background: #fff8e1;
      border: 1.5px solid #ffe082;
      border-radius: 9px;
      padding: 10px 13px;
      font-size: 13px;
      color: #5a4000;
      margin-bottom: 12px;
      line-height: 1.65;
    }
    .msc-alert {
      background: #fef2f2;
      border: 1.5px solid #fca5a5;
      border-radius: 9px;
      padding: 10px 13px;
      font-size: 13px;
      color: #7f1d1d;
      margin-bottom: 12px;
      line-height: 1.65;
    }

    /* Divider */
    .msc-div { border: none; border-top: 1px solid #f0e8d8; margin: 12px 0; }

    /* YouTube card */
    .msc-yt {
      background: #fff3f3;
      border: 1.5px solid #f5c6c6;
      border-radius: 10px;
      padding: 12px 14px;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 12px;
      cursor: pointer;
      transition: background 0.15s;
      text-decoration: none;
    }
    .msc-yt:hover { background: #ffe8e8; }
    .msc-yt-icon { font-size: 28px; flex-shrink: 0; }
    .msc-yt-text { font-size: 13px; color: #7a0000; font-weight: 600; line-height: 1.4; }
    .msc-yt-sub { font-size: 11px; color: #999; font-weight: 400; margin-top: 2px; }

    /* Greeting */
    .msc-greet { font-size: 15px; font-weight: 700; color: #7a0000; margin-bottom: 3px; }
    .msc-sub { font-size: 13px; color: #777; margin-bottom: 14px; line-height: 1.5; }

    /* Input */
    .msc-input {
      width: 100%;
      padding: 9px 11px;
      border: 1.5px solid #ddd;
      border-radius: 7px;
      font-size: 14px;
      margin: 6px 0 12px;
      box-sizing: border-box;
      font-family: Segoe UI, Arial, sans-serif;
    }
    .msc-input:focus { outline: none; border-color: #7a0000; }

    @media (max-width: 480px) {
      .msc-box {
        width: calc(100vw - 20px);
        left: 10px;
        bottom: 74px;
        max-height: calc(100vh - 94px);
      }
      .msc-body { font-size: 15px; }
      .msc-opt { font-size: 15px; padding: 12px 14px; }
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

  function waLink(msg) {
    return "https://wa.me/" + CONFIG.whatsappNumber + "?text=" + encodeURIComponent(msg);
  }

  function breadcrumb(steps) {
    // steps = [{label, fn}]
    if (!steps || steps.length === 0) return "";
    let html = `<div class="msc-breadcrumb">🏠 <span onclick="mscShowMain()">Home</span>`;
    steps.forEach(s => {
      html += `<span class="sep">›</span><span onclick="${s.fn}">${s.label}</span>`;
    });
    html += `</div>`;
    return html;
  }

  // ══════════════════════════════════════
  // DISCLAIMER (shown whenever contact shown)
  // ══════════════════════════════════════
  const DISCLAIMER = `
    <div class="msc-alert">
      ⚠️ <b>Customer support sirf paid services ke liye hai</b> — Hotel, Taxi, Food.<br>
      Darshan / Jal / Mahant Ji ki info ke liye website pages dekhein.
    </div>`;

  // ══════════════════════════════════════
  // CONTACT BLOCK (WA + Call)
  // ══════════════════════════════════════
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

  function showMain() {
    render(`
      <div class="msc-greet">Jai Shree Shyam 🙏</div>
      <div class="msc-sub">Aap kaise help chahte hain?</div>

      <div class="msc-label">📚 Free Jaankari</div>
      <button class="msc-opt" onclick="showInfoMenu()">🛕 Darshan, Jal, Mahant Ji ke baare mein</button>

      <hr class="msc-div">
      <div class="msc-label">🛎️ Paid Services</div>
      <button class="msc-opt green" onclick="showServiceMenu('hotel')">🏨 Hotel Booking</button>
      <button class="msc-opt green" onclick="showServiceMenu('taxi')">🚕 Taxi Booking</button>
      <button class="msc-opt green" onclick="showServiceMenu('food')">🍽️ Food Order</button>
    `);
  }

  // ── INFO MENU ──────────────────────────
  window.showInfoMenu = function () {
    render(`
      ${breadcrumb([])}
      <div class="msc-greet" style="font-size:14px;">🛕 Free Jaankari</div>
      <div class="msc-sub">Kis topic ke baare mein jaanna chahte hain?</div>

      <button class="msc-opt" onclick="window.open('${CONFIG.pages.patient}','_blank')">
        🔖 Patient Token — Kaise milta hai?
      </button>
      <button class="msc-opt" onclick="window.open('${CONFIG.pages.patient}','_blank')">
        🕐 Mahant Ji kab baithte hain?
      </button>
      <button class="msc-opt" onclick="window.open('${CONFIG.pages.patient}','_blank')">
        ⏳ Kitna time lagta hai — Token lene mein / Mahant Ji se milne mein?
      </button>
      <button class="msc-opt" onclick="window.open('${CONFIG.pages.jal}','_blank')">
        💧 Shyam Jal kaise milta hai?
      </button>
      <button class="msc-opt" onclick="window.open('${CONFIG.pages.patient}','_blank')">
        🎫 Patient Token kaise lein?
      </button>
      <button class="msc-opt" onclick="window.open('${CONFIG.pages.khatushyam}','_blank')">
        🛕 Khatu Shyam Ji ke baare mein
      </button>
      <button class="msc-opt" onclick="window.open('${CONFIG.pages.mahant}','_blank')">
        🧘 Mahant Ji ke baare mein
      </button>
      <button class="msc-opt" onclick="window.open('${CONFIG.pages.main}','_blank')">
        🏠 Manauna Dham ke baare mein
      </button>

      <hr class="msc-div">
      <div class="msc-warn">
        ℹ️ Inki puri jaankari humne website par likhi hai. Kripya page zaroor dekhein —
        aapke sabhi sawaalon ke jawab wahan milenge.
      </div>
      <button class="msc-opt ghost" onclick="showMain()">🔙 Wapas Jaayein</button>
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
      <button class="msc-opt ghost" onclick="showMain()">🔙 Wapas Jaayein</button>
    `);
  };

  // ── HOW TO BOOK ────────────────────────
  window.showHowToBook = function (service) {
    const labels = {
      hotel: { emoji: "🏨", name: "Hotel Booking",  ytLink: CONFIG.youtube.hotel,  ytTitle: "Hotel kaise book karein — Step by step" },
      taxi:  { emoji: "🚕", name: "Taxi Booking",   ytLink: CONFIG.youtube.taxi,   ytTitle: "Taxi kaise book karein — Step by step" },
      food:  { emoji: "🍽️", name: "Food Order",    ytLink: CONFIG.youtube.food,   ytTitle: "Khana kaise order karein — Step by step" },
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
      <button class="msc-opt ghost" onclick="showServiceMenu('${service}')">🔙 Wapas Jaayein</button>
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
    render(`
      ${breadcrumb([{label: s.emoji + " " + s.name, fn: "showServiceMenu('" + service + "')"}])}
      <div class="msc-greet" style="font-size:14px;">${s.emoji} ${s.name} — Query</div>
      <div class="msc-sub">Aapki query kya hai?</div>

      <div class="msc-label">Query type chunein</div>
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
      <button class="msc-opt ghost" onclick="showServiceMenu('${service}')">🔙 Wapas Jaayein</button>
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
      <button class="msc-opt ghost" onclick="showAlreadyBooked('${service}')">🔙 Wapas Jaayein</button>
    `);
  };

  // ══════════════════════════════════════
  // INIT
  // ══════════════════════════════════════
  showMain();

})();
