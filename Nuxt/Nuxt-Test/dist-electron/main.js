import { app as o, BrowserWindow as n } from "electron";
const t = () => {
  new n({
    width: 1200,
    height: 800
  }).loadURL("http://localhost:3000");
};
o.whenReady().then(() => {
  t();
});
o.on("window-all-closed", () => {
  process.platform !== "darwin" && o.quit();
});
