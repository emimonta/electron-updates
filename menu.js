const {
  app,
  Menu,
  shell,
  ipcMain,
  BrowserWindow,
  globalShortcut,
  dialog,
} = require("electron");
const fs = require("fs");

const template = [
  {
    label: "File",
    submenu: [
      {
        label: "Open",
        accelerator: "CommandOrControl+O",
        click() {
          loadFile();
        },
      },
      {
        label: "Save",
        accelerator: "CommandOrControl+S",
        click() {
          saveFile();
        },
      },
    ],
  },
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

// Azioni da fare quando ricevo un evento "editor-reply" da parte del renderer
ipcMain.on("editor-reply", (event, arg) => {
  console.log(`Received reply from web page: ${arg}`);
});

// Azioni da fare quando ricevo un evento "save" dal rederer che mi passa il contenuto da salvare
ipcMain.on("save", (event, arg) => {
  console.log(`Saving content of the file`);
  console.log(arg);

  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: "Save markdown file",
    filters: [{ name: "MyFile", extensions: ["md"] }],
  };

  dialog.showSaveDialog(window, options).then((res) => {
    if (res.filePath) {
      console.log(`Saving content to the file: ${res.filePath}`);
      fs.writeFileSync(res.filePath, arg);
    }
  });
});

function saveFile() {
  console.log("Saving the file");

  const window = BrowserWindow.getFocusedWindow();
  window.webContents.send("editor-event", "save"); // Invia al renderer (Chromium)
}

function loadFile() {
  const window = BrowserWindow.getFocusedWindow();
  const options = {
    title: "Save markdown file",
    filters: [
      { name: "Markdown files", extensions: ["md"] },
      { name: "Text files", extensions: ["txt"] },
    ],
  };

  dialog.showOpenDialog(window, options).then((res) => {
    if (res.filePaths && res.filePaths.length > 0) {
      const content = fs.readFileSync(res.filePaths[0]).toString();
      console.log(content);
      window.webContents.send("load", content);
    }
  });
}

// Assegno gli accelerator
app.on("ready", () => {
  globalShortcut.register("CommandOrControl+S", () => {
    saveFile();
  });

  globalShortcut.register("CommandOrControl+O", () => {
    loadFile();
  });
});

const menu = Menu.buildFromTemplate(template);

module.exports = menu;
