const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

exports.createPage = (req, res) => {
  const fileName = req.body.filename;
  const fileContent = req.file.buffer;
  // Replace 'BUCKET_NAME' with the name of your Google Cloud Storage bucket's name !! Make sure permissions are given accordingly !!
  const bucketName = 'BUCKET_NAME';
  const fileExtension = '.html';
  const filePath = fileName + fileExtension;

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(filePath);

  const stream = file.createWriteStream({
    metadata: {
      contentType: 'text/html',
    },
  });

  stream.on('error', (err) => {
    console.error(err);
    res.status(500).send('Error uploading file');
  });

  stream.on('finish', () => {
    console.log(`File ${filePath} uploaded.`);

    // Respond to the HTTP request with the URL to the newly created page
    const url = `https://storage.googleapis.com/${bucketName}/${filePath}`;
    res.status(200).send(`Page created: ${url}`);
  });

  stream.end(fileContent);
};
