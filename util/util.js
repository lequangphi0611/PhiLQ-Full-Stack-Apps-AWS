import fs from "fs";
import axios from 'axios';
import Jimp from "jimp";


// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
 export async function filterImageFromURL(inputURL) {
  return new Promise(async (resolve, reject) => {
    let photo;

    try {
      const response = await axios.get(inputURL, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data, 'binary');
      photo = await Jimp.read(buffer);
    } catch(err) {
      console.error(`Failed to read the image from URL = "${inputURL}"`)
      reject(err);
      return;
    }

    const outpath= "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";
      
    await photo
        .resize(256, 256) // resize
        .quality(60) // set JPEG quality
        .greyscale() // set greyscale
        .writeAsync(outpath)
        .then(() => resolve(outpath))
        .catch((err) => {
          console.error(`Failed to write the image to "${outpath}"`)
          reject(err);
        });
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
 export function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
