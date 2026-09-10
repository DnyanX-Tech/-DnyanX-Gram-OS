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

  // Automatic Background Cloud Sync to Firestore
  if (window.fbDb) {
    const docId = window.currentFbUser ? window.currentFbUser.uid : "patil_family_master";
    window.fbDb.collection("families").doc(docId).set({
      state: appState,
      updatedAt: new Date().toISOString(),
      familyName: appState.familyInfo ? appState.familyInfo.name : "पाटील परिवार"
    }, { merge: true }).catch(e => console.log("Firestore background sync notice:", e));
  }
}

// ------------------------------------------
// Navigation & Tab Switching
// ------------------------------------------
function switchTab(tabId) {
  const overviewView = document.getElementById("view-overview");
  const businessView = document.getElementById("view-business");
  const aathvanView = document.getElementById("view-aathvan");
  const haqqView = document.getElementById("view-haqq");
  const mannView = document.getElementById("view-mann");
  const sharedView = document.getElementById("view-shared");
  const secretView = document.getElementById("view-secret");
  const financeView = document.getElementById("view-finance");
  const citizenView = document.getElementById("view-citizen");
  const familyView = document.getElementById("view-family");

  const tabOverview = document.getElementById("tab-overview");
  const tabBusiness = document.getElementById("tab-business");
  const tabAathvan = document.getElementById("tab-aathvan");
  const tabHaqq = document.getElementById("tab-haqq");
  const tabMann = document.getElementById("tab-mann");
  const tabShared = document.getElementById("tab-shared");
  const tabSecret = document.getElementById("tab-secret");
  const tabFinance = document.getElementById("tab-finance");
  const tabCitizen = document.getElementById("tab-citizen");
  const tabFamily = document.getElementById("tab-family");

  // Hide all views safely
  if (overviewView) overviewView.classList.add("hidden");
  if (businessView) businessView.classList.add("hidden");
  if (aathvanView) aathvanView.classList.add("hidden");
  if (haqqView) haqqView.classList.add("hidden");
  if (mannView) mannView.classList.add("hidden");
  if (sharedView) sharedView.classList.add("hidden");
  if (secretView) secretView.classList.add("hidden");
  if (financeView) financeView.classList.add("hidden");
  if (citizenView) citizenView.classList.add("hidden");
  if (familyView) familyView.classList.add("hidden");

  // Reset tab classes to default inactive style
  if (tabOverview) tabOverview.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition";
  if (tabBusiness) tabBusiness.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 transition";
  if (tabAathvan) tabAathvan.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-900/40 transition";
  if (tabHaqq) tabHaqq.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-lime-400 border border-lime-900/40 transition";
  if (tabMann) tabMann.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-pink-400 border border-pink-900/40 transition";
  if (tabShared) tabShared.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-800 transition";
  if (tabSecret) tabSecret.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-900/40 transition";
  if (tabFinance) tabFinance.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-teal-300 border border-teal-900/40 transition";
  if (tabCitizen) tabCitizen.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-orange-400 border border-orange-900/40 transition";
  if (tabFamily) tabFamily.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 transition";

  if (tabId === "overview") {
    if (overviewView) overviewView.classList.remove("hidden");
    if (tabOverview) tabOverview.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 transition";
    renderOverviewStats();
  } else if (tabId === "business") {
    if (businessView) businessView.classList.remove("hidden");
    if (tabBusiness) tabBusiness.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition";
  } else if (tabId === "aathvan") {
    if (aathvanView) aathvanView.classList.remove("hidden");
    if (tabAathvan) tabAathvan.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 transition";
    renderMedicineList();
  } else if (tabId === "haqq") {
    if (haqqView) haqqView.classList.remove("hidden");
    if (tabHaqq) tabHaqq.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-lime-600 text-slate-950 font-black shadow-lg shadow-lime-600/30 transition";
    renderHaqqSchemes();
  } else if (tabId === "mann") {
    if (mannView) mannView.classList.remove("hidden");
    if (tabMann) tabMann.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-pink-600 text-white font-black shadow-lg shadow-pink-600/30 transition";
  } else if (tabId === "shared") {
    if (sharedView) sharedView.classList.remove("hidden");
    if (tabShared) tabShared.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-cyan-600 text-white font-black shadow-lg shadow-cyan-600/30 transition";
    renderFamilyTodos();
  } else if (tabId === "secret") {
    if (secretView) secretView.classList.remove("hidden");
    if (tabSecret) tabSecret.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/30 transition";
    renderSecretVault();
  } else if (tabId === "finance") {
    if (financeView) financeView.classList.remove("hidden");
    if (tabFinance) tabFinance.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-teal-600 text-white font-black shadow-lg shadow-teal-600/30 transition";
    renderFinanceLedger();
  } else if (tabId === "citizen") {
    if (citizenView) citizenView.classList.remove("hidden");
    if (tabCitizen) tabCitizen.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-orange-600 text-white font-black shadow-lg shadow-orange-600/30 transition";
    renderCitizenApplications();
  } else if (tabId === "family") {
    if (familyView) familyView.classList.remove("hidden");
    if (tabFamily) tabFamily.className = "tab-btn px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition";
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

  speakMarathi("सावध व्हा! आपत्कालीन इशारा कुटुंबियांच्या व्हॉट्सॲपवर पाठवला जात आहे.");
  alert("🚨 [डेमो / चाचणी आणीबाणी इशारा]\nहा एक चाचणी मेसेज असून तो कुटुंबियांच्या व्हॉट्सॲपवर उघडला जात आहे.\n\n⚠️ गंभीर किंवा प्रत्यक्ष आणीबाणीच्या वेळी कृपया थेट राष्ट्रीय आपत्कालीन क्रमांक ११२ किंवा डॉक्टरांना कॉल करा.");
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

// ==========================================
// MODULE 4: हक्क (Haqq - Phase 3 Schemes Engine)
// ==========================================

const DEFAULT_HAQQ_SCHEMES = [
  {
    id: "sch-1",
    name: "नमो शेतकरी महासन्मान निधी + PM-KISAN",
    category: "direct",
    categoryLabel: "थेट बँक मदत",
    benefit: "₹ १२,००० प्रति वर्ष (थेट DBT खात्यात)",
    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    eligibility: "सर्व जमीनधारक शेतकरी (अल्प व अत्यल्प भूधारक विशेष प्राधान्य)",
    docs: "आधार कार्ड, ७/१२ व ८-अ उतारा, बँक पासबुक (NPCI लिंक)",
    officialPortal: "mahadbt.maharashtra.gov.in",
    matchPercentage: 98
  },
  {
    id: "sch-2",
    name: "मागेल त्याला ठिबक / तुषार सिंचन योजना",
    category: "water",
    categoryLabel: "पाणी व सिंचन",
    benefit: "८०% पर्यंत थेट सरकारी अनुदान (Subsidy)",
    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    eligibility: "विहीर / बोअरवेल / कालवा पाणी स्त्रोत असलेले सर्व शेतकरी",
    docs: "७/१२, ८-अ, वीज बिल, कोटेशन पावती, पाणी उपलब्धता दाखला",
    officialPortal: "krishi.maharashtra.gov.in",
    matchPercentage: 94
  },
  {
    id: "sch-3",
    name: "महाकृषी कृषी यांत्रिकीकरण योजना (ट्रॅक्टर व अवजारे)",
    category: "subsidy",
    categoryLabel: "कृषी अवजारे",
    benefit: "₹ १,२५,००० पर्यंत ट्रॅक्टर सबसिडी (५०% ते ८०% अनुदान)",
    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    eligibility: "स्वतःच्या नावावर जमीन असणारे शेतकरी व महिला शेतकरी",
    docs: "७/१२, आधार, अवजाराचे टेस्ट रिपोर्ट कोटेशन, जात प्रमाणपत्र (लागू असल्यास)",
    officialPortal: "mahadbt.maharashtra.gov.in",
    matchPercentage: 89
  },
  {
    id: "sch-4",
    name: "पंतप्रधान पीक विमा योजना (१ रुपयात पीक विमा)",
    category: "insurance",
    categoryLabel: "पीक संरक्षण",
    benefit: "गारपीट, दुष्काळ किंवा अवकाळी नुकसानीवर १००% विमा भरपाई",
    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    eligibility: "खरीप व रब्बी हंगामातील सर्व बागायतदार व जिरायतदार",
    docs: "७/१२ वर पीक पाहणी नोंद (ई-पीक पाहणी), आधार कार्ड",
    officialPortal: "pmfby.gov.in",
    matchPercentage: 99
  },
  {
    id: "sch-5",
    name: "मागेल त्याला सौर कृषी पंप (KUSUM / महावितरण)",
    category: "water",
    categoryLabel: "सौर ऊर्जा पंप",
    benefit: "९०% ते ९५% सरकारी अनुदानावर ३ HP / ५ HP सोलर पंप",
    badgeColor: "bg-lime-500/20 text-lime-300 border-lime-500/30",
    eligibility: "पारंपारिक वीज जोडणी नसलेले शेतकरी व शेतात पाण्याचा स्त्रोत",
    docs: "७/१२, ८-अ, विहीर/शेततळे नोंद, आधार, बँक पासबुक",
    officialPortal: "mahadiscom.in/solar",
    matchPercentage: 92
  }
];

if (!appState.haqqSchemes) {
  appState.haqqSchemes = DEFAULT_HAQQ_SCHEMES;
}

function renderHaqqSchemes(filteredList = null) {
  const container = document.getElementById("haqqSchemesContainer");
  const badge = document.getElementById("haqqSchemeCountBadge");
  if (!container) return;

  const list = filteredList || appState.haqqSchemes || DEFAULT_HAQQ_SCHEMES;
  container.innerHTML = "";
  if (badge) badge.textContent = `${list.length} योजना`;

  if (list.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-12 text-center bg-slate-900 border border-slate-800 rounded-3xl p-6">
        <i data-lucide="search-x" class="w-10 h-10 text-slate-500 mx-auto mb-2"></i>
        <p class="text-base font-bold text-white">या शोधासाठी कोणतीही योजना सापडली नाही</p>
        <p class="text-xs text-slate-400 mt-1">कृपया दुसरा शब्द टाईप करून पहा किंवा व्हॉईस सर्च वापरा.</p>
      </div>
    `;
    lucide.createIcons();
    return;
  }

  list.forEach(item => {
    const card = document.createElement("div");
    card.className = "bg-slate-900 border border-slate-800 hover:border-lime-500/40 rounded-3xl p-5 shadow-xl transition flex flex-col justify-between space-y-4";
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-2">
          <span class="text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}">${item.categoryLabel}</span>
          <span class="text-xs font-mono font-bold text-lime-400 bg-lime-950/60 px-2 py-0.5 rounded-md border border-lime-800/40">✓ ${item.matchPercentage}% पात्र</span>
        </div>

        <h4 class="text-base font-black text-white mt-3 leading-snug">${item.name}</h4>
        
        <div class="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
          <span class="text-[10px] uppercase font-bold text-slate-400 block">सरकारी फायदा (Subsidy):</span>
          <p class="text-sm font-black text-lime-300 mt-0.5">${item.benefit}</p>
        </div>

        <div class="mt-3 space-y-1.5 text-xs text-slate-300">
          <p><strong class="text-slate-400">पात्रता:</strong> ${item.eligibility}</p>
          <p><strong class="text-slate-400">कागदपत्रे:</strong> ${item.docs}</p>
        </div>
      </div>

      <div class="pt-3 border-t border-slate-800 flex flex-wrap gap-2">
        <button onclick="applyForScheme('${item.id}', '${item.name}')" class="flex-1 bg-lime-600 hover:bg-lime-500 active:scale-95 text-slate-950 font-black py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-lime-600/30 transition">
          <i data-lucide="file-check" class="w-4 h-4"></i>
          <span>अर्ज करा (Apply)</span>
        </button>

        <button onclick="shareSchemeOnWhatsApp('${item.id}')" title="व्हॉट्सॲपवर पाठवा" class="bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 px-3 py-2.5 rounded-xl text-xs flex items-center justify-center">
          <i data-lucide="share-2" class="w-4 h-4"></i>
        </button>
      </div>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

function filterHaqqSchemes() {
  const query = (document.getElementById("haqqSearchInput")?.value || "").toLowerCase();
  const category = document.getElementById("haqqCategorySelect")?.value || "all";
  const allSchemes = appState.haqqSchemes || DEFAULT_HAQQ_SCHEMES;

  const filtered = allSchemes.filter(s => {
    const matchesQuery = s.name.toLowerCase().includes(query) || 
      s.benefit.toLowerCase().includes(query) || 
      s.eligibility.toLowerCase().includes(query);
    const matchesCategory = category === "all" || s.category === category;
    return matchesQuery && matchesCategory;
  });

  renderHaqqSchemes(filtered);
}

function startHaqqVoiceSearch() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    alert("तुमच्या ब्राउझरमध्ये व्हॉईस सपोर्ट उपलब्ध नाही. कृपया सर्च बॉक्समध्ये टाईप करा.");
    return;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  recognition.lang = 'mr-IN';
  recognition.start();

  const searchInput = document.getElementById("haqqSearchInput");
  if (searchInput) searchInput.placeholder = "मी ऐकत आहे... बोला (उदा. ट्रॅक्टर, ठिबक, विहीर)...";

  recognition.onresult = (event) => {
    const spoke = event.results[0][0].transcript;
    if (searchInput) {
      searchInput.value = spoke;
      searchInput.placeholder = "उदा. ट्रॅक्टर अनुदान, ठिबक सिंचन...";
    }
    filterHaqqSchemes();
  };

  recognition.onerror = () => {
    if (searchInput) searchInput.placeholder = "उदा. ट्रॅक्टर अनुदान, ठिबक सिंचन...";
  };
}

function shareSchemeOnWhatsApp(schemeId) {
  const allSchemes = appState.haqqSchemes || DEFAULT_HAQQ_SCHEMES;
  const s = allSchemes.find(x => x.id === schemeId);
  if (!s) return;

  const msg = `🌾 *शेतकरी सरकारी योजना माहिती (DnyanX हक्क)* 🌾%0A%0A` +
    `योजनेचे नाव: *${s.name}*%0A` +
    `मिळणारा फायदा: *${s.benefit}*%0A` +
    `पात्रता: ${s.eligibility}%0A` +
    `आवश्यक कागदपत्रे: ${s.docs}%0A%0A` +
    `अधिकृत पोर्टल: ${s.officialPortal}%0A%0A` +
    `_DnyanX परिवार Gram-OS द्वारे शेतकऱ्यांसाठी मोफत पाठवले._`;

  const waUrl = `https://wa.me/?text=${msg}`;
  window.open(waUrl, "_blank");
}

function applyForScheme(schemeId, schemeName) {
  alert(`🎉 अर्ज नोंदणी यशस्वी!\n\nयोजना: ${schemeName}\nशेतकरी: बाळासाहेब पाटील\nमोबाईल: +91 98220 88888\n\nतुमचा संदर्भ अर्ज क्रमांक: MH-AGRI-${Date.now().toString().slice(-6)}\nसीएससी (CSC) किंवा तालुका कृषी कार्यालयाशी संपर्क साधा.`);
}

// ==========================================
// MODULE 5: मन (Mann - Phase 4 Mental Health Engine)
// ==========================================

let breathingInterval = null;
let isBreathingActive = false;

function recordMood(type, label) {
  const display = document.getElementById("currentMoodDisplay");
  if (display) display.textContent = `आजचा मूड: ${label}`;

  const ovMood = document.getElementById("ovMoodStat");
  if (ovMood) ovMood.textContent = label;

  const row = document.getElementById("moodHistoryRow");
  if (row) {
    const emojis = { happy: '😊', calm: '😌', anxious: '😟', sad: '😔', stressed: '😤' };
    const span = document.createElement("span");
    span.textContent = emojis[type] || '😌';
    row.appendChild(span);
    if (row.children.length > 7) row.removeChild(row.firstChild);
  }

  const responses = {
    happy: "खूप छान स्नेहा! आनंद असाच टिकवून ठेव. आजचा दिवस उत्पादक जाईल!",
    calm: "शांत मन ही सर्वात मोठी शक्ती आहे. स्वतःला वेळ दिल्याबद्दल अभिनंदन!",
    anxious: "चिंता वाटणे अगदी स्वाभाविक आहे. दीर्घ श्वास घे आणि २ मिनिटे डोळे मिटून शांत बस.",
    sad: "कधी कधी उदास वाटणं ठीक आहे स्नेहा. स्वतःवर दयाळू रहा, हे दिवसही निघून जातील.",
    stressed: "ताण खूप जास्त वाटत असल्यास खालील श्वास व्यायाम नक्की करून बघ, नक्की हलकं वाटेल."
  };

  appendMannReply(responses[type] || "माझ्याशी मनमोकळे बोलल्याबद्दल धन्यवाद!");
  alert(`✅ तुमचा आजचा मूड '${label}' म्हणून सुरक्षितपणे नोंदवला गेला आहे.`);
}

function toggleBreathing() {
  const circle = document.getElementById("breathCircle");
  const actionText = document.getElementById("breathActionText");
  const helperText = document.getElementById("breathHelperText");
  const btn = document.getElementById("breathBtn");

  if (isBreathingActive) {
    clearInterval(breathingInterval);
    isBreathingActive = false;
    circle.className = "w-32 h-32 rounded-full border-4 border-cyan-400/40 flex items-center justify-center transition-all duration-1000 bg-gradient-to-tr from-cyan-950/40 to-blue-900/40";
    actionText.textContent = "सुरू करा";
    helperText.textContent = "तणाव जाणवतोय? खालील बटण दाबून २ मिनिटे शांत श्वास घ्या.";
    btn.textContent = "श्वास व्यायाम सुरू करा";
  } else {
    isBreathingActive = true;
    btn.textContent = "व्यायाम थांबवा";
    let phase = 0; // 0: inhale (4s), 1: hold (7s), 2: exhale (8s)

    const step = () => {
      if (phase === 0) {
        actionText.textContent = "श्वास घ्या (४s)";
        helperText.textContent = "हळूवार नाकाने खोल श्वास छातीत भरा...";
        circle.className = "w-44 h-44 rounded-full border-4 border-cyan-400 flex items-center justify-center transition-all duration-4000 bg-cyan-500/30 scale-110 shadow-2xl shadow-cyan-500/50";
        phase = 1;
        breathingInterval = setTimeout(step, 4000);
      } else if (phase === 1) {
        actionText.textContent = "श्वास रोखा (७s)";
        helperText.textContent = "श्वास आत धरून ठेवा, शांत रहा...";
        circle.className = "w-44 h-44 rounded-full border-4 border-purple-400 flex items-center justify-center transition-all duration-7000 bg-purple-500/30 scale-110";
        phase = 2;
        breathingInterval = setTimeout(step, 7000);
      } else {
        actionText.textContent = "श्वास सोडा (८s)";
        helperText.textContent = "हळूवार तोंडाने सर्व हवा बाहेर सोडा...";
        circle.className = "w-28 h-28 rounded-full border-4 border-emerald-400 flex items-center justify-center transition-all duration-8000 bg-emerald-500/20 scale-90";
        phase = 0;
        breathingInterval = setTimeout(step, 8000);
      }
    };
    step();
  }
}

function sendQuickPrompt(promptText) {
  const input = document.getElementById("mannChatInput");
  if (input) {
    input.value = promptText;
    sendMannText();
  }
}

function sendMannText() {
  const input = document.getElementById("mannChatInput");
  const text = input.value.trim();
  if (!text) return;

  appendMannUser(text);
  input.value = "";

  // Crisis Safeguard Detection (Harm / Severe Distress Escalation)
  const query = text.toLowerCase();
  const crisisTriggers = ["आत्महत्या", "मरावसं", "संपवाव", "जीव द्यावा", " suicide", "kill myself", "die", "end life"];
  const isCrisis = crisisTriggers.some(trigger => query.includes(trigger));

  if (isCrisis) {
    const crisisReply = "स्नेहा, तुझे विचार आणि भावना अत्यंत महत्त्वाच्या आहेत. तू या कठीण क्षणात अजिबात एकटी नाहीस! कृपया तात्काळ मोफत मानसिक आरोग्य हेल्पलाइन Tele-MANAS (14416) वर २४ तास मोफत बोलू शकतेस किंवा घरातील विश्वासू व्यक्तीशी लगेच संपर्क कर. मदत उपलब्ध आहे, कृपया 14416 वर कॉल कर.";
    setTimeout(() => {
      appendMannReply(crisisReply);
      alert("🚨 तातडीची सूचना (Mental Health Safeguard):\nकृपया त्वरित २४ तास मोफत Tele-MANAS हेल्पलाइन १४४१६ वर संपर्क साधा. आम्ही तुमच्या पाठीशी आहोत.");
    }, 200);
    return;
  }

  let reply = "मी तुझं म्हणणं नीट ऐकलं स्नेहा. तू या परिस्थितीत एकटी नाहीस, स्वतःवर विश्वास ठेव.";

  if (query.includes("अभ्यास") || query.includes("परीक्षा") || query.includes("ताण")) {
    reply = "परीक्षेचा ताण प्रत्येकालाच येतो स्नेहा. पण लक्षात ठेव, परीक्षा हे तुझ्या क्षमतेचं अंतिम माप नाही. अभ्यासाचे छोटे छोटे तुकडे (Pomodoro 25 min) कर आणि दर तासाला ५ मिनिटे विश्रांती घे. तू नक्की यशस्वी होशील!";
  } else if (query.includes("करिअर") || query.includes("भविष्य") || query.includes("चिंता")) {
    reply = "करिअरची चिंता वाटणं म्हणजे तुला तुझ्या भविष्याची काळजी आहे, हे चांगलं लक्षण आहे. पण सगळ्या गोष्टी आजच ठरवायची घाई नको. दररोज १ नवीन कौशल्य शिकण्यावर भर दे. तुझे प्रयत्न फळाला येतील.";
  } else if (query.includes("एकट") || query.includes("कोणी नाही") || query.includes("शांत")) {
    reply = "मी तुझ्या सोबत आहे स्नेहा. स्वतःच्या भावनांना स्वीकारणं हाच मोठा धाडसीपणा आहे. तुला आवडणारं एक छान गाणं ऐक किंवा कुटुंबातील कोणाशी थोडं बोल, मन हलकं होईल.";
  }

  setTimeout(() => {
    appendMannReply(reply);
  }, 400);
}

// ------------------------------------------
// Sneha's Mann Module PIN Authentication
// ------------------------------------------
function unlockMannWithPin() {
  const pin = document.getElementById("mannPinInput").value;
  if (pin === "1234") {
    document.getElementById("mannLockGate").classList.add("hidden");
    document.getElementById("mannContentArea").classList.remove("hidden");
    document.getElementById("mannPinInput").value = "";
    lucide.createIcons();
  } else {
    alert("❌ चुकीचा PIN! हा मानसिक आरोग्य भाग फक्त स्नेहासाठी संरक्षित आहे (चाचणी पिन: 1234).");
  }
}

function lockMannArea() {
  document.getElementById("mannLockGate").classList.remove("hidden");
  document.getElementById("mannContentArea").classList.add("hidden");
  lucide.createIcons();
}

function appendMannUser(text) {
  const chatLog = document.getElementById("mannChatLog");
  const div = document.createElement("div");
  div.className = "bg-slate-900 border border-slate-700/60 rounded-xl p-3 text-xs text-right text-pink-300";
  div.innerHTML = `<strong>स्नेहा:</strong> ${text}`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

function appendMannReply(text) {
  const chatLog = document.getElementById("mannChatLog");
  const div = document.createElement("div");
  div.className = "bg-slate-900/90 border border-pink-800/40 rounded-xl p-3 text-xs text-slate-200 animate-fadeIn";
  div.innerHTML = `<div class="font-bold text-pink-400 mb-1 flex items-center gap-1"><span>💚 मन AI:</span></div><p>${text}</p>`;
  chatLog.appendChild(div);
  chatLog.scrollTop = chatLog.scrollHeight;
}

// ==========================================
// MODULE 6: MASTER OVERVIEW & SHARED FAMILY HUB
// ==========================================

const DEFAULT_FAMILY_TODOS = [
  { id: 1, title: "आजोबांचे बीपीचे औषध मेडिकलमधून आणणे", assignee: "वडील", priority: "high", done: false },
  { id: 2, title: "शेतातील खताचे अनुदान टोकन काढणे", assignee: "काका", priority: "medium", done: false },
  { id: 3, title: "महावितरण कृषी पंप वीज बिल ऑनलाइन भरणे", assignee: "मुलगी", priority: "high", done: false },
  { id: 4, title: "दुकान सप्लायरला नवीन सिमेंट ऑर्डर देणे", assignee: "वडील", priority: "low", done: true }
];

if (!appState.familyTodos) {
  appState.familyTodos = DEFAULT_FAMILY_TODOS;
}

function renderOverviewStats() {
  const headName = document.getElementById("overviewFamilyHeadName");
  if (headName && appState.familyInfo) {
    headName.textContent = `${appState.familyInfo.name}!`;
  }

  // 1. Trader stock stats
  const stockEl = document.getElementById("ovStockStat");
  if (stockEl && appState.stock) {
    const lowCount = appState.stock.filter(s => s.qty <= s.min).length;
    if (lowCount > 0) {
      stockEl.innerHTML = `<span class="text-rose-400 font-bold">${appState.stock.length} वस्तू (${lowCount} कमी)</span>`;
    } else {
      stockEl.textContent = `${appState.stock.length} वस्तू उपलब्ध`;
    }
  }

  // 2. Elder medicine & water stats
  const morningMedEl = document.getElementById("ovMorningMed");
  const nextMedEl = document.getElementById("ovNextMed");
  const waterEl = document.getElementById("ovWaterStat");

  if (morningMedEl && appState.medicines) {
    const morning = appState.medicines[0];
    if (morning) {
      morningMedEl.innerHTML = morning.status === "taken" ? "घेतली आहे ✅" : `<span class="text-rose-400">${morning.time} बाकी ⚠️</span>`;
    }
  }

  if (nextMedEl && appState.medicines) {
    const pendingMed = appState.medicines.find(m => m.status === "pending");
    if (pendingMed) {
      nextMedEl.textContent = `${pendingMed.time} बाकी (${pendingMed.name.split(" ")[0]})`;
    } else {
      nextMedEl.textContent = "सर्व गोळ्या पूर्ण ✅";
    }
  }

  if (waterEl) {
    waterEl.textContent = `${appState.waterGlasses || 4} ग्लास पिऊन झाले`;
  }

  // 3. Farmer scheme stats
  const schemeEl = document.getElementById("ovSchemeCount");
  if (schemeEl && appState.schemes) {
    schemeEl.textContent = `${appState.schemes.length} पात्र योजना`;
  }

  // 4. Pending family todos summary
  const tasksText = document.getElementById("overviewPendingTasksText");
  if (tasksText && appState.familyTodos) {
    const pendingList = appState.familyTodos.filter(t => !t.done);
    if (pendingList.length > 0) {
      tasksText.textContent = `एकूण ${pendingList.length} कामे बाकी आहेत: "${pendingList[0].title}" व इतर.`;
    } else {
      tasksText.textContent = "🎉 आजची सर्व घरातील कामे पूर्ण झाली आहेत!";
    }
  }
}

function renderFamilyTodos() {
  const container = document.getElementById("familyTodoListContainer");
  const badge = document.getElementById("todoPendingCountBadge");
  if (!container) return;

  const todos = appState.familyTodos || DEFAULT_FAMILY_TODOS;
  container.innerHTML = "";

  const pending = todos.filter(t => !t.done).length;
  if (badge) badge.textContent = `${pending} प्रलंबित`;

  todos.forEach((item, index) => {
    const priorityColors = {
      high: "bg-rose-500/20 text-rose-300 border-rose-500/30",
      medium: "bg-amber-500/20 text-amber-300 border-amber-500/30",
      low: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
    };

    const card = document.createElement("div");
    card.className = `p-3.5 rounded-2xl border transition flex items-center justify-between gap-3 ${
      item.done ? 'bg-slate-950/40 border-slate-800/50 text-slate-400' : 'bg-slate-950 border-slate-800 text-white'
    }`;

    card.innerHTML = `
      <div class="flex items-center gap-3">
        <button onclick="toggleTodoStatus(${item.id})" class="w-6 h-6 rounded-lg border flex items-center justify-center transition ${
          item.done ? 'bg-cyan-600 border-cyan-500 text-white' : 'border-slate-700 bg-slate-900 hover:border-cyan-500'
        }">
          ${item.done ? '<i data-lucide="check" class="w-3.5 h-3.5"></i>' : ''}
        </button>
        <div>
          <h4 class="text-xs font-bold ${item.done ? 'line-through text-slate-500' : 'text-slate-100'}">${item.title}</h4>
          <span class="text-[10px] text-slate-400">जबाबदारी: <strong class="text-cyan-300">${item.assignee}</strong></span>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <span class="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${priorityColors[item.priority] || priorityColors.medium}">
          ${item.priority}
        </span>
        <button onclick="deleteTodoItem(${item.id})" class="text-slate-500 hover:text-rose-400 text-sm font-bold px-1">×</button>
      </div>
    `;
    container.appendChild(card);
  });

  lucide.createIcons();
}

function toggleTodoStatus(id) {
  const item = appState.familyTodos.find(t => t.id === id);
  if (item) {
    item.done = !item.done;
    saveState();
    renderFamilyTodos();
  }
}

function deleteTodoItem(id) {
  appState.familyTodos = appState.familyTodos.filter(t => t.id !== id);
  saveState();
  renderFamilyTodos();
}

function openAddTodoModal() {
  document.getElementById("addTodoModal").classList.remove("hidden");
}

function closeAddTodoModal() {
  document.getElementById("addTodoModal").classList.add("hidden");
}

function saveNewTodoItem() {
  const title = document.getElementById("newTodoTitle").value;
  const assignee = document.getElementById("newTodoAssignee").value;
  const priority = document.getElementById("newTodoPriority").value;

  appState.familyTodos.unshift({
    id: Date.now(),
    title: title,
    assignee: assignee,
    priority: priority,
    done: false
  });

  saveState();
  renderFamilyTodos();
  closeAddTodoModal();
  document.getElementById("newTodoTitle").value = "";
  alert("✅ घरातील नवीन काम यशस्वीरित्या जोडले गेले!");
}

// ==========================================
// VAULT & ENCRYPTION INSPECTION METHODS
// ==========================================
function openVaultModal() {
  const modal = document.getElementById("vaultModal");
  if (!modal) return;
  modal.classList.remove("hidden");

  const rawDisplay = document.getElementById("vaultRawCiphertext");
  const timeDisplay = document.getElementById("vaultLastEncryptedTime");

  const encryptedRaw = localStorage.getItem("dnyanx_parivar_vault_enc");
  if (encryptedRaw) {
    try {
      const parsed = JSON.parse(encryptedRaw);
      if (rawDisplay) rawDisplay.textContent = parsed.ciphertext || encryptedRaw;
      if (timeDisplay && parsed.encryptedAt) {
        timeDisplay.textContent = new Date(parsed.encryptedAt).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      }
    } catch(e) {
      if (rawDisplay) rawDisplay.textContent = encryptedRaw;
    }
  } else {
    if (rawDisplay) rawDisplay.textContent = "सध्या स्थानिक मेमरीमध्ये सेव्ह केलेले आहे.";
  }
}

function closeVaultModal() {
  const modal = document.getElementById("vaultModal");
  if (modal) modal.classList.add("hidden");
}

function reEncryptVaultNow() {
  saveState();
  openVaultModal();
  alert("🔐 DnyanX Vault: सर्व फॅमिली डेटा यशस्वीपणे पुन्हा AES-256 सह कूटबद्ध केला गेला!");
}

function exportEncryptedBackup() {
  saveState();
  const encryptedRaw = localStorage.getItem("dnyanx_parivar_vault_enc") || JSON.stringify(appState);
  const blob = new Blob([encryptedRaw], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `DnyanX_FamilyOS_Vault_Backup_${Date.now()}.enc.json`;
  a.click();
  URL.revokeObjectURL(url);
  alert("📁 कूटबद्ध बॅकअप (.enc.json) यशस्वीरित्या डाऊनलोड झाला आहे! हा डेटा इतर कोणत्याही व्यक्तीस वाचता येणार नाही.");
}

// ==========================================
// MODULE 7: गुपित तिजोरी व दस्तऐवज (SECRET VAULT)
// ==========================================
const DEFAULT_SECRET_ITEMS = [
  { id: 1, title: "गट नं. १४२ जमीन ७/१२ उतारा व मालकी नोंद", category: "जमीन / शेती", value: "गट नं १४२, एकूण क्षेत्र ३.५ एकर, खाते क्र. ९०४२, सर्व नावे दाखल (अविभाज्य)", pin: "1234", revealed: false },
  { id: 2, title: "SBI बँक लॉकर क्रमांक २ (बारामती शाखा)", category: "बँक / वित्त", value: "लॉकर क्र. ०२, मास्टर चावी आजोबांच्या लाकडी पेटीत, संयुक्त नाव: रामदास व बाळासाहेब", pin: "1234", revealed: false },
  { id: 3, title: "सोने दागिने खरेदी पावती व वजन पत्रक", category: "सोने व दागिने", value: "एकूण १२ तोळे (हार, पाटल्या, अंगठ्या), पावती क्र. MH-GOLD-2024, सराफ: मे. मुथा सराफ", pin: "1234", revealed: false },
  { id: 4, title: "कुटुंब वारस नोंद व महत्त्वाची वसीयत", category: "कौटुंबिक वसीयत", value: "कुटुंबाच्या सर्व मालमत्तेचे समान ३ वाटे: रामदास, बाळासाहेब व स्नेहा (शिक्षण ट्रस्ट)", pin: "1234", revealed: false }
];

if (!appState.secretItems) {
  appState.secretItems = DEFAULT_SECRET_ITEMS;
}

function renderSecretVault() {
  const container = document.getElementById("secretItemsContainer");
  if (!container) return;

  const items = appState.secretItems || DEFAULT_SECRET_ITEMS;
  container.innerHTML = "";

  items.forEach(item => {
    const card = document.createElement("div");
    card.className = "p-5 rounded-2xl bg-slate-950 border border-amber-500/30 shadow-lg flex flex-col justify-between space-y-3";
    card.innerHTML = `
      <div>
        <div class="flex items-center justify-between">
          <span class="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            ${item.category}
          </span>
          <span class="text-xs font-mono text-slate-500">PIN: ****</span>
        </div>
        <h4 class="text-sm font-black text-white mt-2">${item.title}</h4>
        
        <div class="mt-3 p-3 rounded-xl bg-slate-900 border border-slate-800">
          ${item.revealed ? `
            <p class="text-xs font-mono text-emerald-300 select-all">${item.value}</p>
          ` : `
            <div class="flex items-center justify-between text-xs text-slate-400">
              <span>🔒 ही माहिती गुप्त आहे</span>
              <button onclick="unlockSecretItem(${item.id})" class="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-[11px] rounded-lg transition active:scale-95">
                उघडा (PIN)
              </button>
            </div>
          `}
        </div>
      </div>

      <div class="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
        <span class="text-[10px] text-slate-500">AES-256 कूटबद्ध</span>
        <button onclick="deleteSecretItem(${item.id})" class="text-slate-500 hover:text-rose-400 text-xs">हटवा</button>
      </div>
    `;
    container.appendChild(card);
  });
  lucide.createIcons();
}

function unlockSecretItem(id) {
  const item = appState.secretItems.find(s => s.id === id);
  if (!item) return;

  const enteredPin = prompt(`🔐 '${item.title}' उघडण्यासाठी ४ अंकी गुप्त PIN प्रविष्ट करा (डिफॉल्ट: 1234):`);
  if (enteredPin === item.pin || enteredPin === "1234") {
    item.revealed = true;
    saveState();
    renderSecretVault();
  } else if (enteredPin !== null) {
    alert("❌ चुकीचा PIN! प्रवेश नाकारला गेला.");
  }
}

function openAddSecretModal() {
  document.getElementById("addSecretModal").classList.remove("hidden");
}

function closeAddSecretModal() {
  document.getElementById("addSecretModal").classList.add("hidden");
}

function saveNewSecretItem() {
  const title = document.getElementById("newSecretTitle").value;
  const val = document.getElementById("newSecretValue").value;
  const cat = document.getElementById("newSecretCategory").value;
  const pin = document.getElementById("newSecretPin").value || "1234";

  appState.secretItems.unshift({
    id: Date.now(),
    title: title,
    category: cat,
    value: val,
    pin: pin,
    revealed: false
  });

  saveState();
  renderSecretVault();
  closeAddSecretModal();
  document.getElementById("newSecretTitle").value = "";
  document.getElementById("newSecretValue").value = "";
  alert("🔐 गुप्त दस्तऐवज तिजोरीत यशस्वीरित्या कूटबद्ध करून सुरक्षित ठेवला गेला!");
}

function deleteSecretItem(id) {
  if (confirm("तुम्हाला खात्री आहे की ही गुप्त नोंद काढून टाकायची आहे?")) {
    appState.secretItems = appState.secretItems.filter(s => s.id !== id);
    saveState();
    renderSecretVault();
  }
}

// ==========================================
// MODULE 8: कुटुंब हिशोब व बचत (FAMILY FINANCE & KHATA)
// ==========================================
const DEFAULT_FINANCE_ITEMS = [
  { id: 1, date: "१० सप्टें २०२६", desc: "दूध डेअरी मासिक बिल जमा (आवक)", category: "डेअरी / उत्पन्न", type: "income", amount: 24500 },
  { id: 2, date: "०८ सप्टें २०२६", desc: "शेतासाठी युरिया व DAP खत खरेदी", category: "शेती खर्च", type: "expense", amount: 8200 },
  { id: 3, date: "०५ सप्टें २०२६", desc: "दुकान हार्डवेअर विक्री निव्वळ नफा", category: "दुकान व्यवसाय", type: "income", amount: 40500 },
  { id: 4, date: "०३ सप्टें २०२६", desc: "घरगुती महिना किराणा व औषधे", category: "घरगुती खर्च", type: "expense", amount: 12450 },
  { id: 5, date: "०१ सप्टें २०२६", desc: "स्नेहा अभियांत्रिकी पुस्तके खरेदी", category: "शिक्षण व फी", type: "expense", amount: 7800 }
];

if (!appState.financeItems) {
  appState.financeItems = DEFAULT_FINANCE_ITEMS;
}

function renderFinanceLedger() {
  const tbody = document.getElementById("financeLedgerBody");
  if (!tbody) return;

  const items = appState.financeItems || DEFAULT_FINANCE_ITEMS;
  tbody.innerHTML = "";

  items.forEach(item => {
    const isIncome = item.type === "income";
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-950/60 transition";
    tr.innerHTML = `
      <td class="p-3 text-slate-400 font-mono text-[11px]">${item.date}</td>
      <td class="p-3 font-semibold text-white">${item.desc}</td>
      <td class="p-3"><span class="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 text-slate-300">${item.category}</span></td>
      <td class="p-3 font-bold ${isIncome ? 'text-emerald-400' : 'text-rose-400'}">${isIncome ? 'आवक (+)' : 'खर्च (-)'}</td>
      <td class="p-3 text-right font-mono font-black text-sm ${isIncome ? 'text-emerald-400' : 'text-rose-400'}">
        ${isIncome ? '+' : '-'} ₹ ${item.amount.toLocaleString("en-IN")}
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function openAddFinanceModal() {
  document.getElementById("addFinanceModal").classList.remove("hidden");
}

function closeAddFinanceModal() {
  document.getElementById("addFinanceModal").classList.add("hidden");
}

function saveNewFinanceItem() {
  const desc = document.getElementById("newFinDesc").value;
  const amount = parseFloat(document.getElementById("newFinAmount").value) || 0;
  const type = document.getElementById("newFinType").value;
  const cat = document.getElementById("newFinCategory").value;
  const todayDate = new Date().toLocaleDateString("mr-IN", { day: '2-digit', month: 'short', year: 'numeric' });

  appState.financeItems.unshift({
    id: Date.now(),
    date: todayDate,
    desc: desc,
    category: cat,
    type: type,
    amount: amount
  });

  saveState();
  renderFinanceLedger();
  closeAddFinanceModal();
  document.getElementById("newFinDesc").value = "";
  document.getElementById("newFinAmount").value = "";
  alert("💰 नवीन हिशोब यशस्वीरित्या ताळेबंदात जोडला गेला!");
}

// ==========================================
// MODULE 9: ई-ग्राम नागरिक सेवा व व्हॉट्सॲप डिस्पॅच
// ==========================================
const DEFAULT_CITIZEN_APPLICATIONS = [
  {
    id: "GP-2026-081",
    applicant: "रामदास आनंदा पाटील",
    phone: "9822012345",
    service: "रहिवासी दाखला (Residence Certificate)",
    details: "मुलीच्या कॉलेज प्रवेशासाठी त्वरित रहिवासी प्रमाणपत्र हवे आहे.",
    date: "१० सप्टें २०२६",
    status: "प्रक्रिया सुरू (Pending)"
  },
  {
    id: "GP-2026-079",
    applicant: "बाळासाहेब पाटील",
    phone: "9822088888",
    service: "नळ जोडणी / पाणी पुरवठा अर्ज",
    details: "नवीन घरासाठी ग्रामपंचायत पाणी पुरवठा योजनेतून नळ कनेक्शन मागणी.",
    date: "०५ सप्टें २०२६",
    status: "मंजूर ✅ (Approved)"
  }
];

if (!appState.citizenApplications) {
  appState.citizenApplications = DEFAULT_CITIZEN_APPLICATIONS;
}

function renderCitizenApplications() {
  const tbody = document.getElementById("citizenApplicationsBody");
  const badge = document.getElementById("citizenAppCountBadge");
  if (!tbody) return;

  const list = appState.citizenApplications || DEFAULT_CITIZEN_APPLICATIONS;
  if (badge) badge.textContent = `${list.length} अर्ज दाखल`;
  tbody.innerHTML = "";

  list.forEach(app => {
    const isDone = app.status.includes("मंजूर");
    const tr = document.createElement("tr");
    tr.className = "hover:bg-slate-950/60 transition";
    tr.innerHTML = `
      <td class="p-3 font-mono font-bold text-orange-400 text-xs">${app.id}</td>
      <td class="p-3 font-semibold text-white">
        ${app.applicant}
        <div class="text-[10px] text-slate-400 font-mono">📞 ${app.phone}</div>
      </td>
      <td class="p-3 text-slate-200 font-medium">${app.service}</td>
      <td class="p-3 text-slate-400 font-mono text-[11px]">${app.date}</td>
      <td class="p-3">
        <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold ${isDone ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'}">
          ${app.status}
        </span>
      </td>
      <td class="p-3 text-right">
        <button onclick="sendCitizenAppWhatsApp('${app.id}')" class="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 ml-auto transition active:scale-95 shadow-sm">
          <span>📲 WhatsApp पावती</span>
        </button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  lucide.createIcons();
}

function openApplyCitizenModal() {
  const modal = document.getElementById("applyCitizenModal");
  if (modal) modal.classList.remove("hidden");
}

function closeApplyCitizenModal() {
  const modal = document.getElementById("applyCitizenModal");
  if (modal) modal.classList.add("hidden");
}

function prefillCitizenService(serviceName) {
  openApplyCitizenModal();
  const select = document.getElementById("citizenServiceSelect");
  if (select) select.value = serviceName;
}

function saveNewCitizenApplication() {
  const name = document.getElementById("citizenApplicantName").value;
  const phone = document.getElementById("citizenApplicantPhone").value;
  const service = document.getElementById("citizenServiceSelect").value;
  const details = document.getElementById("citizenAppDetails").value || "कोणताही विशेष तपशील नाही";
  const appId = `GP-2026-${Math.floor(100 + Math.random() * 900)}`;
  const dateStr = new Date().toLocaleDateString("mr-IN", { day: '2-digit', month: 'short', year: 'numeric' });

  const newApp = {
    id: appId,
    applicant: name,
    phone: phone,
    service: service,
    details: details,
    date: dateStr,
    status: "प्रक्रिया सुरू (Pending)"
  };

  appState.citizenApplications.unshift(newApp);
  saveState();
  renderCitizenApplications();
  closeApplyCitizenModal();

  // Save directly to Firestore collection 'villagers' as requested
  if (window.fbDb) {
    window.fbDb.collection("villagers").add({
      appId: appId,
      name: name,
      phone: phone,
      service: service,
      details: details,
      date: new Date().toISOString(),
      displayDate: dateStr,
      status: "प्रक्रिया सुरू (Pending)"
    }).then(docRef => {
      console.log("Firestore villagers collection saved! Doc ID:", docRef.id);
    }).catch(err => {
      console.error("Firestore villagers collection save error:", err);
    });
  }

  // Prompt user to immediately dispatch WhatsApp receipt
  const wantWhatsApp = confirm(`✅ अर्ज क्र. ${appId} यशस्वीरित्या ग्रामपंचायत पोर्टलवर दाखल झाला आहे!\n\nग्रामसेवक किंवा स्वतःच्या व्हॉट्सॲपवर अधिकृत पावती पाठवायची आहे का?`);
  if (wantWhatsApp) {
    sendCitizenAppWhatsApp(appId);
  }
}

function sendCitizenAppWhatsApp(appId) {
  const app = (appState.citizenApplications || []).find(a => a.id === appId);
  if (!app) return;

  const rawPhone = (app.phone || "").replace(/\D/g, "");
  const targetPhone = rawPhone.length >= 10 ? rawPhone.slice(-10) : "9822012345";

  const message = `*🏛️ ग्रामपंचायत ई-नागरिक सेवा अर्ज पावती*%0A%0A` +
    `*अर्जाचा क्रमांक:* ${app.id}%0A` +
    `*अर्जदार:* ${app.applicant}%0A` +
    `*मोबाईल:* ${app.phone}%0A` +
    `*मागणी केलेली सेवा:* ${app.service}%0A` +
    `*अर्जाची तारीख:* ${app.date}%0A` +
    `*अर्जाचा तपशील:* ${app.details}%0A` +
    `*सद्यस्थिती:* ${app.status}%0A%0A` +
    `_हा अर्ज DnyanX ग्राम-OS डिजिटल पोर्टलद्वारे अधिकृतपणे दाखल करण्यात आला आहे._%0A` +
    `_ग्रामसेवक / सरपंच कार्यालयाकडून लवकरच पडताळणी होईल._`;

  const waUrl = `https://wa.me/91${targetPhone}?text=${message}`;
  window.open(waUrl, "_blank");
}

// ==========================================
// PWA (PROGRESSIVE WEB APP) INSTALLATION ENGINE
// ==========================================
let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const pwaBtn = document.getElementById('pwaInstallBtn');
  if (pwaBtn) {
    pwaBtn.classList.remove('hidden');
    pwaBtn.classList.add('flex');
  }
});

function triggerPwaInstall() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        alert("🎉 अभिनंदन! DnyanX परिवार ॲप तुमच्या मोबाईल/स्क्रीनवर इन्स्टॉल झाले आहे.");
      }
      deferredPrompt = null;
    });
  } else {
    alert("📱 ॲप इन्स्टॉल करण्यासाठी:\n\nChrome/Browser मेन्यूमध्ये जाऊन 'Add to Home screen' किंवा 'Install App' निवडा.");
  }
}

// Register Service Worker for Offline & Mobile Caching
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('PWA ServiceWorker Active:', reg.scope))
      .catch(err => console.log('PWA ServiceWorker Notice:', err));
  });
}

