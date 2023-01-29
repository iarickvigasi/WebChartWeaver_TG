# WebChartWeaver_TG
Telegram spider bot that weaves for you web chart. 
Or in common language gives you an image of radar chart based on the data provided.

### How to use
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
* `GOOGLE_CREDENTIALS` - Google service account credentials in JSON format, if not provided, creds.json will be used


### How to create Google service account
1. Go to [Google API Console](https://console.developers.google.com/)
2. Create a new project
3. Enable Google Sheets API
4. Create a service account
5. Create a key for the service account
6. Download the key
7. Add the key to the root of the project and rename it to creds.json or set GOOGLE_CREDENTIALS environment variable


### Happy charting ^v^!