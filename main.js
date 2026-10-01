const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");

let mainWindow = null;

const positionFile = path.join(app.getPath("userData"), "window-position.json");

function loadPosition() {
  try {
    const data = fs.readFileSync(positionFile, "utf8");
    const pos = JSON.parse(data);
    if (typeof pos.x === "number" && typeof pos.y === "number") {
      return pos;
    }
  } catch (e) {
    // ignore – first launch or corrupt file
  }
  return { x: 320, y: 40 };
}

function savePosition(x, y) {
  try {
    fs.writeFileSync(positionFile, JSON.stringify({ x, y }));
  } catch (e) {
    // ignore write errors
  }
}

function createWindow() {
  const pos = loadPosition();

  mainWindow = new BrowserWindow({
    width: 500,
    height: 475,
    x: pos.x,
    y: pos.y,
    transparent: true,
    frame: false,
    resizable: false,
    hasShadow: false,
    skipTaskbar: true,
    backgroundColor: "#00000000",
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  mainWindow.loadFile("index.html");

  // Persist position whenever the window is moved
  mainWindow.on("move", () => {
    const [x, y] = mainWindow.getPosition();
    savePosition(x, y);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

// Context menu (right-click) – built in main process
ipcMain.on("show-context-menu", () => {
  if (!mainWindow) return;

  const startWithWindows = app.getLoginItemSettings().openAtLogin;

  const template = [
    {
      label: "Start with Windows",
      type: "checkbox",
      checked: startWithWindows,
      click: (item) => {
        app.setLoginItemSettings({
          openAtLogin: item.checked,
          args: [],
        });
      },
    },
    { type: "separator" },
    {
      label: "Quit",
      click: () => {
        app.quit();
      },
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  menu.popup(mainWindow);
});

// Single instance lock
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  });
}

app.on("window-all-closed", () => {
  app.quit();
});