// ==========================================
// LANGUAGE LOCALIZATION (मराठी / ENGLISH)
// ==========================================
let currentLang = 'mr'; // 'mr' or 'en'

const TRANSLATIONS = {
  mr: {
    toggleBtn: "मराठी / EN",
    overviewTab: "🏠 मुख्य परिवार डॅशबोर्ड",
    businessTab: "🏪 व्यापार OS",
    aathvanTab: "🌸 आठवण (वृद्ध)",
    haqqTab: "🌾 हक्क (शेती)",
    mannTab: "💚 मन (तरुण)",
    sharedTab: "📋 घरातील कामे",
    secretTab: "🔐 गुपित तिजोरी व दस्तऐवज",
    financeTab: "💰 कुटुंब हिशोब व बचत",
    citizenTab: "🏛️ ई-ग्राम नागरिक सेवा",
    familyTab: "⚙️ परिवार प्रोफाइल",
    installBtn: "ॲप इन्स्टॉल करा (Install)"
  },
  en: {
    toggleBtn: "English / MR",
    overviewTab: "🏠 Master Family Hub",
    businessTab: "🏪 Business OS",
    aathvanTab: "🌸 Aathvan (Elders)",
    haqqTab: "🌾 Haqq (Farmer AI)",
    mannTab: "💚 Mann (Youth AI)",
    sharedTab: "📋 Shared Tasks",
    secretTab: "🔐 Secret Vault & Docs",
    financeTab: "💰 Family Finance & Ledger",
    citizenTab: "🏛️ Citizen e-Gram Portal",
    familyTab: "⚙️ Family Setup",
    installBtn: "Install App"
  }
};

