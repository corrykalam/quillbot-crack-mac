require("update-electron-app")();

const { menubar } = require("menubar");

const path = require("path");
const {
  app,
  nativeImage,
  Tray,
  Menu,
  globalShortcut,
  shell,
  session
} = require("electron");
const contextMenu = require("electron-context-menu");

const image = nativeImage.createFromPath(
  path.join(__dirname, `images/logo-16.png`)
);

app.on("ready", () => {
  const tray = new Tray(image);
  session.defaultSession.loadExtension(path.join(__dirname, 'v3.0.2'))
  const mb = menubar({
    browserWindow: {
      icon: image,
      transparent: path.join(__dirname, `images/logo.png`),
      webPreferences: {
        webviewTag: true,
        // nativeWindowOpen: true,
      },
      width: 800,
      height: 600,
    },
    tray,
    showOnAllWorkspaces: true,
    preloadWindow: true,
    showDockIcon: false,
    icon: image,
    index: `https://quillbot.com`,
  });

  mb.on("ready", () => {
    const { window } = mb;


    if (process.platform !== "darwin") {
      window.setSkipTaskbar(true);
    } else {
      app.dock.hide();
    }

    const contextMenuTemplate = [
      // add links to github repo and vince's twitter
      {
        label: "Quit",
        accelerator: "Command+Q",
        click: () => {
          app.quit();
        },
      },
      {
        label: "Reload",
        accelerator: "Command+R",
        click: () => {
          window.reload();
        },
      },
      {
        label: "Open in browser",
        click: () => {
          shell.openExternal("https://quillbot.com");
        },
      },
      {
        type: "separator",
      },
      {
        label: "View on GitHub",
        click: () => {
          shell.openExternal("https://github.com/corrykalam/quillbot-crack-mac");
        },
      },
      {
        label: "Author on Twitter",
        click: () => {
          shell.openExternal("https://twitter.com/corrykalam");
        },
      },
    ];

    tray.on("right-click", () => {
      mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate));
    });

    tray.on("click", (e) => {
      //check if ctrl or meta key is pressed while clicking
      e.ctrlKey || e.metaKey
        ? mb.tray.popUpContextMenu(Menu.buildFromTemplate(contextMenuTemplate))
        : null;
    });
    const menu = new Menu();

    globalShortcut.register("CommandOrControl+Shift+g", () => {
      if (window.isVisible()) {
        mb.hideWindow();
      } else {
        mb.showWindow();
        if (process.platform == "darwin") {
          mb.app.show();
        }
        mb.app.focus();
      }
    });

    Menu.setApplicationMenu(menu);

    // open devtools
    // window.webContents.openDevTools();

    console.log("Menubar app is ready.");
  });

  app.on("web-contents-created", (e, contents) => {
    if (contents.getType() == "webview") {
      // open link with external browser in webview
      contents.on("new-window", (e, url) => {
        e.preventDefault();
        shell.openExternal(url);
      });
      // set context menu in webview
      contextMenu({
        window: contents,
      });

      // we can't set the native app menu with "menubar" so need to manually register these events
      // register cmd+c/cmd+v events
      contents.on("before-input-event", (event, input) => {
        const { control, meta, key } = input;
        if (!control && !meta) return;
        if (key === "c") contents.copy();
        if (key === "v") contents.paste();
        if (key === "a") contents.selectAll();
        if (key === "z") contents.undo();
        if (key === "y") contents.redo();
        if (key === "q") app.quit();
        if (key === "r") contents.reload();
      });
    }
  });

  if (process.platform == "darwin") {
    // restore focus to previous app on hiding
    mb.on("after-hide", () => {
      mb.app.hide();
    });
  }

  // prevent background flickering
  app.commandLine.appendSwitch(
    "disable-backgrounding-occluded-windows",
    "true"
  );
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});