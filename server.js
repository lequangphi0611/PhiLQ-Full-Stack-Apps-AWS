import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util.js';
import { isBlank } from './util/validates.js';

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());

// Root Endpoint
// Displays a simple message to the user
app.get('/', async (req, res) => {
  res.send('try GET /filteredimage?image_url={{}}');
});

app.get('/filteredimage', async (req, res) => {
  const imageUrl = req.query.imageUrl;

  if (isBlank(imageUrl)) {
    res
      .status(400)
      .send('The `image_url` query parameter must not be null or blank');
    return;
  }

  let filteredImage;

  try {
    filteredImage = await filterImageFromURL(imageUrl);
  } catch (err) {
    console.error(`Failed to filter the image from URL = "${imageUrl}"`);
    console.error(err);
    res.status(500).send(err.message);
    return;
  }

  res.sendFile(filteredImage, async (err) => {
    if (err) {
      console.error(`Failed to send file`);
      console.error(err);
      res.send(500, err.message)
      return;
    }

    try {
      deleteLocalFiles([filteredImage]);
    } catch (err) {
      console.error(`Failed to delete the local image from Path = "${filteredImage}"`);
      console.error(err);
    }
  });
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});