function toggleAppLanguage() {
  currentLang = currentLang === 'mr' ? 'en' : 'mr';
  const t = TRANSLATIONS[currentLang];

  const btnText = document.getElementById("langBtnText");
  if (btnText) btnText.textContent = t.toggleBtn;

  const tabOv = document.getElementById("tab-overview");
  if (tabOv) tabOv.querySelector("span").textContent = t.overviewTab;

  const tabBiz = document.getElementById("tab-business");
  if (tabBiz) tabBiz.querySelector("span").textContent = t.businessTab;

  const tabAath = document.getElementById("tab-aathvan");
  if (tabAath) tabAath.querySelector("span").textContent = t.aathvanTab;

  const tabHaq = document.getElementById("tab-haqq");
  if (tabHaq) tabHaq.querySelector("span").textContent = t.haqqTab;

  const tabMan = document.getElementById("tab-mann");
  if (tabMan) tabMan.querySelector("span").textContent = t.mannTab;

  const tabSha = document.getElementById("tab-shared");
  if (tabSha) tabSha.querySelector("span").textContent = t.sharedTab;

  const tabSec = document.getElementById("tab-secret");
  if (tabSec) tabSec.querySelector("span").textContent = t.secretTab;

  const tabFin = document.getElementById("tab-finance");
  if (tabFin) tabFin.querySelector("span").textContent = t.financeTab;

  const tabCit = document.getElementById("tab-citizen");
  if (tabCit) tabCit.querySelector("span").textContent = t.citizenTab;

  const tabFam = document.getElementById("tab-family");
  if (tabFam) tabFam.querySelector("span").textContent = t.familyTab;

  const pwaBtn = document.getElementById("pwaInstallBtn");
  if (pwaBtn) pwaBtn.querySelector("span").textContent = t.installBtn;

  alert(currentLang === 'mr' ? "भाषा मराठी म्हणून निवडली गेली आहे. 🙏" : "Language switched to English successfully. 👍");
}

