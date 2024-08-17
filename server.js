const AWS = require('aws-sdk');
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

app.post('/save-coordinates', (req, res) => {
  const coordinates = req.body;

  const uploadParams = {
    Bucket: 'your-bucket-name',
    Key: 'a.xlsx',
    Body: JSON.stringify(coordinates),
    ContentType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };

  s3.upload(uploadParams, (err, data) => {
    if (err) {
      console.error('Error uploading data: ', err);
      res.status(500).send('Error saving file.');
    } else {
      res.send('File uploaded successfully.');
    }
  });
});
