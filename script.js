let history = [];
let currentKey = "default";

function saveHistory(key="default"){
  localStorage.setItem("baccaratHistory_" + key, JSON.stringify(history));
}

function loadHistory(key="default"){
  let data = localStorage.getItem("baccaratHistory_" + key);
  if(data){
    history = JSON.parse(data);
  } else {
    history = [];
  }
  updateRoadmaps();
}

function searchHistory(){
  let key = document.getElementById("tableKey").value.trim();
  if(key){
    currentKey = key;
    loadHistory(currentKey);
  } else {
    alert("ใส่ชื่อโต๊ะหรือวันที่ก่อน");
  }
}

function addResult(){
  const input = document.getElementById("resultInput");
  let val = input.value.trim().toUpperCase();
  if(["B","P","T"].includes(val)){
    history.push(val);
    saveHistory(currentKey);
    input.value="";
    updateRoadmaps();
  } else {
    alert("ใส่ได้เฉพาะ B / P / T");
  }
}

function addMulti(){
  const input = document.getElementById("multiInput");
  let vals = input.value.trim().toUpperCase();
  for(let ch of vals){
    if(["B","P","T"].includes(ch)){
      history.push(ch);
    }
  }
  saveHistory(currentKey);
  input.value="";
  updateRoadmaps();
}

function undoResult(){
  history.pop();
  saveHistory(currentKey);
  updateRoadmaps();
}

function resetAll(){
  history = [];
  saveHistory(currentKey);
  updateRoadmaps();
}

function updateRoadmaps(){
  drawBigRoad();
  drawOtherRoad("bigEyeRoad","red","blue");
  drawOtherRoad("smallRoad","red","blue");
  drawOtherRoad("cockroachRoad","red","blue");
}

function drawBigRoad(){
  let canvas = document.getElementById("bigRoad");
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let cellW = 20, cellH = 20;
  let col = 0, row = 0, last = null;
  for(let i=0;i<history.length;i++){
    let res = history[i];
    if(res === last){
      row++;
      if((row+1)*cellH > canvas.height){
        row = 0; col++;
      }
    } else {
      col++; row=0; last=res;
    }
    let x = col*cellW, y=row*cellH;
    ctx.strokeStyle = "black"; ctx.strokeRect(x,y,cellW,cellH);
    ctx.fillStyle = (res==="B"?"blue":res==="P"?"red":"green");
    ctx.beginPath();
    ctx.arc(x+cellW/2,y+cellH/2,cellW/2-2,0,Math.PI*2);
    ctx.fill();
  }
}

function drawOtherRoad(canvasId,color1,color2){
  let canvas = document.getElementById(canvasId);
  let ctx = canvas.getContext("2d");
  ctx.clearRect(0,0,canvas.width,canvas.height);
  let cellW = 15, cellH = 15;
  for(let i=0;i<history.length;i++){
    let res = history[i];
    let x = (i%20)*cellW, y=Math.floor(i/20)*cellH;
    ctx.strokeStyle="black"; ctx.strokeRect(x,y,cellW,cellH);
    ctx.fillStyle = (i%2===0?color1:color2);
    ctx.beginPath();
    ctx.arc(x+cellW/2,y+cellH/2,cellW/2-2,0,Math.PI*2);
    ctx.fill();
  }
}

window.onload = function(){
  let key = document.getElementById("tableKey").value.trim() || "default";
  currentKey = key;
  loadHistory(currentKey);
}