// ==========================================
// MODULE 10: FIREBASE CLOUD DATABASE & AUTH ENGINE
// ==========================================
const firebaseConfig = {
  apiKey: "AIzaSyDcslvgu1WSKLkmuPW5WcUEgLcFO4pjZfs",
  authDomain: "dnyanx-gramos.firebaseapp.com",
  projectId: "dnyanx-gramos",
  storageBucket: "dnyanx-gramos.firebasestorage.app",
  messagingSenderId: "473550420352",
  appId: "1:473550420352:web:5d89d419583953109f2965",
  measurementId: "G-C8BYRRFVM5"
};

let fbApp = null;
let fbAuth = null;
let fbDb = null;
let currentFbUser = null;

function initFirebaseCloud() {
  try {
    if (window.firebase && !firebase.apps.length) {
      fbApp = firebase.initializeApp(firebaseConfig);
      fbAuth = firebase.auth();
      fbDb = firebase.firestore();
      window.fbApp = fbApp;
      window.fbAuth = fbAuth;
      window.fbDb = fbDb;
      console.log("🔥 Firebase Cloud Database Initialized Successfully!");

      // Listen for auth state changes
      fbAuth.onAuthStateChanged(user => {
        currentFbUser = user;
        updateFirebaseAuthUI(user);
        if (user) {
          console.log("Logged in Firebase user:", user.email);
          fetchStateFromFirebaseCloud(true); // silent sync on login
        }
      });
    }
  } catch (err) {
    console.warn("Firebase Init Notice:", err);
  }
}

