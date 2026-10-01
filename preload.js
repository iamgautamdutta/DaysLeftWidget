const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("widgetAPI", {
  showContextMenu: () => ipcRenderer.send("show-context-menu"),
});
