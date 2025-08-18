
let rooms = {};
let currentRoom = null;

function save() {
  localStorage.setItem("baccarat_rooms_v5", JSON.stringify(rooms));
}

function load() {
  const data = localStorage.getItem("baccarat_rooms_v5");
  if (data) rooms = JSON.parse(data);
  updateRoomSelect();
}

function updateRoomSelect() {
  const select = document.getElementById("roomSelect");
  select.innerHTML = "";
  for (const r in rooms) {
    const opt = document.createElement("option");
    opt.value = r;
    opt.textContent = r;
    if (r === currentRoom) opt.selected = true;
    select.appendChild(opt);
  }
}

function createRoom(name) {
  if (!rooms[name]) {
    rooms[name] = { big: [], bigEye: [], small: [], cockroach: [] };
  }
  currentRoom = name;
  save();
  updateRoomSelect();
}

function newRoom() {
  const name = "ข้อมูล" + (Object.keys(rooms).length + 1);
  createRoom(name);
}

function switchRoom(name) {
  currentRoom = name;
}

function saveInput(type) {
  if (!currentRoom) { alert("กรุณาสร้างห้องก่อน"); return; }
  const idMap = { big: "bigInput", bigEye: "bigEyeInput", small: "smallInput", cockroach: "cockroachInput" };
  const val = document.getElementById(idMap[type]).value.trim();
  if (val) {
    rooms[currentRoom][type].push(val);
    save();
  }
}

function searchPattern() {
  if (!currentRoom) { alert("ยังไม่มีห้อง"); return; }
  const pattern = document.getElementById("searchInput").value.trim();
  let result = "";
  const data = rooms[currentRoom];

  function findNext(arr) {
    for (let seq of arr) {
      const idx = seq.indexOf(pattern);
      if (idx !== -1 && idx + pattern.length < seq.length) {
        return seq.substring(0, idx + pattern.length + 1);
      }
    }
    return "ไม่พบ";
  }

  result += "Big Road: " + findNext(data.big) + "\n";
  result += "Big Eye Road: " + findNext(data.bigEye) + "\n";
  result += "Small Road: " + findNext(data.small) + "\n";
  result += "Cockroach Road: " + findNext(data.cockroach) + "\n";

  document.getElementById("searchResult").textContent = result;
}

// Export
function exportData() {
  const dataStr = JSON.stringify(rooms, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "baccarat_data.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import
function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const imported = JSON.parse(e.target.result);
      rooms = imported;
      save();
      updateRoomSelect();
      alert("นำเข้าข้อมูลเรียบร้อยแล้ว ✅");
    } catch (err) {
      alert("ไฟล์ไม่ถูกต้อง ❌");
    }
  };
  reader.readAsText(file);
}

load();
