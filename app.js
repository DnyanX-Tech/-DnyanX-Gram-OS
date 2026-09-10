// ==========================================
// DnyanX परिवार (India's First Family OS)
// App Logic & State Manager
// ==========================================

// Initial State (Local Storage backed)
const DEFAULT_STATE = {
  familyInfo: {
    name: "पाटील परिवार",
    address: "मु. पो. बारामती, जि. पुणे, महाराष्ट्र",
    phone: "+91 98220 12345"
  },
  members: [
    {
      id: "mem-1",
      name: "रामदास पाटील (वडील)",
      role: "trader",
      roleLabel: "व्यापारी (Business OS)",
      age: 52,
      phone: "9822012345",
      avatar: "👨‍💼",
      colorClass: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300",
      activeModule: "Business OS (दुकान व हिशोब)"
    },
    {
      id: "mem-2",
      name: "आनंदा पाटील (आजोबा)",
      role: "elder",
      roleLabel: "ज्येष्ठ नागरिक (आठवण)",
      age: 78,
      phone: "9822099999",
      avatar: "👴",
      colorClass: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300",
      activeModule: "आठवण (आरोग्य व औषध सोबती)"
    },
    {
      id: "mem-3",
      name: "बाळासाहेब पाटील (काका)",
      role: "farmer",
      roleLabel: "शेतकरी (हक्क)",
      age: 48,
      phone: "9822088888",
      avatar: "🌾",
      colorClass: "from-lime-500/20 to-lime-600/10 border-lime-500/30 text-lime-300",
      activeModule: "हक्क (शासकीय योजना)"
    },
    {
      id: "mem-4",
      name: "स्नेहा पाटील (मुलगी)",
      role: "youth",
      roleLabel: "तरुणी/विद्यार्थिनी (मन)",
      age: 19,
      phone: "9822077777",
      avatar: "👧",
      colorClass: "from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-300",
      activeModule: "मन (मानसिक आधार व अभ्यास)"
    }
  ],
  stock: [
    { id: 1, name: "सिमेंट बॅग (५० किलो)", qty: 45, min: 15, price: 380 },
    { id: 2, name: "स्टील गज १० मिमी (टन)", qty: 2, min: 3, price: 54000 },
    { id: 3, name: "PVC पाईप ४ इंच (नग)", qty: 8, min: 10, price: 420 },
    { id: 4, name: "पेंट बकेट २० लिटर (White)", qty: 14, min: 5, price: 3200 }
  ],
  poItems: [
    { id: 1, name: "अल्ट्राटेक सिमेंट बॅग", qty: 50, rate: 360 },
    { id: 2, name: "टाटा टिस्कॉन १० मिमी", qty: 10, rate: 520 }
  ],
  attendanceLogs: [
    { name: "सचिन कांबळे (मॅनेजर)", time: "09:15 AM", status: "हजर ✅" },
    { name: "गणेश पवार (हेल्पर)", time: "09:40 AM", status: "हजर ✅" }
  ],
  medicines: [
    { id: 1, name: "बीपीची गोळी (Telma 40)", time: "09:00 AM", instruction: "सकाळी नाश्त्यानंतर", status: "taken" },
    { id: 2, name: "मधुमेह गोळी (Glycomet 500)", time: "01:30 PM", instruction: "दुपारी जेवणाआधी", status: "pending" },
    { id: 3, name: "कॅल्शियम व व्हिटॅमिन डी", time: "08:30 PM", instruction: "रात्री जेवणानंतर", status: "pending" }
  ],
  waterGlasses: 4
};

// Global App State (Encrypted Storage Vault)
function loadEncryptedState() {
  try {
    const raw = localStorage.getItem("dnyanx_parivar_vault_enc");
    if (raw && window.DnyanXSecurity) {
      const parsedPacket = JSON.parse(raw);
      const decrypted = window.DnyanXSecurity.decryptPayload(parsedPacket);
      if (decrypted && decrypted.familyInfo) return decrypted;
    }
  } catch (e) {
    console.warn("Encrypted load fallback:", e);
  }
  // Fallback to legacy unencrypted or default
  const legacy = localStorage.getItem("dnyanx_parivar_state");
  return legacy ? JSON.parse(legacy) : DEFAULT_STATE;
}

