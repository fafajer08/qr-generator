import inquirer from 'inquirer';
import qr from 'qr-image';
import fs from 'fs';
import { URL } from 'url';

// Define the folder where QR images will be stored
const qrFolder = './generated-qr';

// Ensure the folder exists, create it if not
if (!fs.existsSync(qrFolder)) {
  fs.mkdirSync(qrFolder);
}

inquirer
  .prompt([
    {
      message: "Type in your URL:",
      name: "URL",
    }
  ])
  .then((answers) => {
    let url = answers.URL.trim(); // Remove spaces

    // Automatically add 'https://' if missing
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }

    try {
      const parsedUrl = new URL(url);
      const fileName = parsedUrl.hostname.split('.').shift(); // Extract first part of hostname

      // Path where the QR code will be saved
      const qrPath = `${qrFolder}/${fileName}_qr.png`;

      // Generate QR code and save it in the folder
      const qr_svg = qr.image(url);
      qr_svg.pipe(fs.createWriteStream(qrPath));

      // Save URL to a text file, ensuring a new line for each entry
      fs.appendFileSync('URL.txt', `${url}\n`, 'utf8');
      console.log(`✅ QR Code saved in ${qrPath} and URL added to URLs.txt.`);

    } catch (error) {
      console.log("❌ Invalid URL. Please enter a valid one.");
    }
  })
  .catch((error) => {
    if (error.isTtyError) {
      console.log("❌ Prompt couldn't be rendered in this environment.");
    } else {
      console.log("❌ An error occurred:", error);
    }
  });
