(function () {
  if (document.getElementById("manauna-chat-loaded")) return;

  const marker = document.createElement("div");
  marker.id = "manauna-chat-loaded";
  document.body.appendChild(marker);

  const style = document.createElement("style");
  style.innerHTML = `
    .manauna-chat-btn {
      position: fixed;
      bottom: 20px;
      left: 20px;
      background: linear-gradient(135deg, #7a0000, #4d0000);
      color: white;
      padding: 14px 22px;
      border-radius: 30px;
      font-weight: bold;
      cursor: pointer;
      z-index: 999999;
      font-family: Segoe UI, Arial;
      box-shadow: 0 4px 16px rgba(122,0,0,0.4);
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 15px;
    }
    .manauna-chat-box {
      display: none;
      position: fixed;
      bottom: 80px;
      left: 20px;
      width: 330px;
      max-height: 72vh;
      background: white;
      border-radius: 14px;
      box-shadow: 0 12px 36px rgba(0,0,0,.28);
      z-index: 999999;
      overflow: hidden;
      font-family: Segoe UI, Arial;
    }
    .manauna-chat-header {
      background: linear-gradient(135deg, #7a0000, #4d0000);
      color: white;
      padding: 14px 16px;
      font-weight: bold;
      font-size: 15px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .manauna-chat-close {
      cursor: pointer;
      font-size: 20px;
      line-height: 1;
      opacity: 0.85;
    }
    .manauna-chat-close:hover { opacity: 1; }
    .manauna-chat-body {
      padding: 14px;
      font-size: 14px;
      overflow-y: auto;
      max-height: 54vh;
    }
    .chat-option {
      display: block;
      width: 100%;
      margin-bottom: 8px;
      padding: 11px 14px;
      border-radius: 8px;
      border: 1.5px solid #7a0000;
      background: white;
      color: #7a0000;
      font-weight: 600;
      cursor: pointer;
      text-align: left;
      font-size: 14px;
      transition: background 0.15s, color 0.15s;
      line-height: 1.4;
    }
    .chat-option:hover { background: #7a0000; color: white; }
    .chat-option.green { border-color: #1a7a3a; color: #1a7a3a; }
    .chat-option.green:hover { background: #1a7a3a; color: white; }
    .chat-section-label {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #999;
      margin: 14px 0 6px;
    }
    .chat-section-label:first-child { margin-top: 4px; }
    .chat-divider { border: none; border-top: 1px solid #f0e8d8; margin: 12px 0; }
    .chat-highlight {
      background: #f0fdf4;
      border: 1.5px solid #81c784;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      color: #1a5c2a;
      margin-bottom: 12px;
      line-height: 1.6;
    }
    .chat-warn {
      background: #fff8e1;
      border: 1.5px solid #ffe082;
      border-radius: 8px;
      padding: 10px 12px;
      font-size: 13px;
      color: #5a4000;
      margin-bottom: 12px;
      line-height: 1.6;
    }
    .chat-input {
      width: 100%;
      padding: 9px;
      border: 1.5px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      margin: 8px 0 12px;
      box-sizing: border-box;
    }
    .chat-textarea {
      width: 100%;
      padding: 9px;
      border: 1.5px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      height: 75px;
      margin: 8px 0 12px;
      resize: none;
      box-sizing: border-box;
    }
    @media (max-width: 480px) {
      .manauna-chat-box {
        width: calc(100vw - 20px);
        left: 10px;
        bottom: 72px;
        max-height: calc(100vh - 92px);
      }
      .manauna-chat-body { font-size: 15px; }
      .chat-option { font-size: 15px; padding: 12px 14px; }
    }
  `;
  document.head.appendChild(style);

  const btn = document.createElement("div");
  btn.className = "manauna-chat-btn";
  btn.innerHTML = `🙏 Book / Help`;
  btn.onclick = () => {
    if (box.style.display === "block") {
      box.style.display = "none";
      resetChat();
    } else {
      box.style.display = "block";
      resetChat();
    }
  };

  const box = document.createElement("div");
  box.className = "manauna-chat-box";
  box.innerHTML = `
    <div class="manauna-chat-header">
      <span>🙏 Manauna Dham</span>
      <span class="manauna-chat-close">×</span>
    </div>
    <div class="manauna-chat-body" id="chatContent"></div>
  `;
  box.querySelector(".manauna-chat-close").onclick = () => { box.style.display = "none"; };

  document.body.appendChild(btn);
  document.body.appendChild(box);

  // ══════════════════════════════════════
  // MAIN MENU — bookings first
  // ══════════════════════════════════════
  window.resetChat = function () {
    const content = document.getElementById("chatContent");
    if (!content) return;
    content.innerHTML = `
<div style="font-size:15px;font-weight:700;color:#7a0000;margin-bottom:4px;">Jai Shree Shyam 🙏</div>
<div style="font-size:13px;color:#666;margin-bottom:12px;">Aapki yatra ke liye hum yahan hain</div>

<div class="chat-section-label">📦 Book Karo</div>

<button class="chat-option green" onclick="showInfo('book-hotel')">
  🏨 Hotel Book Karein — 15% advance, rest at hotel
</button>
<button class="chat-option green" onclick="showInfo('book-food')">
  🍽️ Khana Order Karein — Cash on delivery
</button>
<button class="chat-option green" onclick="showInfo('book-transport')">
  🚕 Transport Book Karein — Taxi / Auto
</button>

<hr class="chat-divider">
<div class="chat-section-label">ℹ️ Jaankari</div>

<button class="chat-option" onclick="showInfo('darshan')">
  🛕 Darshan &amp; Patient Token
</button>
<button class="chat-option" onclick="showInfo('jal')">
  💧 Shyam Jal
</button>
`;
  };

  // ══════════════════════════════════════
  // SCREENS
  // ══════════════════════════════════════
  window.showInfo = function (option) {
    const content = document.getElementById("chatContent");

    if (option === 'book-hotel') {
      content.innerHTML = `
<div style="font-weight:700;font-size:15px;color:#7a0000;margin-bottom:10px;">🏨 Hotel Book Karein</div>
<div class="chat-highlight">
  ✅ Sirf <b>15% advance online</b> — baki hotel par<br>
  ⚡ Instant confirmation milti hai
</div>
<div class="chat-section-label">Kaunsa hotel chahiye?</div>
<button class="chat-option green" onclick="window.location.href='harshdeep.html#booking-section'">
  🏨 Hotel Harshdeep — ₹1,599/night onwards<br>
  <span style="font-size:12px;font-weight:400;">Bisauli Bypass Road · 3–4 km from temple · ⭐ 4.3</span>
</button>
<button class="chat-option green" onclick="window.location.href='rajgarden.html#booking-section'">
  🌿 Hotel Raj Garden — ₹1,899/night onwards<br>
  <span style="font-size:12px;font-weight:400;">Temple Road · Restaurant on-site · Park view · ⭐ 4.5</span>
</button>
<button class="chat-option" onclick="window.location.href='../hotels'">
  📋 Dono hotels compare karein
</button>
<div class="chat-warn" style="margin-top:10px;">
  ⚠️ Jan–Feb mein hotels jaldi full ho jaate hain
</div>
<hr class="chat-divider">
<button class="chat-option" onclick="resetChat()">🏠 Main Menu</button>
`;
    }

    else if (option === 'book-food') {
      content.innerHTML = `
<div style="font-weight:700;font-size:15px;color:#7a0000;margin-bottom:10px;">🍽️ Khana Order Karein</div>
<div class="chat-highlight">
  🛵 Cash on delivery · Hotel ya mandir area — jahan bhi ho<br>
  ✅ Bhakton ke liye special rates
</div>
<div class="chat-section-label">Restaurant chunein</div>
<button class="chat-option green" onclick="startFoodOrder('Food Plaza Aonla')">
  🍛 Food Plaza — Chaap King · ₹50–₹570<br>
  <span style="font-size:12px;font-weight:400;">AC dining · Thali available · ⭐ 4.6</span>
</button>
<button class="chat-option green" onclick="startFoodOrder('Kipps Restaurant')">
  🥟 Kipps Restaurant — Chinese &amp; North Indian · ₹20–₹670<br>
  <span style="font-size:12px;font-weight:400;">Spacious family seating · AC · ⭐ 4.5</span>
</button>
<button class="chat-option green" onclick="startFoodOrder('Shiv Pizza Point')">
  🍕 Shiv Pizza Point — Pizza &amp; Fast Food · ₹100–₹450<br>
  <span style="font-size:12px;font-weight:400;">Quick service · Authentic Italian</span>
</button>
<button class="chat-option" onclick="window.location.href='food.html'">
  📋 Saare restaurants dekhein
</button>
<hr class="chat-divider">
<button class="chat-option" onclick="resetChat()">🏠 Main Menu</button>
`;
    }

    else if (option === 'book-transport') {
      content.innerHTML = `
<div style="font-weight:700;font-size:15px;color:#7a0000;margin-bottom:10px;">🚕 Transport Book Karein</div>
<div class="chat-highlight">
  ✅ Bhakton ke liye uchit rates · Kahan se bhi
</div>
<div class="chat-section-label">Route chunein</div>
<button class="chat-option green" onclick="bookTransport('Bareilly se Taxi')">
  🚗 Bareilly → Manauna Dham — ₹1,599–₹1,899
</button>
<button class="chat-option green" onclick="bookTransport('Delhi se Taxi')">
  🚗 Delhi → Manauna Dham — ₹2,799–₹3,599
</button>
<button class="chat-option green" onclick="bookTransport('Aonla Station se Auto')">
  🛺 Aonla Station → Manauna Dham — ₹50–₹150
</button>
<button class="chat-option green" onclick="bookTransport('Kisi aur jagah se')">
  📍 Kisi aur jagah se book karein
</button>
<hr class="chat-divider">
<button class="chat-option" onclick="window.location.href='transport.html'">📋 Transport page dekhein</button>
<button class="chat-option" onclick="resetChat()">🏠 Main Menu</button>
`;
    }

    else if (option === 'darshan') {
      content.innerHTML = `
<div style="font-weight:700;font-size:15px;color:#7a0000;margin-bottom:10px;">🛕 Darshan &amp; Patient Token</div>
<b>Patient khud present ho:</b><br>
• Token line mein lagna hota hai<br>
• Mahant Ji se darshan + Shyam Jal milta hai<br>
• Line comparatively fast hoti hai<br><br>
<b>Patient present na ho:</b><br>
• Family member General line mein lagega<br>
• Patient Token nahi milega<br>
• Line lambi hoti hai<br><br>
<div class="chat-warn">
  ❌ Tuesday &amp; Wednesday — Mahant Ji nahi baithte<br>
  ⚠️ Advance token booking nahi hoti
</div>
<div class="chat-section-label">Yahan ke liye book karo</div>
<button class="chat-option green" onclick="showInfo('book-hotel')">🏨 Hotel Book Karein</button>
<button class="chat-option green" onclick="showInfo('book-transport')">🚕 Transport Book Karein</button>
<hr class="chat-divider">
<button class="chat-option" onclick="window.location.href='patient.html'">📋 Patient page dekhein</button>
<button class="chat-option" onclick="resetChat()">🏠 Main Menu</button>
`;
    }

    else if (option === 'jal') {
      content.innerHTML = `
<div style="font-weight:700;font-size:15px;color:#7a0000;margin-bottom:10px;">💧 Shyam Jal</div>
<div class="chat-highlight">
  Manauna Dham — Khatu Shyam Ji ki <b>Janmbhoomi</b><br>
  Jal <b>Mahant Ji dwara Abhimantrit</b> hota hai
</div>
• Sirf mandir ke andar <b>official counter</b> se milta hai<br>
• Patient ke saath — token line<br>
• Bina patient ke — general line<br>
• Mahant Ji ka nirdesh: roz <b>11:55 AM se pehle</b> ek dhakkan piyen<br><br>
<div class="chat-section-label">Aane ki planning hai?</div>
<button class="chat-option green" onclick="showInfo('book-hotel')">🏨 Hotel Book Karein</button>
<button class="chat-option green" onclick="showInfo('book-transport')">🚕 Transport Book Karein</button>
<hr class="chat-divider">
<button class="chat-option" onclick="window.location.href='jal.html'">📋 Shyam Jal page dekhein</button>
<button class="chat-option" onclick="resetChat()">🏠 Main Menu</button>
`;
    }
  };

  // ══════════════════════════════════════
  // TRANSPORT QUICK BOOK
  // ══════════════════════════════════════
  window.bookTransport = function (route) {
    const msg = `🚕 TRANSPORT BOOKING REQUEST\n\nRoute: ${route}\nManauna Dham ke liye transport chahiye.\n\nPlease confirm availability aur rate. 🙏\n_Sent via ManaunaDham.org.in_`;
    window.open("https://wa.me/917817803342?text=" + encodeURIComponent(msg), "_blank");
  };

  // ══════════════════════════════════════
  // FOOD ORDER FLOW
  // ══════════════════════════════════════
  let foodOrderData = { restaurant: "", name: "", order: "", address: "", phone: "" };

  window.startFoodOrder = function (restaurantName = "") {
    const chatBox = document.querySelector(".manauna-chat-box");
    if (chatBox) chatBox.style.display = "block";
    const content = document.getElementById("chatContent");
    if (!content) return;
    foodOrderData = { restaurant: restaurantName, name: "", order: "", address: "", phone: "" };
    content.innerHTML = `
<div style="font-weight:700;font-size:15px;color:#1a7a3a;margin-bottom:10px;">🍽️ ${restaurantName}</div>
<b>Restaurant confirm karo:</b><br>
<input type="text" id="fo_restaurant" class="chat-input" value="${restaurantName}">
<button class="chat-option green" onclick="foodStepName()">Aage Badhein ➡️</button>
<button class="chat-option" onclick="resetChat()">🏠 Cancel</button>
`;
  };

  window.foodStepName = function () {
    const r = document.getElementById("fo_restaurant").value.trim();
    if (!r) return alert("Restaurant name required");
    foodOrderData.restaurant = r;
    document.getElementById("chatContent").innerHTML = `
<b>👤 Aapka Naam</b><br>
<input type="text" id="fo_name" class="chat-input" placeholder="Poora naam likhein">
<button class="chat-option green" onclick="foodStepOrder()">Aage ➡️</button>
`;
  };

  window.foodStepOrder = function () {
    const n = document.getElementById("fo_name").value.trim();
    if (!n) return alert("Naam likhna zaroori hai");
    foodOrderData.name = n;
    document.getElementById("chatContent").innerHTML = `
<b>📝 Kya order karna hai?</b><br>
<textarea id="fo_order" class="chat-textarea" placeholder="Pura order likhein..."></textarea>
<button class="chat-option green" onclick="foodStepAddress()">Aage ➡️</button>
`;
  };

  window.foodStepAddress = function () {
    const o = document.getElementById("fo_order").value.trim();
    if (!o) return alert("Order details likhein");
    foodOrderData.order = o;
    document.getElementById("chatContent").innerHTML = `
<b>📍 Delivery Address</b><br>
<textarea id="fo_address" class="chat-textarea" placeholder="Hotel naam / mandir area / exact jagah"></textarea>
<button class="chat-option green" onclick="foodStepPhone()">Aage ➡️</button>
`;
  };

  window.foodStepPhone = function () {
    const a = document.getElementById("fo_address").value.trim();
    if (!a) return alert("Address likhna zaroori hai");
    foodOrderData.address = a;
    document.getElementById("chatContent").innerHTML = `
<b>📞 Phone Number</b><br>
<input type="tel" id="fo_phone" class="chat-input" placeholder="10 digit number">
<button class="chat-option green" onclick="foodToWhatsApp()">✅ WhatsApp par bhejein</button>
`;
  };

  window.foodToWhatsApp = function () {
    const p = document.getElementById("fo_phone").value.trim();
    if (!p) return alert("Phone number zaroori hai");
    foodOrderData.phone = p;
    const msg = `🍽️ FOOD ORDER REQUEST\n\nRestaurant: ${foodOrderData.restaurant}\nName: ${foodOrderData.name}\nPhone: ${foodOrderData.phone}\nAddress: ${foodOrderData.address}\n\nOrder:\n${foodOrderData.order}\n\n_Sent via ManaunaDham.org.in_`.trim();
    window.location.href = "https://wa.me/917817803342?text=" + encodeURIComponent(msg);
  };

  // ══════════════════════════════════════
  // HOTEL BOOKING FLOW (WhatsApp)
  // ══════════════════════════════════════
  let hotelBookingData = { hotel: "", checkin: "", checkout: "", name: "", phone: "" };

  window.startHotelBooking = function (hotelName = "") {
    const chatBox = document.querySelector(".manauna-chat-box");
    if (chatBox) chatBox.style.display = "block";
    const content = document.getElementById("chatContent");
    if (!content) return;
    hotelBookingData = { hotel: hotelName, checkin: "", checkout: "", name: "", phone: "" };
    content.innerHTML = `
<b>🏨 Hotel Booking</b><br>
<input type="text" id="hb_hotel" class="chat-input" value="${hotelName}">
<button class="chat-option green" onclick="hotelStepDates()">Aage ➡️</button>
<button class="chat-option" onclick="resetChat()">🏠 Cancel</button>
`;
  };

  window.hotelStepDates = function () {
    const h = document.getElementById("hb_hotel").value.trim();
    if (!h) return alert("Hotel name required");
    hotelBookingData.hotel = h;
    document.getElementById("chatContent").innerHTML = `
<b>📅 Check-in Date</b><br>
<input type="date" id="hb_checkin" class="chat-input">
<b>📅 Check-out Date</b><br>
<input type="date" id="hb_checkout" class="chat-input">
<button class="chat-option green" onclick="hotelStepName()">Aage ➡️</button>
`;
  };

  window.hotelStepName = function () {
    const ci = document.getElementById("hb_checkin").value;
    const co = document.getElementById("hb_checkout").value;
    if (!ci || !co) return alert("Dono dates bharein");
    hotelBookingData.checkin = ci;
    hotelBookingData.checkout = co;
    document.getElementById("chatContent").innerHTML = `
<b>👤 Aapka Naam</b><br>
<input type="text" id="hb_name" class="chat-input" placeholder="Poora naam">
<b>📞 Phone Number</b><br>
<input type="tel" id="hb_phone" class="chat-input" placeholder="10 digit number">
<button class="chat-option green" onclick="hotelToWhatsApp()">✅ WhatsApp par bhejein</button>
`;
  };

  window.hotelToWhatsApp = function () {
    const n = document.getElementById("hb_name").value.trim();
    const p = document.getElementById("hb_phone").value.trim();
    if (!n || !p) return alert("Naam aur phone zaroori hai");
    hotelBookingData.name = n;
    hotelBookingData.phone = p;
    const msg = `🏨 HOTEL BOOKING REQUEST\n\nHotel: ${hotelBookingData.hotel}\nGuest: ${hotelBookingData.name}\nPhone: ${hotelBookingData.phone}\nCheck-in: ${hotelBookingData.checkin}\nCheck-out: ${hotelBookingData.checkout}\n\nPlease confirm availability. 🙏\n_Sent via ManaunaDham.org.in_`.trim();
    window.location.href = "https://wa.me/917817803342?text=" + encodeURIComponent(msg);
  };

  // ══════════════════════════════════════
  // SHYAM JAL ORDER FLOW
  // ══════════════════════════════════════
  let jalOrderData = { name: "", phone: "", address: "", bottles: "" };

  window.startJalOrder = function () {
    const chatBox = document.querySelector(".manauna-chat-box");
    if (chatBox) chatBox.style.display = "block";
    const content = document.getElementById("chatContent");
    if (!content) return;
    jalOrderData = { name: "", phone: "", address: "", bottles: "" };
    content.innerHTML = `
<div style="font-weight:700;font-size:15px;color:#7a0000;margin-bottom:10px;">💧 Shyam Jal Order</div>
<div class="chat-warn">
  • Sirf <b>official counter</b> se milta hai — Manauna Dham<br>
  • Mahant Ji dwara <b>Abhimantrit</b>
</div>
<button class="chat-option green" onclick="jalStepName()">Order Karo ➡️</button>
<button class="chat-option" onclick="resetChat()">🏠 Cancel</button>
`;
  };

  window.jalStepName = function () {
    document.getElementById("chatContent").innerHTML = `
<b>👤 Aapka Naam</b><br>
<input type="text" id="jal_name" class="chat-input" placeholder="Full Name">
<button class="chat-option green" onclick="jalStepPhone()">Aage ➡️</button>
`;
  };

  window.jalStepPhone = function () {
    const n = document.getElementById("jal_name").value.trim();
    if (!n) return alert("Naam likhna zaroori hai");
    jalOrderData.name = n;
    document.getElementById("chatContent").innerHTML = `
<b>📞 Phone Number</b><br>
<input type="tel" id="jal_phone" class="chat-input" placeholder="10 digit number">
<button class="chat-option green" onclick="jalStepAddress()">Aage ➡️</button>
`;
  };

  window.jalStepAddress = function () {
    const p = document.getElementById("jal_phone").value.trim();
    if (!p) return alert("Phone zaroori hai");
    jalOrderData.phone = p;
    document.getElementById("chatContent").innerHTML = `
<b>📍 Delivery Address</b><br>
<textarea id="jal_address" class="chat-textarea" placeholder="House no, city, state, pincode"></textarea>
<button class="chat-option green" onclick="jalStepBottles()">Aage ➡️</button>
`;
  };

  window.jalStepBottles = function () {
    const a = document.getElementById("jal_address").value.trim();
    if (!a) return alert("Address zaroori hai");
    jalOrderData.address = a;
    document.getElementById("chatContent").innerHTML = `
<b>💧 Kitni Bottles chahiye?</b><br>
<input type="number" id="jal_bottles" class="chat-input" placeholder="e.g. 2 / 5 / 10">
<div style="font-size:12px;color:#888;margin-top:-8px;margin-bottom:12px;">₹20 × bottles + packaging + shipping</div>
<button class="chat-option green" onclick="jalToWhatsApp()">✅ Order Submit Karein</button>
`;
  };

  window.jalToWhatsApp = function () {
    const b = document.getElementById("jal_bottles").value.trim();
    if (!b) return alert("Quantity likhein");
    jalOrderData.bottles = b;
    const msg = `💧 SHYAM JAL ORDER\n\nName: ${jalOrderData.name}\nPhone: ${jalOrderData.phone}\nAddress: ${jalOrderData.address}\nBottles: ${jalOrderData.bottles}\n\nCost: ₹20 × bottles + packaging + shipping\nSource: Official Counter – Manauna Dham\n_Sent via ManaunaDham.org.in_`.trim();
    window.location.href = "https://wa.me/917817803342?text=" + encodeURIComponent(msg);
  };

  resetChat();

})();
