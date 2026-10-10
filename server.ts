import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ALLOWED_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.5-flash-lite'];

// Initialize Google GenAI on server-side only
const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

async function startServer() {
  const app = express();
  const PORT = parseInt(process.env.PORT || '3000', 10);

  app.use(express.json({ limit: '25mb' }));

  // Status / Health
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: !!apiKey,
      allowedModels: ALLOWED_MODELS,
      defaultModel: 'gemini-3.1-flash-lite',
      timestamp: new Date().toISOString(),
    });
  });

  // Get pre-validated bills database
  app.get('/api/bills', (req, res) => {
    try {
      const dataPath = path.join(__dirname, 'data/bills_extracted.json');
      if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, 'utf-8');
        res.json(JSON.parse(raw));
      } else {
        res.status(404).json({ error: 'Extracted bills dataset not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Get discrepancy analysis report
  app.get('/api/discrepancies', (req, res) => {
    try {
      const dataPath = path.join(__dirname, 'data/discrepancies.json');
      if (fs.existsSync(dataPath)) {
        const raw = fs.readFileSync(dataPath, 'utf-8');
        res.json(JSON.parse(raw));
      } else {
        res.status(404).json({ error: 'Discrepancy audit report not found' });
      }
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Download Level 1 CSV
  app.get('/api/export/level1.csv', (req, res) => {
    const filePath = path.join(__dirname, 'output/level1.csv');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="level1.csv"');
      res.sendFile(filePath);
    } else {
      res.status(404).send('Level 1 CSV not generated yet.');
    }
  });

  // Download Level 2 CSV
  app.get('/api/export/level2.csv', (req, res) => {
    const filePath = path.join(__dirname, 'output/level2.csv');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="level2.csv"');
      res.sendFile(filePath);
    } else {
      res.status(404).send('Level 2 CSV not generated yet.');
    }
  });

  // Download Submission ZIP
  app.get(['/api/export/submission.zip', '/api/export/your-submission.zip'], (req, res) => {
    const filePath = path.join(__dirname, 'your-submission.zip');
    if (fs.existsSync(filePath)) {
      res.setHeader('Content-Type', 'application/zip');
      res.setHeader('Content-Disposition', 'attachment; filename="your-submission.zip"');
      res.sendFile(filePath);
    } else {
      res.status(404).send('Submission ZIP not generated yet.');
    }
  });

  // Run live Gemini API extraction on bill image or custom payload
  app.post('/api/decode', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured on the server. Please check Settings > Secrets or .env.',
        });
      }

      const { imageBase64, mimeType = 'image/jpeg', model = 'gemini-3.1-flash-lite', billId } = req.body;

      if (!imageBase64) {
        return res.status(400).json({ error: 'Missing imageBase64 in request body' });
      }

      const selectedModel = ALLOWED_MODELS.includes(model) ? model : 'gemini-3.1-flash-lite';

      const systemInstruction = `You are an expert Pakistani electricity bill extraction system for K-Electric (KE), LESCO, and IESCO bills.
You must strictly extract data following these Level 1 rules:
1. Extract values as printed. Do not recalculate, round, or correct bill amounts.
2. Return monetary amounts as numbers in PKR. Remove currency labels (Rs.) and thousands separators. Example: Rs. 19,964 -> 19964.
3. Credits and subsidies must be negative numbers. Example: 38209CR -> -38209. Subsidies (e.g. 3332) -> -3332.
4. Format dates exactly: Billing month: YYYY-MM; Reading, issue, due dates: YYYY-MM-DD.
5. Use null for any unavailable, blank, covered, or unreadable value. Use [] for empty lists.
6. EXCLUDE personal identifiers entirely: NEVER return names, addresses, CNICs, account/reference/consumer numbers, or meter numbers.
7. Provider must be one of: 'KE', 'LESCO', 'IESCO'. Bill filenames starting with KESC correspond to 'KE'.
8. Charges: Return one entry per nonzero printed line in charges section. Skip zero/blank lines. Types: energy, fixed, fpa, quarterly_adjustment, surcharge, meter_rent, subsidy, other.
9. Taxes: Classify by section. Types: gst, electricity_duty, income_tax, municipal_tax, other_tax.
   * If only a combined tax amount is printed without individual lines, return [] for taxes and put the combined amount in total_taxes.
10. Use null for total_charges if no subtotal is printed.
11. arrears: previous dues carried forward. Preserve printed sign; null if blank.
12. If multiple late-payment amounts are printed, use highest value for payable_after_due_date.

Output strictly valid JSON matching Level 1 schema.`;

      const prompt = `Extract all billing details from this electricity bill image into the Level 1 JSON schema for bill ${billId || 'UNKNOWN'}.`;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: [
          {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: imageBase64.replace(/^data:image\/[a-zA-Z0-9.+]+;base64,/, ''),
                },
              },
              {
                text: prompt,
              },
            ],
          },
        ],
        config: {
          systemInstruction,
          temperature: 0.0,
          responseMimeType: 'application/json',
        },
      });

      const responseText = response.text || '{}';
      let parsedJson: any;
      try {
        parsedJson = JSON.parse(responseText);
      } catch (parseErr) {
        // Fallback cleanup if model wrapped in markdown
        const cleaned = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
        parsedJson = JSON.parse(cleaned);
      }

      res.json({
        success: true,
        model: selectedModel,
        extracted: parsedJson,
      });
    } catch (err: any) {
      console.error('Extraction error:', err);
      res.status(500).json({ error: err.message || 'Error executing Gemini bill extraction' });
    }
  });

  // Answer Level 2 question with live Gemini model
  app.post('/api/ask', async (req, res) => {
    try {
      if (!ai) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
      }

      const { billData, question, model = 'gemini-3.1-flash-lite' } = req.body;
      if (!question || !billData) {
        return res.status(400).json({ error: 'Missing question or billData in request' });
      }

      const selectedModel = ALLOWED_MODELS.includes(model) ? model : 'gemini-3.1-flash-lite';

      const prompt = `You are answering questions about an electricity bill in English.
Answer rules:
1. Use only information visible in the bill data below. Do not use outside tariff/rate assumptions.
2. Be specific, clear, and concise, with numeric results and units/currency where relevant.
3. If a value needed is missing or unreadable, say so clearly.
4. Exclude personal identifiers (no names, addresses, CNICs, reference numbers).

Bill Data:
${JSON.stringify(billData, null, 2)}

Question:
${question}

Answer in 1-2 clear, specific sentences:`;

      const response = await ai.models.generateContent({
        model: selectedModel,
        contents: prompt,
        config: {
          temperature: 0.0,
        },
      });

      res.json({
        answer: response.text?.trim() || 'No answer generated.',
        model: selectedModel,
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mount Vite in dev mode
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WTQ Utility Bill Decoder server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
