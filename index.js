import { Telegraf } from 'telegraf'

import { init, getCellsPairs, formatDateTime } from "./googleSpreadsheetBridge.js";
import { calculateSoftSkillsTest } from "./softSkillsTestCalculator.js";
import { weaveRadarChart, weaveDoubleRadarChart } from "./webChartDrawer.js";
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
    "Якщо хочете подвійну, то напишіть Павутинка X:Y і я вам намалюю два графіки." +
    "Ви також можете написати в множині, Павутинки 10, 20, 21, -  і я почну обробляти їх усі :) \n" +
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


    const result = calculateSoftSkillsTest(cells);
    const chartBuffer = await weaveRadarChart(result, name);
    ctx.reply("Результати для " + name + "\n" + displayJSON(result));
    ctx.replyWithPhoto({source: chartBuffer});
})

// Павутинки 5:8 or Павутинки 5=8
const doubleRegexp = /Павутинки\s(\d+)\s*:\s*(\d+)/;
bot.hears(doubleRegexp, async (ctx) => {
    const [, num1, num2] = ctx.match;

    if (num1 && num2) {
        let numberArray = [num1, num2];
        ctx.reply("Дивлюся данні по рядкам " + numberArray.join(' і ') + " ...");
        const {doc, sheet} = await init();

        const results = await Promise.all(numberArray.map(async (number) => {
            const rawNumber = parseInt(number, 10);
            const cells = await getCellsPairs(sheet, rawNumber);
            const name = cells[1].value;
            if (!name || name === "") {
                ctx.reply("Вибач, але я не знайшов нікого по рядку: " + rawNumber +" :(");
                return null;
            }
            const result = calculateSoftSkillsTest(cells);
            return [name, result];
        }));

        const nonNullResults = results.filter(result => result !== null);
        if (nonNullResults.length >= 2) {
            const chartBuffer = await weaveDoubleRadarChart(
                nonNullResults[0][1], nonNullResults[0][0],
                nonNullResults[1][1], nonNullResults[1][0]
            );
            ctx.reply("Результати для " + nonNullResults[0][0] + " та " + nonNullResults[1][0]);
            ctx.replyWithPhoto({ source: chartBuffer });
        } else {
            ctx.reply("Для створення спільного зображення потрібно вказати два різних рядка з даними.");
        }
    } else {
        ctx.reply("Ой, шось не зрозумів... ");
    }
});

const chartsRegex = /Павутинки\s([\d,\s]+)/;
// const input = "Павутинка 5, 10 20,30"; // Sample input
bot.hears(chartsRegex, async (ctx) => {
    const matchResult = ctx.match[1];

    if (matchResult) {
        const numberArray = matchResult.split(',').map(Number);
        ctx.reply("Дивлюся данні по рядкам " + numberArray.join(',') + " ...");
        const {doc, sheet} = await init();

        let texts = [];
        let images = [];
        numberArray.map(async (number) => {
            const rawNumber = parseInt(number, 10);
            const cells = await getCellsPairs(sheet, rawNumber);
            const name = cells[1].value;
            if (!name || name === "") {
                ctx.reply("Вибач, але я не знайшов нікого по рядку: " + rawNumber +" :(");
                return null;
            }
            const result = calculateSoftSkillsTest(cells);
            const chartBuffer = await weaveRadarChart(result, name);
            ctx.reply("Результати для " + name + "\n" + displayJSON(result));
            ctx.replyWithPhoto({source: chartBuffer});
        })
    } else {
        ctx.reply("Ой, шось не зрозумів... ");
    }

})
bot.hears('hi', (ctx) => ctx.reply('Привіт, привіт!) '));

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