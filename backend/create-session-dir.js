const fs = require('fs');
const path = require('path');

const sessionDir = path.join(__dirname, 'whatsapp-session');

try {
  if (!fs.existsSync(sessionDir)) {
    fs.mkdirSync(sessionDir, { recursive: true });
    console.log('Created whatsapp-session directory');
  }
  
  // Set directory permissions (works on Unix systems, ignored on Windows)
  if (process.platform !== 'win32') {
    fs.chmodSync(sessionDir, 0o777);
  }
} catch (err) {
  console.error('Error creating session directory:', err);
  process.exit(1);
}