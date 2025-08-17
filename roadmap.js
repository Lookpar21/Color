let data = {
  big: [],
  bigEye: [],
  small: [],
  cockroach: []
};

window.onload = function() {
  let saved = localStorage.getItem("baccarat_manual");
  if (saved) data = JSON.parse(saved);
  drawAll();
}

function save() {
  localStorage.setItem("baccarat_manual", JSON.stringify(data));
}

function addRoad(type) {
  let input = document.getElementById(type + "Input").value.toUpperCase();
  if (!input) return;
  let arr = input.split("");
  data[type] = data[type].concat(arr);
  document.getElementById(type + "Input").value = "";
  save();
  drawAll();
}

function undo(type) {
  data[type].pop();
  save();
  drawAll();
}

function clearRoad(type) {
  if (confirm("คุณแน่ใจว่าจะล้างข้อมูลทั้งหมดของ " + type + " ?")) {
    data[type] = [];
    save();
    drawAll();
  }
}

function drawAll() {
  drawGrid("bigRoad", data.big);
  drawGrid("bigEyeRoad", data.bigEye);
  drawGrid("smallRoad", data.small);
  drawGrid("cockroachRoad", data.cockroach);
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

// ค้นหา: ใช้ big road input มาแสดงผลในกริด
function search() {
  let input = document.getElementById("searchInput").value.toUpperCase();
  if (!input) return;
  let arr = input.split("");
  alert("Big Road รูปแบบ: " + input + "\n(สามารถต่อยอดคำนวณ Big Eye/Small/Cockroach ได้)");
}
