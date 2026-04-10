import express from 'express';
import cors from 'cors';
import TelegramBot from 'node-telegram-bot-api';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';

// The bot token provided by the user
const token = process.env.TELEGRAM_BOT_TOKEN || '8186267782:AAEjm55LGfYpltWIT07CwLPm6RNimNPi2H0';
const bot = new TelegramBot(token, { polling: true });

const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = path.join(process.cwd(), 'data.json');

let db = {
    products: [] as any[],
    adminChatId: null as number | null,
    videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4" as string | null
};

if (fs.existsSync(DATA_FILE)) {
    try {
        db = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    } catch (e) {
        console.error("Error reading data.json", e);
    }
}

const saveData = () => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
};

// Telegram Bot Handlers
bot.onText(/\/start/, (msg) => {
    db.adminChatId = msg.chat.id;
    saveData();
    bot.sendMessage(msg.chat.id, "✅ *Admin Registered!*\n\nYou will now receive order notifications here.\n\n*Commands:*\n`/add Title | Price | ImageURL | Description` - Add a product\n`/list` - View products\n`/remove ID` - Remove a product\n`/clear` - Remove all products\n`/setvideo VideoURL` - Set landing page video", { parse_mode: 'Markdown' });
});

bot.onText(/\/setvideo (.+)/, (msg, match) => {
    if (msg.chat.id !== db.adminChatId) return;
    const url = match ? match[1].trim() : '';
    db.videoUrl = url;
    saveData();
    bot.sendMessage(msg.chat.id, `✅ Video URL updated successfully!`);
});

bot.onText(/\/add (.+)/, (msg, match) => {
    if (msg.chat.id !== db.adminChatId) {
        return bot.sendMessage(msg.chat.id, "Unauthorized. Send /start first.");
    }
    const input = match ? match[1] : '';
    const parts = input.split('|').map(s => s.trim());
    if (parts.length >= 3) {
        const newProduct = {
            id: Date.now().toString(),
            title: parts[0],
            price: parts[1],
            image: parts[2],
            description: parts[3] || ''
        };
        db.products.push(newProduct);
        saveData();
        bot.sendMessage(msg.chat.id, `✅ Product *${newProduct.title}* added successfully!\nID: ${newProduct.id}`, { parse_mode: 'Markdown' });
    } else {
        bot.sendMessage(msg.chat.id, "❌ *Invalid format.*\nUse:\n`/add Product Name | 1500 | https://image.url/img.jpg | Description`", { parse_mode: 'Markdown' });
    }
});

bot.onText(/\/list/, (msg) => {
    if (msg.chat.id !== db.adminChatId) return;
    if (db.products.length === 0) {
        return bot.sendMessage(msg.chat.id, "No products available.");
    }
    let response = "*Current Products:*\n\n";
    db.products.forEach((p, i) => {
        response += `${i + 1}. *${p.title}* - ৳${p.price}\nID: \`${p.id}\`\n\n`;
    });
    bot.sendMessage(msg.chat.id, response, { parse_mode: 'Markdown' });
});

bot.onText(/\/remove (.+)/, (msg, match) => {
    if (msg.chat.id !== db.adminChatId) return;
    const idToRemove = match ? match[1].trim() : '';
    const initialLength = db.products.length;
    db.products = db.products.filter(p => p.id !== idToRemove);
    if (db.products.length < initialLength) {
        saveData();
        bot.sendMessage(msg.chat.id, `✅ Product removed successfully.`);
    } else {
        bot.sendMessage(msg.chat.id, `❌ Product with ID ${idToRemove} not found.`);
    }
});

bot.onText(/\/clear/, (msg) => {
    if (msg.chat.id !== db.adminChatId) return;
    db.products = [];
    saveData();
    bot.sendMessage(msg.chat.id, "✅ All products cleared.");
});

// API Routes
app.get('/api/products', (req, res) => {
    res.json(db.products);
});

app.get('/api/store-data', (req, res) => {
    res.json({
        products: db.products,
        videoUrl: db.videoUrl
    });
});

app.post('/api/order', (req, res) => {
    const order = req.body;
    if (db.adminChatId) {
        const message = `🚨 *New Order Received!* 🚨\n\n` +
                        `*Customer:* ${order.name}\n` +
                        `*Phone:* ${order.phone}\n` +
                        `*Address:* ${order.address}\n` +
                        `*Area:* ${order.area}\n` +
                        `*Payment Method:* ${order.paymentMethod}\n` +
                        (order.trxId ? `*TrxID:* ${order.trxId}\n` : '') +
                        (order.senderNo ? `*Sender No:* ${order.senderNo}\n\n` : '\n\n') +
                        `*Product:* ${order.productTitle}\n` +
                        `*Price:* ৳${order.productPrice}`;
        bot.sendMessage(db.adminChatId, message, { parse_mode: 'Markdown' });
    }
    res.json({ success: true });
});

async function startServer() {
    // Vite middleware for development
    if (process.env.NODE_ENV !== 'production') {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: 'spa',
        });
        app.use(vite.middlewares);
    } else {
        const distPath = path.join(process.cwd(), 'dist');
        app.use(express.static(distPath));
        app.get('*', (req, res) => {
            res.sendFile(path.join(distPath, 'index.html'));
        });
    }

    app.listen(3000, '0.0.0.0', () => {
        console.log('Server running on port 3000');
    });
}

startServer();
