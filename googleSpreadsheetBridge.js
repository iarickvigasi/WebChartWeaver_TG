import { GoogleSpreadsheet } from 'google-spreadsheet'
// Service account credentials
// Link with more details: https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account
let credentials = process.env.GOOGLE_CREDENTIALS ? JSON.parse(process.env.GOOGLE_CREDENTIALS) : null;
import creds from './creds.json' assert { type: 'json' }
credentials = credentials || creds

// The ID of the Google Sheet
// You can get it from the URL of the sheet
// https://docs.google.com/spreadsheets/d/<this part>/edit#gid=0
// The ID is the <this part>
const DEFAULT_SHEET_ID = "1DoUOOhsTxhyz90z9TVMIaRakjdUwOLXKpf6nIMlMFPc"
const SHEET_ID = process.env.SHEET_ID || DEFAULT_SHEET_ID

// Load the sheet
// sheetId is the ID of the sheet, by default it is process.env.SHEET_ID
// creds is the credentials of the service account, by default it is the ./creds.json file
const loadDoc = async (sheetId = SHEET_ID, creds = credentials) => {
    const doc = new GoogleSpreadsheet(SHEET_ID)
    await doc.useServiceAccountAuth(creds)
    await doc.loadInfo() // loads document properties and worksheets
    return doc
}

// Laod the sheet from the doc by the sheet index
// sheetIndex is the index of the sheet in the doc, by default it is 0
const loadSheet = async (doc, sheetIndex = 0) => {
    const sheet = doc.sheetsByIndex[0]
    return sheet
}

// Loads all cells in the sheet
// and returns cells by rawIndex
// the range is specified by from and to
// by default it from 0, to is 35
const getCells = async (sheet, rawIndex = 0, from = 0, to = 34) => {
    // loads all cells
    await sheet.loadCells()

    const cellsValues = [];
    for (let i = from; i < to; i++) {
        // get the cell by the rawIndex and the column index
        const cell = sheet.getCell(rawIndex, i)
        cellsValues.push(cell.value)
    }

    return cellsValues
}

// Loads cells pairs in the sheet
const getCellsPairs = async (sheet, rawIndex = 1, from = 0, to = 34) => {
    // loads all cells
    await sheet.loadCells()
    const headers = await getCells(sheet, 0, from, to)
    const cellsValues = [];
    for (let i = from; i < to; i++) {
        // get the cell by the rawIndex and the column index
        const cell = sheet.getCell(rawIndex, i)
        cellsValues.push({ header: headers[i], value: cell.value })чц
    }
    console.log(cellsValues)
    return cellsValues
}

const formatDateTime = (timestamp) => {
    let dateTime = new Date(timestamp);
    return dateTime.toTimeString();
}

const init = async () => {
    const doc = await loadDoc()
    const sheet = await loadSheet(doc)
    return {doc, sheet}
}

export {
    init,
    loadDoc,
    loadSheet,
    getCells,
    getCellsPairs,
    formatDateTime
}


