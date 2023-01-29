# WebChartWeaver_TG
Telegram spider bot that weaves for you web chart. 
Or in common language gives you an image of radar chart based on the data provided.

## How to use
1. Create a Telegram bot using [BotFather](https://t.me/BotFather)
2. Create a Google sheet with data to parse and draw chart
3. Create a Google service account and get credentials
4. Add creds.json with Google service account details to the root of the project
5. Deploy this bot to Heroku or whatever you want
6. Set environment variables
7. Send `/start` to your bot
8. Then you can type Павутинка 10, де 10 - номер рядка в таблиці

### Environment variables
* `TELEGRAM_TOKEN` - Telegram bot token
* `SHEET_ID` - Google sheet id with data to parse and draw chart

