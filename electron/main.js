const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';
let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true,
  });

  // In development, connect to React dev server
  if (isDev) {
    mainWindow.loadURL('http://localhost:3000');
    // Open the DevTools automatically if in development mode
    mainWindow.webContents.openDevTools();
  } else {
    // In production, load from Express static files
    mainWindow.loadURL('http://localhost:5000');
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Initialize app
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Handle automatic backups
app.on('before-quit', async () => {
  const { createBackup } = require('../server/src/config/database');

  try {
    await createBackup();
    console.log(`Backup created`);
  } catch (error) {
    console.error('Backup failed:', error);
  }
});