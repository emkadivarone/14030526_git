const express = require('express');
const bodyParser = require('body-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;
const filePath = path.join(__dirname, 'a.xlsx');

// Middleware
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Serve the HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POST request to /calculate
app.post('/calculate', (req, res) => {
    const { number1, number2, sum } = req.body;

    // Check if the Excel file exists
    if (fs.existsSync(filePath)) {
        const workbook = XLSX.readFile(filePath);
        const sheetName = workbook.SheetNames[0];
        const ws = workbook.Sheets[sheetName];

        // Read existing data and add new data
        const existingData = XLSX.utils.sheet_to_json(ws);
        const newData = existingData.concat([{ number1, number2, sum }]);

        // Write to the Excel file
        const newSheet = XLSX.utils.json_to_sheet(newData);
        workbook.Sheets[sheetName] = newSheet;
        XLSX.writeFile(workbook, filePath);
    } else {
        // Create a new Excel file with headers if not exists
        const newWorkbook = XLSX.utils.book_new();
        const newData = [{ number1, number2, sum }];
        const newSheet = XLSX.utils.json_to_sheet(newData);
        XLSX.utils.book_append_sheet(newWorkbook, newSheet);
        XLSX.writeFile(newWorkbook, filePath);
    }

    res.send('Data saved to Excel file.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
