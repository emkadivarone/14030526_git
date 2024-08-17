const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const filePath = path.join(__dirname, 'a.xlsx');

app.use(bodyParser.json());
app.use(express.static(__dirname));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/save-coordinates', (req, res) => {
    const coordinates = req.body;

    if (fs.existsSync(filePath)) {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const ws = workbook.Sheets[sheetName];

        const existingData = XLSX.utils.sheet_to_json(ws);
        const newData = existingData.concat(coordinates);

        const newSheet = XLSX.utils.json_to_sheet(newData);
        workbook.Sheets[sheetName] = newSheet;

        XLSX.writeFile(workbook, filePath);

        res.send('Coordinates saved to Excel file.');
    } else {
        res.status(404).send('Excel file not found.');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