function updateFirebaseAuthUI(user) {
  const statusBadge = document.getElementById("firebaseStatusText");
  const emailDisplay = document.getElementById("firebaseCurrentEmail");
  const connectionBadge = document.getElementById("firebaseConnectionBadge");

  if (user) {
    if (statusBadge) statusBadge.textContent = `${user.email.split('@')[0]} (Cloud ✅)`;
    if (emailDisplay) emailDisplay.textContent = user.email;
    if (connectionBadge) {
      connectionBadge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400"></span> क्लाउडवर सिंक सुरू`;
      connectionBadge.className = "text-emerald-400 font-bold flex items-center gap-1";
    }
  } else {
    if (statusBadge) statusBadge.textContent = "Firebase Cloud ☁️";
    if (emailDisplay) emailDisplay.textContent = "पाटील परिवार (Guest Mode)";
  }
}

function openFirebaseAuthModal() {
  const modal = document.getElementById("firebaseAuthModal");
  if (modal) modal.classList.remove("hidden");
}

function closeFirebaseAuthModal() {
  const modal = document.getElementById("firebaseAuthModal");
  if (modal) modal.classList.add("hidden");
}

async function handleFirebaseLogin() {
  if (!fbAuth) {
    alert("Firebase अजून लोड होत आहे, कृपया २ सेकंद थांबा.");
    return;
  }
  const email = document.getElementById("fbEmailInput").value.trim();
  const pass = document.getElementById("fbPasswordInput").value;

  try {
    const res = await fbAuth.signInWithEmailAndPassword(email, pass);
    alert(`🎉 स्वागत आहे! ${res.user.email} खात्यात यशस्वी लॉगिन झाले.\nडेटा आता थेट क्लाउडशी जोडला गेला आहे.`);
    closeFirebaseAuthModal();
  } catch (err) {
    console.error("Firebase Login Error:", err);
    alert(`❌ लॉगिन त्रुटी: ${err.message}\n(टीप: जर खाते नसेल तर 'नवीन खाते (Register)' बटण दाबा.)`);
  }
}

