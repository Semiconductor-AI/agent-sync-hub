const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('agentSync', Object.freeze({
  scan: () => ipcRenderer.invoke('inventory:scan'),
  meta: () => ipcRenderer.invoke('app:meta')
}));

