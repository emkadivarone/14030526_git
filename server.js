const express = require('express');
const bodyParser = require('body-parser');
const AWS = require('aws-sdk');
const XLSX = require('xlsx');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// پیکربندی AWS SDK
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname))); // ارائه فایل‌های استاتیک

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/save-coordinates', (req, res) => {
    const coordinates = req.body;

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(coordinates);
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Coordinates');

    const buffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });

    const params = {
        Bucket: 'your-bucket-name',
        Key: 'a.xlsx',
        Body: buffer,
        ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    };

    s3.upload(params, (err, data) => {
        if (err) {
            console.error('Error uploading data:', err);
            res.status(500).send('Error saving file.');
        } else {
            res.send('File uploaded successfully.');
        }
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