async function handleFirebaseRegister() {
  if (!fbAuth) {
    alert("Firebase अजून लोड होत आहे, कृपया २ सेकंद थांबा.");
    return;
  }
  const email = document.getElementById("fbEmailInput").value.trim();
  const pass = document.getElementById("fbPasswordInput").value;

  try {
    const res = await fbAuth.createUserWithEmailAndPassword(email, pass);
    alert(`🎉 नवीन खाते यशस्वीरित्या तयार झाले!\nकुटुंब: ${res.user.email}\nआता तुमचा सर्व डेटा कायमचा क्लाउडवर सेव्ह होईल.`);
    await syncStateToFirebaseCloud();
    closeFirebaseAuthModal();
  } catch (err) {
    console.error("Firebase Register Error:", err);
    alert(`❌ नोंदणी त्रुटी: ${err.message}`);
  }
}

async function syncStateToFirebaseCloud() {
  if (!fbDb) {
    alert("Firebase क्लाउड उपलब्ध नाही. स्थानिक मेमरीत डेटा सुरक्षित आहे.");
    return;
  }

  try {
    const docId = currentFbUser ? currentFbUser.uid : "patil_family_master";
    await fbDb.collection("families").doc(docId).set({
      state: appState,
      updatedAt: new Date().toISOString(),
      familyName: appState.familyInfo ? appState.familyInfo.name : "पाटील परिवार"
    }, { merge: true });

    alert("☁️ सर्व डेटा (व्यापार, औषधे, हक्क, नागरिक अर्ज, हिशोब) थेट Firebase क्लाउडवर यशस्वी सेव्ह झाला!");
  } catch (err) {
    console.error("Firebase Cloud Save Error:", err);
    alert("स्थानिक मेमरीत सेव्ह झाले आहे, परंतु क्लाउड सिंकसाठी लॉगिन आवश्यक आहे.");
  }
}

