const puppeteer = require("puppeteer");

const sendMessage = async (contacts) => {
    const browser = await puppeteer.launch({ 
        headless: false, 
        userDataDir: "./whatsapp-session" 
    });
    const page = await browser.newPage();

    console.log("Opening WhatsApp Web...");
    await page.goto("https://web.whatsapp.com");

    await page.waitForSelector("#side", { timeout: 60000 });
    console.log("✅ WhatsApp Web Loaded.");

    await new Promise(resolve => setTimeout(resolve, 10000));

    let successList = [];
    let failedList = [];

    for (let contact of contacts) {
        const whatsappURL = `https://web.whatsapp.com/send?phone=${contact.number}&text=${encodeURIComponent(contact.message)}`;
        await page.goto(whatsappURL);

        try {
            await page.waitForSelector('div[contenteditable="true"]', { timeout: 20000 });

            const inputBox = await page.$('div[contenteditable="true"]');
            if (!inputBox) throw new Error("Message input box not found");

            await inputBox.click();
            await new Promise(resolve => setTimeout(resolve, 3000));

            const sendButton = await page.waitForSelector("span[data-icon='send']", { timeout: 2000 });
            if (sendButton) {
                await sendButton.click();
                console.log(`📤 Sending message to ${contact.number}...`);
            } else {
                throw new Error("Send button not found");
            }

            // Wait for the message to appear in the chat
            const messageSent = await page.waitForFunction(() => {
                let messages = document.querySelectorAll("div.message-out"); // Sent messages
                return messages.length > 0 && messages[messages.length - 1].innerText.trim().length > 0;
            }, { timeout: 7000 }).catch(() => false);

            if (messageSent) {
                console.log(`✅ Message successfully sent to ${contact.number}`);
                successList.push({ number: contact.number });
            } else {
                throw new Error("Message stuck in buffer");
            }

        } catch (error) {
            console.error(`❌ Failed to send message to ${contact.number}`);
            failedList.push({ number: contact.number });
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log("✅ Messaging process completed!");

    setTimeout(() => {
        browser.close();
    }, 5000);

    return { sent: successList, failed: failedList };
};

module.exports = { sendMessage };
