import TelegramBot from "node-telegram-bot-api";
import express from "express";
import dotenv from "dotenv";


// import all the enviroment variables 
dotenv.config(); 



const token = process.env.TELEGRAM_BOT_TOKEN;
const chatid = process.env.TELEGRAM_CHAT_ID;


if (!token || !chatid) {
  throw new Error("TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set in environment variables");
}
// app , middleware setup 
const app = express();
app.use(express.json());

//instance of telegram bot  , act as client 
const bot = new TelegramBot(token, { polling: true });


// server side logic for handelling the telegram bot 

// listening for document 
bot.on('document', async (msg: TelegramBot.Message) => {
  const document = msg.document;
  console.log("doc recieved")
  if (document) { 
    const fileId = document.file_id;
    try {
      await bot.sendDocument(chatid, fileId);
      console.log("File Forwarded Successfully");
    } catch (error) {
      console.error('Error Forwarding File', error);
    }
  }
});

bot.on("text", async (msg) => {
  const chatId = msg.chat.id;
  const messsage = msg.text ; 
  if(messsage) {
    try { 
      await bot.sendMessage(chatId , messsage)
      console.log("text sent")
    } catch(error) {
      console.error("Error while sending msg : " , error)
    }
  }
});


app.get('/', (req, res) => {
  res.send('Telegram Bot Server is running!');
});


app.get('/status', (req, res) => {
  res.json({ status: 'active', botUsername: bot.getMe().then(me => me.username) });
});


app.post('/send-message', async (req, res) => {
  const { message }   = req.body;
  if (!message) {
    console.log("error message ")
    return res.status(400).json({ error: 'Message is required' });
  }
  try {
    await bot.sendMessage(chatid, message);
    res.json({ success: true, message: 'Message sent successfully' });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});


app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});