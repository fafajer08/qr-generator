import express from 'express';
import cors from 'cors';
import fs from 'fs';
import qr from 'qr-image';
import multer from 'multer';
import { URL } from 'url';

const app = express();
const port = 5000;
const qrFolder = './qr_codes';

// Middleware
app.use(cors());
app.use(express.json());

// Ensure folder exists
if (!fs.existsSync(qrFolder)) {
  fs.mkdirSync(qrFolder);
}

// Route to generate QR code
app.post('/generate-qr', (req, res) => {
  let { url } = req.body;

  // Ensure the URL includes 'https://'
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  try {
    const parsedUrl = new URL(url);
    const fileName = parsedUrl.hostname.split('.').shift(); // Extract domain name
    const qrPath = `${qrFolder}/${fileName}_qr.png`;

    // Generate QR code
    const qr_svg = qr.image(url, { type: 'png' });
    qr_svg.pipe(fs.createWriteStream(qrPath));

    // Append URL to file
    fs.appendFileSync('URL.txt', `${url}\n`, 'utf8');

    res.json({ success: true, qrPath: `http://localhost:${port}/qr_codes/${fileName}_qr.png` });

  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid URL' });
  }
});

// Serve QR code images
app.use('/qr_codes', express.static(qrFolder));

// Start server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
