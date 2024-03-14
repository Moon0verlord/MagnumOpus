import { app, BrowserWindow, Notification } from 'electron'
const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800
    })
    win.loadURL("http://localhost:3000");
}
app.whenReady().then(() => {
    createWindow();

});
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
});