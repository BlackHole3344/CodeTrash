"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_telegram_bot_api_1 = __importDefault(require("node-telegram-bot-api"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
// import all the enviroment variables 
dotenv_1.default.config();
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatid = process.env.TELEGRAM_CHAT_ID;
if (!token || !chatid) {
    throw new Error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in environment variables");
}
// app , middleware setup 
const app = (0, express_1.default)();
app.use(express_1.default.json());
//instance of telegram bot  , act as client 
const bot = new node_telegram_bot_api_1.default(token, { polling: true });
// server side logic for handelling the telegram bot 
// listening for document 
bot.on('document', (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const document = msg.document;
    console.log("doc recieved");
    if (document) {
        const fileId = document.file_id;
        try {
            yield bot.sendDocument(chatid, fileId);
            console.log("File Forwarded Successfully");
        }
        catch (error) {
            console.error('Error Forwarding File', error);
        }
    }
}));
bot.on("text", (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const chatId = msg.chat.id;
    const messsage = msg.text;
    if (messsage) {
        try {
            yield bot.sendMessage(chatId, messsage);
            console.log("text sent");
        }
        catch (error) {
            console.error("Error while sending msg : ", error);
        }
    }
}));
app.get('/', (req, res) => {
    res.send('Telegram Bot Server is running!');
});
app.get('/status', (req, res) => {
    res.json({ status: 'active', botUsername: bot.getMe().then(me => me.username) });
});
app.post('/send-message', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    if (!message) {
        console.log("error message ");
        return res.status(400).json({ error: 'Message is required' });
    }
    try {
        yield bot.sendMessage(chatid, message);
        res.json({ success: true, message: 'Message sent successfully' });
    }
    catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
}));
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
