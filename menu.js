const { app, Menu, shell } = require("electron");

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
  {
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
  },
];

if (process.platform === "darwin") {
  template.unshift({
    label: app.getName(),
    submenu: [{ role: "about" }, { type: "separator" }, { role: "quit" }],
  });
}

const menu = Menu.buildFromTemplate(template);

module.exports = menu;
