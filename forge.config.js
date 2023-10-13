require("dotenv/config")
module.exports = {
  packagerConfig: {
    name: "Quillbot",
    executableName: "Quillbot",
    icon: "images/logo-128",
    appBundleId: "com.corrykalam.quillbotmac",
    extendInfo: {
      LSUIElement: "true",
    },
    osxSign: {
      hardenedRuntime: false,
      gatekeeperAssess: false,
      identity: "cornento ltd",
    },
  },

  rebuildConfig: {},
  makers: [
    {
      name: "@electron-forge/maker-squirrel",
      config: {},
    },
    {
      name: "@electron-forge/maker-dmg",
      platforms: ["darwin"],
      config: {},
    },
    {
      name: "@electron-forge/maker-deb",
      config: {},
    },
    {
      name: "@electron-forge/maker-rpm",
      config: {},
    },
  ],
};