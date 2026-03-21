const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
// const pdfParse = require('pdf-parse');
// const { PDFParse } = require('pdf-parse');
const { optimizeResume, generateCoverLetter, optimizeLinkedinProfile } = require('../utils/aiOptimizer');

const router = express.Router();

const uploader = multer({ dest: 'uploads/' });

// const upload = multer({
//   dest: 'uploads/',
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
// });

// Use memory storage instead of disk (Vercel-compatible)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


// server.js (or routes/static.js)

router.post('/optimize', upload.single('resume'), async (req, res) => {
  try {
    let resumeText = '';

    if (req.file) {
      const filePath = req.file.path;
      const buffer = fs.readFileSync(filePath);
      
      if (req.file.originalname.toLowerCase().endsWith('.pdf')) {
        // const data = await pdfParse(buffer);

        // const parser = new PDFParse({ url: 'https://bitcoin.org/bitcoin.pdf' });

        // const parser = new PDFParse({ url: filePath });

        // const parser = new PDFParse({});              // ← create instance
        // const data = await parser.load(buffer);     // or parser.load({ data: buffer })
        // const data = await parser.getText();
        // const data = await parser.load({ data: buffer });
        // resumeText = data.text;


        // const { PDFParse } = require('pdf-parse');

        // const parser = new PDFParse({});                    // empty options is fine
        // const result = await parser.load({ data: buffer });  // returns the parser itself

        // Now extract text (getText() returns a promise with { text })
        // const textResult = await parser.getText();
        // resumeText = textResult.text;

        const data = await pdf(buffer);  // ← simple v1 call
        resumeText = data.text;
      } else {
        resumeText = buffer.toString('utf8');
      }
      fs.unlinkSync(filePath); // clean up
    } else {
      resumeText = req.body.jobDesc ? "No resume uploaded" : "";
    }

    const jobDesc = req.body.jobDesc || "";
    const result = await optimizeResume(resumeText, jobDesc);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Optimization failed' });
  }
});

router.post('/generate-cover', upload.single('resume'), async (req, res) => {
  try {
    let resumeText = ''; // Reuse same parsing logic as /optimize
    if (req.file) {
      const filePath = req.file.path;
      const buffer = fs.readFileSync(filePath);
      if (req.file.originalname.toLowerCase().endsWith('.pdf')) {
        const data = await pdf(buffer);
        resumeText = data.text;
      } else {
        resumeText = buffer.toString('utf8');
      }
      fs.unlinkSync(filePath);
    }

    const jobDesc = req.body.jobDesc || "";
    const tone = req.body.tone || "professional";
    const length = req.body.length || "medium";

    const coverLetter = await generateCoverLetter(resumeText, jobDesc, tone, length);

    res.json({ cover_letter: coverLetter });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Cover letter generation failed' });
  }
});

router.post('/optimize-linkedin', async (req, res) => {
  try {
    const { headline = '', about = '', experience = '', skills = '', jobDesc = '' } = req.body;

    const profileText = `
Headline: ${headline}
About: ${about}
Experience: ${experience}
Skills: ${skills}
    `.trim();

    const result = await optimizeLinkedinProfile(profileText, jobDesc);

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'LinkedIn optimization failed' });
  }
});

module.exports = router;