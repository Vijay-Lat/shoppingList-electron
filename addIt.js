
const electron = require("electron");
const { ipcRenderer } = electron;

const formVal = document.querySelector("form")
formVal.addEventListener('submit', saveItem)
const item = document.getElementById("item");
function saveItem(e) {
    e.preventDefault()
    const itemValue = item.value;
    ipcRenderer.send("item:add", itemValue);
}