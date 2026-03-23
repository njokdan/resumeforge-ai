const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-parse');
// const pdfParse = require('pdf-parse');
// const { PDFParse } = require('pdf-parse');
const { optimizeResume, generateCoverLetter, optimizeLinkedinProfile } = require('../utils/aiOptimizer');

const router = express.Router();

//const uploader = multer({ dest: 'uploads/' });

// const upload = multer({
//   dest: 'uploads/',
//   limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
// });

// Use MEMORY storage – no disk writes, perfect for Vercel
const upload = multer({
  storage: multer.memoryStorage(),  // ← key change
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
});

// Use memory storage instead of disk (Vercel-compatible)
// const storage = multer.memoryStorage();
// const upload = multer({ storage: storage });


// server.js (or routes/static.js)

router.post('/optimize', upload.single('resume'), async (req, res) => {
  let filePath = null;

  try {
    let resumeText = '';

    if (req.file) {
      filePath = req.file.path;
      const buffer = fs.readFileSync(filePath);

      if (req.file.originalname.toLowerCase().endsWith('.pdf')) {
        // v1.1.1 style – direct call
        const data = await require('pdf-parse')(buffer);
        resumeText = data.text;
      } else {
        resumeText = buffer.toString('utf8');
      }
    } else {
      resumeText = '';  // no file uploaded → continue with jobDesc only
    }

    const jobDesc = req.body.jobDesc || "";
    const result = await optimizeResume(resumeText, jobDesc);

    res.json(result);
  } catch (error) {
    console.error('Optimization error:', error);
    res.status(500).json({ 
      error: 'Optimization failed', 
      details: error.message || 'Unknown error' 
    });
  } finally {
    if (filePath && fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
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

router.post('/generate-covers', upload.single('resume'), async (req, res) => {
  try {
    let resumeText = '';

    if (req.file) {
      // File is now in memory → use buffer directly
      const buffer = req.file.buffer;

      if (req.file.originalname.toLowerCase().endsWith('.pdf')) {
        const { PDFParse } = require('pdf-parse');
        const parser = new PDFParse({});
        await parser.load({ data: buffer });
        const textResult = await parser.getText();
        resumeText = textResult.text;
      } else {
        resumeText = buffer.toString('utf8');
      }
    } else {
      resumeText = '';
    }

    const jobDesc = req.body.jobDesc || "";
    const tone = req.body.tone || "professional";
    const length = req.body.length || "medium";

    const coverLetter = await generateCoverLetter(resumeText, jobDesc, tone, length);

    res.json({ cover_letter: coverLetter });
  } catch (error) {
    console.error('Cover letter generation error:', error);
    res.status(500).json({ 
      error: 'Cover letter generation failed', 
      details: error.message || 'Unknown error' 
    });
  }
  // No need for fs.unlinkSync — no file was written to disk
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