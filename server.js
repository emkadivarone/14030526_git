const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

app.post('/save-coordinates', (req, res) => {
  const coordinates = req.body;

  const params = {
    Bucket: 'your-bucket-name',
    Key: 'a.xlsx',
    Body: JSON.stringify(coordinates), // تغییر به مناسب برای ذخیره‌سازی فایل Excel
    ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  s3.upload(params, (err, data) => {
    if (err) {
      console.error('Error uploading data: ', err);
      res.status(500).send('Error saving file.');
    } else {
      res.send('File uploaded successfully.');
    }
  });
});
