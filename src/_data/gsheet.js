/*

First pass at plugging Google Sheets into Eleventy as data store

Uses d3-fetch + node-fetch + Google Sheets JSON feed

Depends on feed syntax for Google API v3 which still works, JSON public feed
feature might disappear at some point

https://developers.google.com/sheets/api/guides/migration?hl=en#authorizing_requests

*/

const d3 = require('d3-fetch');
global.fetch = require("node-fetch");
// const gsheetID = '1kxLlpseZGuB2isJuVKT8GrwlRiLhVwGhUKHr2OczaLw';
const gsheetID = '1aoNnLeoDj50fbaQY27JJdApW8HSoSRRCF3bHh2xR8uE';
const gsheetSheetNum = '2';

function parseGoogleSheetsJSONFeed(data) {
    const sheet = {};

    sheet.dims = [
      Number(data.feed.gs$colCount.$t),
      Number(data.feed.gs$rowCount.$t)
    ];
    
    sheet.rows = data.feed.entry;
    sheet.headers = []
    for (let i = 0; i < sheet.dims[0]; i++) {
        sheet.headers.push(sheet.rows.shift().content.$t);
    }

    let rows = [];

    for (let i = 2; i <= sheet.dims[1]; i++) {
        let row = {};
        let cells = sheet.rows
                        .filter(d => d.gs$cell.row == i)
                        .map(d => d.gs$cell);

        sheet.headers.forEach( (d,i) => {
            row[sheet.headers[i]] = cells
                                            .filter(d => Number(d.col) == i + 1)
                                            .map(d => d.$t)[0]
        })

        row['id'] = String(i+1).padStart(3,'000');
        row['Photos'] = row['Photos'].split(',')
            .map( d => d.trim().replace(/[ \(\)]/g, '-'))
            .map( d => d.replace(/-\./g, ''))
            .map( d => d.slice(0,-3) + 'jpg');
        
        rows.push(row);
    }

    return rows;
}

module.exports = async function() {
    const googleSheetsURL = `https://spreadsheets.google.com/feeds/cells/${gsheetID}/${gsheetSheetNum}/public/full?alt=json`;
    let data = await d3.json(googleSheetsURL);

    return parseGoogleSheetsJSONFeed(data);
}