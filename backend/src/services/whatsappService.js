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

    for (let contact of contacts) {
        const whatsappURL = `https://web.whatsapp.com/send?phone=${contact.number}&text=${encodeURIComponent(contact.message)}`;
        await page.goto(whatsappURL);

        try {
            await page.waitForSelector('div[contenteditable="true"]', { timeout: 20000 });

            const inputBox = await page.$('div[contenteditable="true"]');
            if (!inputBox) throw new Error("Message input box not found");

            await inputBox.click();
            await new Promise(resolve => setTimeout(resolve, 1000));

            const sendButton = await page.waitForSelector("span[data-icon='send']", { timeout: 5000 });
            if (sendButton) {
                await sendButton.click();
                console.log(`✅ Message sent to ${contact.number}`);
            } else {
                throw new Error("Send button not found");
            }
        } catch (error) {
            console.error(`❌ Failed to send message to ${contact.number}`);
            console.error(error);
        }

        await new Promise(resolve => setTimeout(resolve, 5000));
    }

    console.log("✅ All messages sent!");
    setTimeout(() => {
        browser.close();
    }, 5000);
};

module.exports = { sendMessage };
