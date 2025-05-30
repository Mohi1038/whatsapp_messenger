const puppeteer = require('puppeteer-core');
const chromium = require('@sparticuz/chromium'); 
const path = require('path');
const fs = require('fs');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Detect production environment
const isProduction = process.env.NODE_ENV === 'production';

const sendMessage = async (contacts) => {
    // Validate contacts input
    if (!contacts || !Array.isArray(contacts)) {
        throw new Error("Invalid contacts format. Must be an array.");
    }

    const sessionDir = path.join(__dirname, '../whatsapp-session');
    
    // Ensure session directory exists
    if (!fs.existsSync(sessionDir)) {
        fs.mkdirSync(sessionDir, { recursive: true });
    }

    const browser = await puppeteer.launch({
        headless: isProduction ? 'new' : false,
        userDataDir: sessionDir,
        args: [
          ...chromium.args,
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--disable-gpu'
        ],
        executablePath: isProduction
          ? await chromium.executablePath()
          : puppeteer.executablePath(),
        defaultViewport: null,
      });

    const page = await browser.newPage();

    console.log("Opening WhatsApp Web...");
    try {
        await page.goto("https://web.whatsapp.com", {
            waitUntil: 'domcontentloaded',
            timeout: 0 // Disable timeout for initial load
        });

        await page.waitForSelector("#side", { 
            timeout: 120000, // 2 minutes timeout
            visible: true 
        });
        console.log("WhatsApp Web Loaded.");
    } catch (err) {
        console.error("Failed to load WhatsApp Web:", err.message);
        await page.screenshot({ path: 'whatsapp-load-error.png' });
        await browser.close();
        return { 
            sent: [], 
            failed: contacts.map(c => ({ 
                number: c.number, 
                error: "WhatsApp Web loading failed" 
            }))
        };
    }

    await delay(10000); // Additional settling time

    const results = await processContacts(page, contacts);
    await browser.close();
    
    return results;
};

async function processContacts(page, contacts) {
    let successList = [];
    let failedList = [];

    for (const contact of contacts) {
        if (!contact.number || !contact.message) {
            failedList.push({ 
                number: contact.number || 'undefined', 
                error: "Missing number or message" 
            });
            continue;
        }

        console.log(`Processing contact: ${contact.number}`);

        try {
            const whatsappURL = `https://web.whatsapp.com/send?phone=${contact.number}`;
            await page.goto(whatsappURL, {
                waitUntil: 'domcontentloaded',
                timeout: 60000
            });
            
            await delay(5000);

            // Check for invalid number dialog
            const dialog = await page.$("div[role='dialog']");
            if (dialog) {
                const errorMsg = await page.evaluate(el => el.textContent, dialog);
                console.error(`Invalid number for ${contact.number}:`, errorMsg);
                failedList.push({ 
                    number: contact.number, 
                    error: errorMsg 
                });
                continue;
            }

            // Wait for message input
            await page.waitForSelector("footer div[contenteditable='true']", { 
                visible: true, 
                timeout: 40000 
            });

            await page.evaluate(() => {
                const input = document.querySelector("footer div[contenteditable='true']");
                if (input) input.innerHTML = "";
            });

            await page.keyboard.type(contact.message);
            await delay(500);
            await page.keyboard.press("Enter");
            await delay(3000);

            // Verify message sent
            const messageSent = await page.evaluate(() => {
                const messages = document.querySelectorAll("div.message-out");
                return messages.length > 0 && 
                       messages[messages.length - 1].querySelector('[data-icon="msg-time"]') === null;
            });

            if (messageSent) {
                successList.push({ number: contact.number });
            } else {
                throw new Error("Message not confirmed as sent");
            }

        } catch (error) {
            console.error(`Failed to send to ${contact.number}:`, error.message);
            failedList.push({ 
                number: contact.number, 
                error: error.message 
            });
            await page.screenshot({ path: `error_${contact.number}.png` });
        }

        await delay(5000); 
    }

    console.log(`Completed: ${successList.length} sent, ${failedList.length} failed`);
    return { sent: successList, failed: failedList };
}

module.exports = { sendMessage };