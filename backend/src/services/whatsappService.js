const puppeteer = require("puppeteer");

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const sendMessage = async (contacts) => {
    // Validate contacts input
    if (!contacts || !Array.isArray(contacts)) {
        throw new Error("Invalid contacts format. Must be an array.");
    }

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--single-process'
        ],
        // Try these common Chrome paths in order
        executablePath: [
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',  
            puppeteer.executablePath()     
        ].find(path => require('fs').existsSync(path)),
        userDataDir: "./whatsapp-session",
        defaultViewport: null
    });

    const page = await browser.newPage();

    console.log("Opening WhatsApp Web...");
    try {
        await page.goto("https://web.whatsapp.com", {
            waitUntil: 'networkidle2',
            timeout: 60000
        });

        await page.waitForSelector("#side", { timeout: 60000 });
        console.log("WhatsApp Web Loaded.");
    } catch (err) {
        console.error("Failed to load WhatsApp Web:", err.message);
        await browser.close();
        return { 
            sent: [], 
            failed: contacts.map(c => ({ 
                number: c.number, 
                error: "WhatsApp Web loading failed" 
            }))
        };
    }

    await delay(10000);

    let successList = [];
    let failedList = [];

    for (let contact of contacts) {
        if (!contact.number || !contact.message) {
            failedList.push({ 
                number: contact.number || 'undefined', 
                error: "Missing number or message" 
            });
            continue;
        }

        console.log(`\nProcessing contact: ${contact.number}`);

        try {
            const whatsappURL = `https://web.whatsapp.com/send?phone=${contact.number}`;
            await page.goto(whatsappURL, {
                waitUntil: 'networkidle2',
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

            // Wait for message input box
            await page.waitForSelector("footer div[contenteditable='true']", { 
                visible: true, 
                timeout: 40000 
            });

            const inputBox = await page.$("footer div[contenteditable='true']");
            if (!inputBox) throw new Error("Message input box not found");

            await inputBox.focus();
            await delay(500);

            // Clear existing text if any
            await page.evaluate(() => {
                const input = document.querySelector("footer div[contenteditable='true']");
                if (input) input.innerHTML = "";
            });

            await page.keyboard.type(contact.message);
            await delay(500);

            await page.keyboard.press("Enter");
            await delay(3000);

            // Verify message was sent
            const messageSent = await page.evaluate(() => {
                const messages = document.querySelectorAll("div.message-out");
                return messages.length > 0 && 
                       messages[messages.length - 1].querySelector('[data-icon="msg-time"]') === null;
            });

            if (messageSent) {
                console.log(`Message successfully sent to ${contact.number}`);
                successList.push({ number: contact.number });
            } else {
                throw new Error("Message was typed but not sent (clock icon still visible)");
            }

        } catch (error) {
            console.error(`Failed to send to ${contact.number}:`, error.message);
            failedList.push({ 
                number: contact.number, 
                error: error.message 
            });
            
            // Take screenshot for debugging
            await page.screenshot({ 
                path: `error_${Date.now()}.png`,
                fullPage: true 
            });
        }

        await delay(5000);
    }

    console.log("\nMessaging process completed!");
    console.log(`Sent: ${successList.length}, Failed: ${failedList.length}`);

    await browser.close();
    return { 
        sent: successList, 
        failed: failedList 
    };
};

module.exports = { sendMessage };