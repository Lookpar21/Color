let rooms = {};
let currentRoom = null;

window.onload = function() {
  let saved = localStorage.getItem("baccarat_rooms_v4");
  if (saved) rooms = JSON.parse(saved);

  if (Object.keys(rooms).length === 0) {
    createRoom("ข้อมูล1");
  } else {
    currentRoom = Object.keys(rooms)[0];
  }
  updateRoomSelect();
  drawAll();
}

function save() {
  localStorage.setItem("baccarat_rooms_v4", JSON.stringify(rooms));
}

function createRoom(name) {
  rooms[name] = {
    big: [],
    bigEye: [],
    small: [],
    cockroach: []
  };
  currentRoom = name;
  save();
  updateRoomSelect();
}

function newRoom() {
  let count = Object.keys(rooms).length + 1;
  let name = "ข้อมูล" + count;
  createRoom(name);
}

function updateRoomSelect() {
  let select = document.getElementById("roomSelect");
  select.innerHTML = "";
  Object.keys(rooms).forEach(room => {
    let opt = document.createElement("option");
    opt.value = room;
    opt.text = room;
    if (room === currentRoom) opt.selected = true;
    select.add(opt);
  });
}

function changeRoom() {
  let select = document.getElementById("roomSelect");
  currentRoom = select.value;
  drawAll();
}

function addRoad(type) {
  let input = document.getElementById(type + "Input").value.toUpperCase();
  if (!input || !currentRoom) return;
  let arr = input.split("");
  rooms[currentRoom][type] = rooms[currentRoom][type].concat(arr);
  document.getElementById(type + "Input").value = "";
  save();
  drawAll();
}

function undo(type) {
  if (!currentRoom) return;
  rooms[currentRoom][type].pop();
  save();
  drawAll();
}

function clearRoad(type) {
  if (!currentRoom) return;
  if (confirm("คุณแน่ใจว่าจะล้างข้อมูลทั้งหมดของ " + type + " ?")) {
    rooms[currentRoom][type] = [];
    save();
    drawAll();
  }
}

function drawAll() {
  if (!currentRoom) return;
  drawGrid("bigRoad", rooms[currentRoom].big);
  drawGrid("bigEyeRoad", rooms[currentRoom].bigEye);
  drawGrid("smallRoad", rooms[currentRoom].small);
  drawGrid("cockroachRoad", rooms[currentRoom].cockroach);
}

function drawGrid(id, arr) {
  let div = document.getElementById(id);
  div.innerHTML = "";
  const rows = 6;
  let col = 0, row = 0;
  arr.forEach((r, i) => {
    let cell = document.createElement("div");
    cell.className = "cell " + r;
    cell.innerText = r;
    cell.style.gridRowStart = (row % rows) + 1;
    cell.style.gridColumnStart = col + 1;
    div.appendChild(cell);
    row++;
    if (row >= rows) { row = 0; col++; }
  });
}

function search() {
  if (!currentRoom) return;
  let input = document.getElementById("searchInput").value.toUpperCase();
  if (!input) return;
  let stored = rooms[currentRoom];

  let bigArr = stored.big;
  let bigStr = bigArr.join("");

  let idx = bigStr.indexOf(input);
  if (idx !== -1 && idx + input.length < bigArr.length) {
    let nextBig = bigArr[idx + input.length];
    let nextBigEye = stored.bigEye[idx + input.length] || "-";
    let nextSmall = stored.small[idx + input.length] || "-";
    let nextCockroach = stored.cockroach[idx + input.length] || "-";

    alert("พบสถิติในห้อง " + currentRoom +
      "\nBig Road: " + bigArr.join("") +
      "\nตาถัดไปของ Big Road หลัง " + input + " คือ: " + nextBig +
      "\nBig Eye Road: " + stored.bigEye.join("") +
      "\nตาถัดไปคือ: " + nextBigEye +
      "\nSmall Road: " + stored.small.join("") +
      "\nตาถัดไปคือ: " + nextSmall +
      "\nCockroach Road: " + stored.cockroach.join("") +
      "\nตาถัดไปคือ: " + nextCockroach);
  } else {
    alert("ยังไม่เคยบันทึกสถิติที่มี Big Road แบบนี้ในห้อง " + currentRoom);
  }
}


// 📌 Export: ดาวน์โหลดไฟล์ JSON
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

// 📌 Import: โหลดไฟล์ JSON กลับเข้ามา
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
