const { app, Menu, shell, ipcMain } = require("electron");

const template = [
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

const menu = Menu.buildFromTemplate(template);

module.exports = menu;
