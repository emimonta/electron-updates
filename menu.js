const {
  app,
  Menu,
  shell,
  ipcMain,
  BrowserWindow,
  globalShortcut,
} = require("electron");

const template = [
  {
    label: "Format",
    submenu: [
      {
        label: "Toggle Bold",
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send("editor-event", "toggle-bold"); // Invia al renderer (Chromium)
        },
      },
      {
        label: "Toggle Italic",
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send("editor-event", "toggle-italic"); // Invia al renderer (Chromium)
        },
      },
      {
        label: "Toggle Strike throught",
        click() {
          const window = BrowserWindow.getFocusedWindow();
          window.webContents.send("editor-event", "toggle-strike"); // Invia al renderer (Chromium)
        },
      },
    ],
  },
  {
    role: "help",
    submenu: [
      {
        label: "About Editor Component",
        click() {
          shell.openExternal("https://simplemde.com/");
        },
      },
    ],
  },
];

if (process.platform === "darwin") {
  template.unshift({
    label: app.getName(),
    submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
  });
}

if (process.env.DEBUG) {
  template.push({
    label: "Debugging",
    submenu: [
      {
        role: "toggleDevTools",
        label: "Dev tools",
      },
      { type: "separator" },
      {
        role: "reload",
        accelerator: "Alt+R",
      },
    ],
  });
}

ipcMain.on("editor-reply", (event, arg) => {
  console.log(`Received reply from web page: ${arg}`);
});

ipcMain.on("save", (event, arg) => {
  console.log("Saving content of file");
  console.log(arg);
});

app.on("ready", () => {
  globalShortcut.register("CommandOrControl+S", () => {
    console.log("Saving the file");
    const window = BrowserWindow.getFocusedWindow();
    window.webContents.send("editor-event", "save"); // Invia al renderer (Chromium)
  });
});

const menu = Menu.buildFromTemplate(template);

module.exports = menu;
