const fs = require('fs').promises; //using promises version which doesn't require callback
const path = require('path');

async function getImageBase64() {
  try {
    const imagePath = path.join(__dirname, './assets', 'chex-album.png');
    const imageBuffer = await fs.readFile(imagePath);
    return imageBuffer.toString('base64');
  } catch (error) {
    console.error('Error reading image:', error);
    return null;
  }
}

module.exports = { getImageBase64 };