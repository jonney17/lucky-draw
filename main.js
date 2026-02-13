import { app, BrowserWindow } from 'electron'
import path from 'path'
import { fileURLToPath } from 'url'
import os from 'os'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Set user data directory to avoid permission issues
const userDataPath = path.join(os.homedir(), '.luxedraw-ai-2026')
app.setPath('userData', userDataPath)

// Disable disk cache to avoid permission errors
app.commandLine.appendSwitch('disable-gpu-cache')
app.commandLine.appendSwitch('disable-component-cache')

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      cache: false,
    }
  })

  const isDev = process.argv.includes('--dev') || process.env.ELECTRON_START_URL !== undefined
  
  // Open devtools only in development
  if (isDev) {
    win.webContents.openDevTools()
  }

  if (isDev) {
    // In development, load from the Vite dev server
    win.loadURL('http://localhost:5173').catch(() => {
      console.error('Failed to load development server')
      // Retry after a short delay
      setTimeout(() => {
        win.loadURL('http://localhost:5173').catch((err) => {
          console.error('Failed to load development server after retry:', err)
        })
      }, 2000)
    })
  } else {
    // In production, load from the built files using file:// protocol
    const filePath = path.join(__dirname, 'dist', 'index.html')
    const fileUrl = new URL(`file://${filePath.replace(/\\/g, '/')}`).href
    console.log('Loading file from:', fileUrl)
    win.loadURL(fileUrl).catch((err) => {
      console.error('Failed to load file:', err)
    })
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