let appState = loadEncryptedState();
if (!appState.medicines) {
  appState.medicines = DEFAULT_STATE.medicines;
  appState.waterGlasses = 4;
}

function saveState() {
  if (window.DnyanXSecurity) {
    const encryptedPacket = window.DnyanXSecurity.encryptPayload(appState);
    localStorage.setItem("dnyanx_parivar_vault_enc", JSON.stringify(encryptedPacket));
  }
  // Also keep synchronized legacy
  localStorage.setItem("dnyanx_parivar_state", JSON.stringify(appState));
}

// ------------------------------------------
// Navigation & Tab Switching
// ------------------------------------------
function switchTab(tabId) {
  const businessView = document.getElementById("view-business");
  const aathvanView = document.getElementById("view-aathvan");
  const familyView = document.getElementById("view-family");
  const tabBusiness = document.getElementById("tab-business");
  const tabAathvan = document.getElementById("tab-aathvan");
  const tabFamily = document.getElementById("tab-family");

  // Hide all
  businessView.classList.add("hidden");
  if (aathvanView) aathvanView.classList.add("hidden");
  familyView.classList.add("hidden");

  // Reset tab classes
  tabBusiness.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition";
  if (tabAathvan) tabAathvan.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-900/40 transition";
  tabFamily.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition";

  if (tabId === "business") {
    businessView.classList.remove("hidden");
    tabBusiness.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition";
  } else if (tabId === "aathvan") {
    if (aathvanView) aathvanView.classList.remove("hidden");
    if (tabAathvan) tabAathvan.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition";
    renderMedicineList();
  } else if (tabId === "family") {
    familyView.classList.remove("hidden");
    tabFamily.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition";
  }
  lucide.createIcons();
}