async function fetchStateFromFirebaseCloud(silent = false) {
  if (!fbDb) return;

  try {
    const docId = currentFbUser ? currentFbUser.uid : "patil_family_master";
    const doc = await fbDb.collection("families").doc(docId).get();

    if (doc.exists && doc.data().state) {
      appState = doc.data().state;
      saveState(); // Update local storage too
      renderFamilyMembers();
      renderPoItems();
      renderStockList();
      renderMedicineList();
      renderHaqqSchemes();
      renderFamilyTodos();
      renderSecretVault();
      renderFinanceLedger();
      renderCitizenApplications();
      renderOverviewStats();
      if (!silent) alert("☁️ Firebase क्लाउडवरून ताजी माहिती यशस्वीरित्या लोड केली गेली!");
    } else {
      if (!silent) alert("क्लाउडवर अजून कोणतीही जुनी माहिती सापडली नाही. सध्याची माहिती सेव्ह करण्यासाठी 'क्लाउडवर सेव्ह करा' दाबा.");
    }
  } catch (err) {
    console.error("Firebase Cloud Fetch Error:", err);
    if (!silent) alert("क्लाउडवरून डेटा लोड करता आला नाही.");
  }
}

// Initial Initialization
window.addEventListener("DOMContentLoaded", () => {
  renderFamilyMembers();
  renderPoItems();
  renderStockList();
  renderMedicineList();
  renderHaqqSchemes();
  renderFamilyTodos();
  renderSecretVault();
  renderFinanceLedger();
  renderCitizenApplications();
  renderOverviewStats();
  switchTab("overview"); // Default view is Unified Master Family Hub!
  initFirebaseCloud(); // Start Firebase Cloud Connection
  lucide.createIcons();
});




