import { Telegraf } from 'telegraf'

import { init, getCellsPairs, formatDateTime } from "./googleSpreadsheetBridge.js";
import { calculateSoftSkillsTest } from "./softSkillsTestCalculator.js";
import { weaveRadarChart } from "./webChartDrawer.js";
import { displayJSON } from "./utils.js";

// Assigning the token to a variable
// You can get a new token by talking to @BotFather in Telegram
// To assign the token to an env variable
// use google to find out how to do it on your environment
const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;

const WEBHOOK_DOMAIN = process.env.WEBHOOK_DOMAIN;
const PORT = process.env.PORT;

const bot = new Telegraf(TELEGRAM_TOKEN)

const startMessage = "Вітаю! Я бот який плете цифрові павутинки! Якщо ви хочете побачити павутинку, напиши мені Павутинка 10, де 10 - номер рядка в таблиці"
bot.start((ctx) => ctx.reply(startMessage))

const helpMessage = "Якщо ви хочете побачити павутинку, напиши мені Павутинка 10, де 10 - номер рядка в таблиці.\n" +
    "Якщо ви хочете побачити відповіді на тест, напиши мені Відповіді 10, де 10 - номер рядка в таблиці"
bot.help((ctx) => ctx.reply(helpMessage))

const answersRegex = /^Відповіді\s(\d+)/;
bot.hears(answersRegex, async (ctx) => {
    const rawNumber = ctx.match[1];

    ctx.reply("Завантажую відповіді для рядку " + rawNumber + " ...");

    const {doc, sheet} = await init();

    const cells = await getCellsPairs(sheet, rawNumber);

    cells[0].value = formatDateTime(cells[0].value);

    ctx.reply(cells.map(cell => cell.header + ": " + cell.value).join("\n"));
})

const chartRegex = /^Павутинка\s(\d+)/i;
bot.hears(chartRegex, async (ctx) => {
    const rawNumber = ctx.match[1];
    ctx.reply("Дивлюся данні по рядку " + rawNumber + " ...");

    const {doc, sheet} = await init();
    const cells = await getCellsPairs(sheet, rawNumber);

    const name = cells[1].value;
    if (!name || name === "") {
        ctx.reply("Вибач, але я не знайшов нікого по цьому рядку :(");
        return;
    }

    ctx.reply("Ага, це в нас " + name + " ...");

    const result = calculateSoftSkillsTest(cells);
    ctx.reply("Так... ось результати \n" + displayJSON(result));

    ctx.reply("Плету павутинку...");

    const chartBuffer = await weaveRadarChart(result, name);
    ctx.replyWithPhoto({source: chartBuffer});

    ctx.reply("Будь ласка <3");
})

bot.hears('hi', (ctx) => ctx.reply('Hey there'));

if (WEBHOOK_DOMAIN && PORT) {
    console.log('Starting in webhook mode')
    console.log('WEBHOOK_DOMAIN: ' + WEBHOOK_DOMAIN)
    console.log('PORT: ' + PORT)
    bot.launch({
        webhook: {
            domain: WEBHOOK_DOMAIN,
            port: PORT,
        }
    });
} else {
    bot.launch();
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));