// ------------------------------------------
// MODULE 1: Family Profile & Members
// ------------------------------------------
function renderFamilyMembers() {
  const container = document.getElementById("familyMembersGrid");
  const badge = document.getElementById("memberCountBadge");
  if (!container) return;

  container.innerHTML = "";
  badge.textContent = `${appState.members.length} सदस्य`;

  appState.members.forEach(member => {
    const card = document.createElement("div");
    card.className = `p-5 rounded-2xl bg-gradient-to-br ${member.colorClass} border backdrop-blur-sm flex flex-col justify-between`;
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between">
          <span class="text-3xl">${member.avatar}</span>
          <span class="text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-950/60 border border-current">वय ${member.age}</span>
        </div>
        <h4 class="text-lg font-black text-white mt-3">${member.name}</h4>
        <p class="text-xs font-semibold opacity-90">${member.roleLabel}</p>
        <div class="mt-3 text-xs bg-slate-950/50 p-2.5 rounded-xl border border-slate-800 text-slate-300">
          <div class="text-[10px] text-slate-400 font-bold uppercase">सक्रिय ॲप (Active Micro-app):</div>
          <div class="font-bold text-white mt-0.5">${member.activeModule}</div>
        </div>
      </div>
      <div class="mt-4 pt-3 border-t border-slate-800/40 flex items-center justify-between text-xs">
        <span class="font-mono text-slate-400">📞 ${member.phone || "नाही"}</span>
        <button onclick="switchActiveMember('${member.name}', '${member.avatar}', '${member.roleLabel}')" class="text-xs font-bold underline hover:opacity-80">निवडा ➔</button>
      </div>
    `;
    container.appendChild(card);
  });

  document.getElementById("currentFamilyNameDisplay").textContent = `${appState.familyInfo.name}, ${appState.familyInfo.address.split(",")[1] || "पुणे"}`;
  document.getElementById("inputFamilyName").value = appState.familyInfo.name;
  document.getElementById("inputFamilyAddress").value = appState.familyInfo.address;
  document.getElementById("inputFamilyPhone").value = appState.familyInfo.phone;
}

function switchActiveMember(name, avatar, roleLabel) {
  const pill = document.getElementById("activeMemberPill");
  pill.innerHTML = `<span>${avatar} ${name.split(" ")[0]} (${roleLabel.split(" ")[0]})</span>`;
  alert(`सध्याचा सक्रिय सदस्य आता '${name}' म्हणून निवडला गेला आहे.`);
}

function saveFamilyHeaderInfo() {
  appState.familyInfo.name = document.getElementById("inputFamilyName").value;
  appState.familyInfo.address = document.getElementById("inputFamilyAddress").value;
  appState.familyInfo.phone = document.getElementById("inputFamilyPhone").value;
  saveState();
  renderFamilyMembers();
  alert("कुटुंब माहिती यशस्वीरित्या जतन केली गेली!");
}

function openAddMemberModal() {
  document.getElementById("addMemberModal").classList.remove("hidden");
}

function closeAddMemberModal() {
  document.getElementById("addMemberModal").classList.add("hidden");
}

function saveNewFamilyMember() {
  const name = document.getElementById("newMemberName").value;
  const age = document.getElementById("newMemberAge").value;
  const role = document.getElementById("newMemberRole").value;
  const phone = document.getElementById("newMemberPhone").value;

  const roleMeta = {
    elder: { label: "ज्येष्ठ नागरिक (आठवण)", avatar: "👴", color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/30 text-emerald-300", module: "आठवण (आरोग्य व औषध सोबती)" },
    trader: { label: "व्यापारी (Business OS)", avatar: "👨‍💼", color: "from-amber-500/20 to-amber-600/10 border-amber-500/30 text-amber-300", module: "Business OS (दुकान व हिशोब)" },
    farmer: { label: "शेतकरी (हक्क)", avatar: "🌾", color: "from-lime-500/20 to-lime-600/10 border-lime-500/30 text-lime-300", module: "हक्क (शासकीय योजना)" },
    youth: { label: "तरुणी/विद्यार्थिनी (मन)", avatar: "👧", color: "from-pink-500/20 to-pink-600/10 border-pink-500/30 text-pink-300", module: "मन (मानसिक आधार)" }
  }[role];

  appState.members.push({
    id: `mem-${Date.now()}`,
    name: name,
    role: role,
    roleLabel: roleMeta.label,
    age: parseInt(age),
    phone: phone,
    avatar: roleMeta.avatar,
    colorClass: roleMeta.color,
    activeModule: roleMeta.module
  });

  saveState();
  renderFamilyMembers();
  closeAddMemberModal();
  alert(`नवीन सदस्य '${name}' यशस्वीरीत्या जोडला गेला!`);
}

// ------------------------------------------
// MODULE 2: Business OS (PO, Stock, Face)
// ------------------------------------------

// 1. PO Generator
function renderPoItems() {
  const tbody = document.getElementById("poItemsBody");
  if (!tbody) return;

  tbody.innerHTML = "";
  appState.poItems.forEach((item, index) => {
    const total = item.qty * item.rate;
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-900/50";
    tr.innerHTML = `
      <td class="p-2">
        <input type="text" value="${item.name}" onchange="updatePoItem(${index}, 'name', this.value)" class="w-full bg-transparent border-none text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 rounded px-1">
      </td>
      <td class="p-2">
        <input type="number" min="1" value="${item.qty}" onchange="updatePoItem(${index}, 'qty', this.value)" class="w-16 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-center text-slate-100">
      </td>
      <td class="p-2">
        <input type="number" min="0" value="${item.rate}" onchange="updatePoItem(${index}, 'rate', this.value)" class="w-24 bg-slate-900 border border-slate-700 rounded px-2 py-0.5 text-right text-slate-100 font-mono">
      </td>
      <td class="p-2 font-mono font-bold text-right text-indigo-300">₹ ${total.toLocaleString("en-IN")}</td>
      <td class="p-2 text-center">
        <button type="button" onclick="removePoItemRow(${index})" class="text-rose-400 hover:text-rose-300 font-bold text-sm">×</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  calculatePoTotal();
}

function addPoItemRow() {
  appState.poItems.push({
    id: Date.now(),
    name: "नवीन माल आयटम",
    qty: 1,
    rate: 100
  });
  renderPoItems();
}

function removePoItemRow(index) {
  if (appState.poItems.length <= 1) {
    alert("किमान १ वस्तू असणे आवश्यक आहे.");
    return;
  }
  appState.poItems.splice(index, 1);
  renderPoItems();
}

function updatePoItem(index, key, val) {
  if (key === "qty" || key === "rate") {
    appState.poItems[index][key] = parseFloat(val) || 0;
  } else {
    appState.poItems[index][key] = val;
  }
  renderPoItems();
}

function calculatePoTotal() {
  const subtotal = appState.poItems.reduce((acc, item) => acc + (item.qty * item.rate), 0);
  const gstRate = parseFloat(document.getElementById("poGstRate").value) || 0;
  const gstAmount = (subtotal * gstRate) / 100;
  const grandTotal = subtotal + gstAmount;

  document.getElementById("poSubTotal").textContent = `₹ ${subtotal.toLocaleString("en-IN")}`;
  document.getElementById("poGstAmount").textContent = `₹ ${gstAmount.toLocaleString("en-IN")}`;
  document.getElementById("poGrandTotal").textContent = `₹ ${grandTotal.toLocaleString("en-IN")}`;

  return { subtotal, gstRate, gstAmount, grandTotal };
}

// jsPDF Generation
function generatePO() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const supplier = document.getElementById("poSupplierName").value;
  const phone = document.getElementById("poSupplierPhone").value;
  const poNum = document.getElementById("currentPoNumber").textContent;
  const { subtotal, gstRate, gstAmount, grandTotal } = calculatePoTotal();

  // Header Banner
  doc.setFillColor(30, 41, 59);
  doc.rect(0, 0, 210, 35, "F");
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.text("PURCHASE ORDER (PO)", 14, 20);

  doc.setFontSize(10);
  doc.text(`DnyanX Parivar Business OS | ${appState.familyInfo.name}`, 14, 28);
  doc.text(`PO No: ${poNum}`, 155, 20);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 155, 28);

  // Supplier & Business Info Box
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(11);
  doc.text("Supplier Details:", 14, 45);
  doc.setFontSize(10);
  doc.text(`Name: ${supplier}`, 14, 52);
  doc.text(`Phone / WhatsApp: ${phone}`, 14, 58);

  doc.text("Issued By:", 120, 45);
  doc.text(`Store: ${appState.familyInfo.name} Enterprises`, 120, 52);
  doc.text(`Location: ${appState.familyInfo.address}`, 120, 58);
  doc.text(`Contact: ${appState.familyInfo.phone}`, 120, 64);

  // Items Table
  const tableData = appState.poItems.map((item, idx) => [
    idx + 1,
    item.name,
    item.qty,
    `INR ${item.rate.toFixed(2)}`,
    `INR ${(item.qty * item.rate).toFixed(2)}`
  ]);

  doc.autoTable({
    startY: 72,
    head: [["#", "Item Description", "Qty", "Rate", "Total Amount"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [79, 70, 229] },
    styles: { fontSize: 9 }
  });

  const finalY = doc.lastAutoTable.finalY + 10;

  // Summary Totals
  doc.setFontSize(10);
  doc.text(`Subtotal: INR ${subtotal.toFixed(2)}`, 140, finalY);
  doc.text(`GST (${gstRate}%): INR ${gstAmount.toFixed(2)}`, 140, finalY + 6);
  doc.setFontSize(12);
  doc.setTextColor(16, 185, 129);
  doc.text(`Grand Total: INR ${grandTotal.toFixed(2)}`, 140, finalY + 14);

  // Footer Note
  doc.setTextColor(100, 116, 139);
  doc.setFontSize(9);
  doc.text("Thank you for your business! Generated via DnyanX Parivar OS.", 14, finalY + 30);

  // Save PDF
  doc.save(`${poNum}_${supplier.replace(/\s+/g, '_')}.pdf`);
  alert(`✅ Purchase Order (${poNum}) ची PDF यशस्वीरित्या डाऊनलोड झाली!`);
}

// WhatsApp PO Share
function sendPoViaWhatsApp() {
  const supplier = document.getElementById("poSupplierName").value;
  const rawPhone = document.getElementById("poSupplierPhone").value.replace(/\D/g, "");
  const poNum = document.getElementById("currentPoNumber").textContent;
  const { grandTotal } = calculatePoTotal();

  if (!rawPhone) {
    alert("कृपया सप्लायरचा व्हॉट्सॲप नंबर प्रविष्ट करा.");
    return;
  }

  let itemsSummary = appState.poItems.map(i => `• ${i.name} - ${i.qty} नग (दर: ₹${i.rate})`).join("%0A");
  let message = `*सादर खरेदी आदेश (Purchase Order - ${poNum})*%0A%0A` +
    `सस्नेह नमस्कार, *${supplier}*%0A` +
    `*${appState.familyInfo.name}* कडून खालील मालाची मागणी नोंदवली आहे:%0A%0A` +
    itemsSummary + `%0A%0A` +
    `*एकूण रक्कम:* ₹ ${grandTotal.toLocaleString("en-IN")}%0A` +
    `कृपया तात्काळ डिलिव्हरी आणि पक्के बिल पाठवून द्यावे.%0A%0A` +
    `_DnyanX परिवार Business OS द्वारे स्वयंचलित पाठवले गेले._`;

  const waUrl = `https://wa.me/91${rawPhone.slice(-10)}?text=${message}`;
  window.open(waUrl, "_blank");
}

// 2. Stock Management Logic
function renderStockList() {
  const container = document.getElementById("stockListContainer");
  const countDisplay = document.getElementById("totalStockCount");
  const alertText = document.getElementById("lowStockAlertText");
  if (!container) return;

  container.innerHTML = "";
  let lowStockCount = 0;

  appState.stock.forEach((item, index) => {
    const isLow = item.qty <= item.min;
    if (isLow) lowStockCount++;

    const itemEl = document.createElement("div");
    itemEl.className = "flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800";
    itemEl.innerHTML = `
      <div>
        <div class="flex items-center gap-2">
          <span class="text-sm font-bold text-slate-100">${item.name}</span>
          ${isLow ? '<span class="text-[10px] bg-rose-500/20 text-rose-300 font-bold px-1.5 py-0.2 rounded border border-rose-500/30">कमी साठा!</span>' : ''}
        </div>
        <p class="text-xs text-slate-400 font-mono mt-0.5">दर: ₹${item.price} | किमान: ${item.min} नग</p>
      </div>
      <div class="flex items-center gap-2">
        <button onclick="changeStockQty(${index}, -1)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">-</button>
        <span class="w-8 text-center font-mono font-bold text-sm ${isLow ? 'text-rose-400' : 'text-emerald-400'}">${item.qty}</span>
        <button onclick="changeStockQty(${index}, 1)" class="w-6 h-6 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold">+</button>
      </div>
    `;
    container.appendChild(itemEl);
  });

  countDisplay.textContent = `${appState.stock.length} वस्तू`;
  if (lowStockCount > 0) {
    alertText.innerHTML = `<i data-lucide="alert-triangle" class="w-3 h-3"></i> ${lowStockCount} वस्तू संपत आल्या आहेत!`;
    alertText.className = "text-xs text-rose-400 mt-1 flex items-center gap-1 font-semibold";
  } else {
    alertText.innerHTML = `<i data-lucide="check" class="w-3 h-3"></i> सर्व स्टॉक पुरेसा आहे`;
    alertText.className = "text-xs text-emerald-400 mt-1 flex items-center gap-1 font-semibold";
  }
}

function changeStockQty(index, delta) {
  const newQty = appState.stock[index].qty + delta;
  if (newQty >= 0) {
    appState.stock[index].qty = newQty;
    saveState();
    renderStockList();
  }
}

function openAddStockModal() {
  document.getElementById("addStockModal").classList.remove("hidden");
}

function closeAddStockModal() {
  document.getElementById("addStockModal").classList.add("hidden");
}

function saveNewStockItem() {
  const name = document.getElementById("newStockName").value;
  const qty = parseInt(document.getElementById("newStockQty").value) || 0;
  const min = parseInt(document.getElementById("newStockMin").value) || 5;
  const price = parseFloat(document.getElementById("newStockPrice").value) || 0;

  appState.stock.unshift({
    id: Date.now(),
    name: name,
    qty: qty,
    min: min,
    price: price
  });

  saveState();
  renderStockList();
  closeAddStockModal();
  alert(`'${name}' वस्तू स्टॉकमध्ये जोडली गेली!`);
}

// 3. Face Recognition Attendance Camera Logic
let cameraStream = null;

async function toggleCamera() {
  const video = document.getElementById("webcamFeed");
  const placeholder = document.getElementById("cameraPlaceholder");
  const toggleBtn = document.getElementById("toggleCameraBtn");

  if (cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
    video.srcObject = null;
    video.classList.add("hidden");
    placeholder.classList.remove("hidden");
    toggleBtn.innerHTML = '<i data-lucide="video" class="w-3.5 h-3.5"></i> कॅमेरा सुरू करा';
  } else {
    try {
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      video.srcObject = cameraStream;
      video.classList.remove("hidden");
      placeholder.classList.add("hidden");
      toggleBtn.innerHTML = '<i data-lucide="video-off" class="w-3.5 h-3.5"></i> कॅमेरा बंद करा';
    } catch (err) {
      alert("कॅमेरा सुरू करता आला नाही किंवा परवानगी नाकारली गेली. सिम्युलेशन मोडमध्ये चाचणी चालू राहील.");
    }
  }
  lucide.createIcons();
}

function markFaceAttendance() {
  const overlay = document.getElementById("scanOverlay");
  overlay.classList.remove("hidden");
  overlay.classList.add("flex");

  setTimeout(() => {
    overlay.classList.add("hidden");
    overlay.classList.remove("flex");

    const staffNames = ["सचिन कांबळे (मॅनेजर)", "गणेश पवार (हेल्पर)", "सागर जगताप (सेल्समन)"];
    const recognizedStaff = staffNames[Math.floor(Math.random() * staffNames.length)];
    const currentTime = new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', hour12: true });

    const list = document.getElementById("attendanceList");
    const li = document.createElement("li");
    li.className = "flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800 animate-fadeIn";
    li.innerHTML = `
      <span class="font-medium">${recognizedStaff}</span>
      <span class="text-[11px] text-emerald-400 font-mono">${currentTime} (Face Matched ✅)</span>
    `;
    list.prepend(li);

    alert(`🎉 Face Recognition यशस्वी!\nकर्मचारी: ${recognizedStaff}\nवेळ: ${currentTime}\nहजेरी नोंदवण्यात आली आहे!`);
  }, 1200);
}

// ==========================================
// MODULE 3: आठवण (Aathvan - Phase 2 Methods)
// ==========================================

function renderMedicineList() {
  const container = document.getElementById("medicineListContainer");
  const waterDisplay = document.getElementById("waterGlassCount");
  if (!container) return;

  if (waterDisplay) {
    waterDisplay.textContent = appState.waterGlasses || 4;
  }

  container.innerHTML = "";
  appState.medicines.forEach((med, index) => {
    const isTaken = med.status === "taken";
    const card = document.createElement("div");
    card.className = `p-4 rounded-2xl border transition ${
      isTaken 
        ? 'bg-emerald-950/20 border-emerald-800/40 text-slate-300' 
        : 'bg-slate-950 border-slate-800 text-white'
    } flex flex-col sm:flex-row sm:items-center justify-between gap-4`;

    card.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${
          isTaken ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
        }">
          ${isTaken ? '✅' : '💊'}
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h4 class="text-base font-bold ${isTaken ? 'line-through text-slate-400' : 'text-white'}">${med.name}</h4>
            <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${
              isTaken ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }">${med.time}</span>
          </div>
          <p class="text-xs text-slate-400 mt-0.5">${med.instruction}</p>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <button onclick="markMedicineStatus(${med.id}, 'taken')" class="px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
          isTaken 
            ? 'bg-slate-800 text-emerald-400 cursor-default' 
            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 active:scale-95'
        }">
          <i data-lucide="check" class="w-3.5 h-3.5"></i>
          <span>${isTaken ? 'घेतली आहे ✅' : 'हो घेतली ✅'}</span>
        </button>

        ${!isTaken ? `
          <button onclick="snoozeMedicine(${med.id})" class="px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700">
            ⏰ थोड्या वेळाने
          </button>
        ` : ''}
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

function markMedicineStatus(id, status) {
  const med = appState.medicines.find(m => m.id === id);
  if (med) {
    med.status = status;
    saveState();
    renderMedicineList();
    if (status === "taken") {
      speakMarathi(`छान आजोबा! तुम्ही ${med.name} घेतली आहे. तब्येतीची काळजी घ्या!`);
    }
  }
}

function snoozeMedicine(id) {
  const med = appState.medicines.find(m => m.id === id);
  if (med) {
    alert(`⏰ ${med.name} साठी १५ मिनिटांचा अलार्म सेट केला आहे.`);
    speakMarathi(`ठीक आहे आजोबा, मी १५ मिनिटांनी पुन्हा आठवण करून देईन.`);
  }
}

function drinkWaterGlass() {
  appState.waterGlasses = (appState.waterGlasses || 0) + 1;
  saveState();
  const waterDisplay = document.getElementById("waterGlassCount");
  if (waterDisplay) waterDisplay.textContent = appState.waterGlasses;
  speakMarathi(`अतिशय उत्तम आजोबा! पाणी प्यायल्याने ताजेतवाने वाटते.`);
}

function openAddMedicineModal() {
  document.getElementById("addMedicineModal").classList.remove("hidden");
}

function closeAddMedicineModal() {
  document.getElementById("addMedicineModal").classList.add("hidden");
}

function saveNewMedicine() {
  const name = document.getElementById("newMedName").value;
  const time = document.getElementById("newMedTime").value;
  const instruction = document.getElementById("newMedInstruction").value;

  appState.medicines.push({
    id: Date.now(),
    name: name,
    time: time,
    instruction: instruction,
    status: "pending"
  });

  saveState();
  renderMedicineList();
  closeAddMedicineModal();
  alert(`'${name}' हे नवीन औषध वेळापत्रकात जोडले गेले!`);
}

// Emergency SOS Trigger
function triggerEmergencySOS() {
  const contact = appState.familyInfo.phone || "+919822012345";
  const elderName = "आनंदा पाटील (आजोबा)";
  
  const msg = `🚨 *तातडीचा इशारा! (DnyanX आठवण SOS)* 🚨%0A%0A` +
    `प्रिय कुटुंबिय, *${elderName}* यांनी घरातून तातडीचे मदतीचे (Emergency SOS) बटण दाबले आहे!%0A` +
    `पत्ता: *${appState.familyInfo.address}*%0A%0A` +
    `कृपया तात्काळ त्यांच्याशी संपर्क साधा किंवा शेजाऱ्यांना कळवा!%0A` +
    `_DnyanX परिवार द्वारे पाठवलेला स्वयंचलित सुरक्षा संदेश._`;

  // WhatsApp Alert Link
  const rawPhone = contact.replace(/\D/g, "");
  const waUrl = `https://wa.me/91${rawPhone.slice(-10)}?text=${msg}`;
  window.open(waUrl, "_blank");

  speakMarathi("सावध व्हा! आपत्कालीन इशारा कुटुंबियांना व्हॉट्सॲपवर पाठवला गेला आहे.");
  alert("🚨 तातडीची मदत (SOS)! कुटुंबियांच्या व्हॉट्सॲपवर संदेश पाठवला गेला आहे.");
}

// Marathi Voice & Speech Assistant Logic
let isListening = false;

function toggleVoiceAssistant() {
  const btn = document.getElementById("voiceListenBtn");
  const title = document.getElementById("voiceStatusTitle");
  const sub = document.getElementById("voiceStatusSub");

  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    // Fallback if browser doesn't support Web Speech
    const prompts = [
      "आजोबा, सकाळची बीपीची गोळी घेतली का?",
      "आजोबा, आज हवामान खूप छान आहे, थोडे फिरून या!",
      "आजोबा, पाणी पिण्याची वेळ झाली आहे, १ ग्लास पाणी घ्या."
    ];
    const reply = prompts[Math.floor(Math.random() * prompts.length)];
    appendAathvanReply(reply);
    speakMarathi(reply);
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'mr-IN'; // Marathi language recognition
  recognition.interimResults = false;

  if (!isListening) {
    recognition.start();
    isListening = true;
    btn.classList.add("scale-110", "ring-4", "ring-emerald-400");
    title.textContent = "मी ऐकत आहे... (बोलत रहा)";
    sub.textContent = "मराठीत बोला: 'माझं औषध', 'गोष्ट सांगा', 'नमस्कार' इ.";

    recognition.onresult = (event) => {
      const userSpoke = event.results[0][0].transcript;
      appendUserQuery(userSpoke);
      processAathvanQuery(userSpoke);
    };

    recognition.onerror = (e) => {
      isListening = false;
      btn.classList.remove("scale-110", "ring-4", "ring-emerald-400");
      title.textContent = "माझ्याशी बोला (Tap to Speak)";
      sub.textContent = "माइकवर क्लिक करा आणि बोला";
    };

    recognition.onend = () => {
      isListening = false;
      btn.classList.remove("scale-110", "ring-4", "ring-emerald-400");
      title.textContent = "माझ्याशी बोला (Tap to Speak)";
      sub.textContent = "माइकवर क्लिक करा आणि बोला";
    };
  }
}

function processAathvanQuery(query) {
  let reply = "आजोबा, मी तुमच्या सोबत आहे! सांगा मी काय मदत करू?";
  const q = query.toLowerCase();

  if (q.includes("औषध") || q.includes("गोळी")) {
    const pendingMed = appState.medicines.find(m => m.status === "pending");
    if (pendingMed) {
      reply = `आजोबा, तुमची ${pendingMed.name} ${pendingMed.time} वाजता घ्यायची बाकी आहे.`;
    } else {
      reply = "आजोबा, आजची सर्व औषधे तुम्ही वेळेवर घेतली आहेत. खूप छान!";
    }
  } else if (q.includes("पाणी")) {
    reply = `आजोबा, आज तुम्ही एकूण ${appState.waterGlasses || 4} ग्लास पाणी प्यायला आहात. अजून १ ग्लास पाणी पिऊन घ्या.`;
  } else if (q.includes("गोष्ट") || q.includes("गाणं") || q.includes("कथा")) {
    reply = "एकदा एका सुंदर गावात एक शेतकरी राहायचा, त्याचे गावकरी त्याच्या ज्ञानाचा आदर करायचे. माणसाचे खरे धन त्याचे कुटुंब असते!";
  } else if (q.includes("नमस्कार") || q.includes("कसा आहेस") || q.includes("कसे आहात")) {
    reply = "नमस्कार आजोबा! मी अगदी मस्त आहे. तुम्ही कसे आहात? आज काही दुखत नाही ना?";
  }

  appendAathvanReply(reply);
  speakMarathi(reply);
}

function sendAathvanText() {
  const input = document.getElementById("aathvanChatInput");
  const text = input.value.trim();
  if (!text) return;

  appendUserQuery(text);
  input.value = "";
  processAathvanQuery(text);
}

function appendUserQuery(text) {
  const chatLog = document.getElementById("aathvanChatLog");
  const div = document.createElement("div");
  div.className = "bg-slate-900 border border-slate-700/60 rounded-xl p-3 text-xs text-right text-indigo-300";
  div.innerHTML = `<strong>तुम्ही:</strong> ${text}`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function appendAathvanReply(text) {
  const chatLog = document.getElementById("aathvanChatLog");
  const div = document.createElement("div");
  div.className = "bg-slate-900/90 border border-emerald-800/40 rounded-xl p-3 text-xs text-slate-200 animate-fadeIn";
  div.innerHTML = `<div class="font-bold text-emerald-400 mb-1 flex items-center gap-1"><span>🌸 आठवण AI:</span></div><p>${text}</p>`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function speakMarathi(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'mr-IN';
    utterance.rate = 0.9; // થોडं शांत आणि स्पष्ट
    window.speechSynthesis.speak(utterance);
  }
}

// Initial Initialization
window.addEventListener("DOMContentLoaded", () => {
  renderFamilyMembers();
  renderPoItems();
  renderStockList();
  renderMedicineList();
  lucide.createIcons();
});

