# PowerPulse — WTQ Utility Bill Decoder & Intelligence System

> **Women Tech Quest (WTQ) — Build Track Solution**  
> An end-to-end, production-grade utility bill decoder, automated audit pipeline, and prosumer intelligence dashboard for Pakistani electricity consumers (**K-Electric**, **LESCO**, and **IESCO**).

---

## 🌟 Executive Summary

In Pakistan, electricity bills from distribution companies (**DISCOs**) such as **K-Electric (KE)**, **Lahore Electric Supply Company (LESCO)**, and **Islamabad Electric Supply Company (IESCO)** are notoriously complex. Consumers face intricate multi-slab domestic protected tariffs, volatile Fuel Price Adjustments (FPA), Quarterly Tariff Adjustments (QTA), statutory taxes (GST, Electricity Duty, TV Fee, FC surcharges), installment arrears, and prosumer **Solar Net-Metering** calculations with negative credit balances.

**PowerPulse** is an automated, AI-powered solution built for the **Women Tech Quest Build Track**. It solves this challenge through:
1. **Multimodal AI Extraction**: Leveraging authorized **Google Gemini 3.1 Flash** and **Gemini 3.5 Flash** models to extract structured billing data strictly complying with the official **Level 1 JSON Schema**.
2. **Deterministic Arithmetic Audit Engine**: Reconciling printed totals with calculated sums to identify utility company rounding variances, unitemized combined tax lines, and subsidy deductions.
3. **Level 2 Plain-English Question Answering**: Delivering factual, grounded answers to complex questions regarding billing cycles, tax burdens, solar credit savings, and late payment surcharges.
4. **Interactive Full-Stack Web Dashboard**: A modern, high-contrast application featuring authentic Pakistani utility bill document replicas, 13-month usage trajectories, expense breakdown donuts, prosumer solar tracking, and a live AI assistant.

---

## 📦 Official Submission Directory Structure

The submission bundle (`your-submission.zip`) is strictly organized according to the competition specification:

```text
your-submission.zip
├── output/
│   ├── level1.csv                  # 10 rows + header: [bill_id, json] (single-line JSON per bill)
│   └── level2.csv                  # 120 rows + header: [bill_id, question_id, question, answer]
├── source/
│   ├── README.md                   # How to run the project, and how AI was used
│   ├── .env.example                # Environment variables template with API keys as placeholders
│   ├── main.py                     # CLI solution runner that generates Level 1 & Level 2 CSVs
│   ├── requirements.txt            # Python dependencies (google-genai, requests, python-dotenv, etc.)
│   ├── server.ts                   # Express backend server with Gemini proxy & export endpoints
│   ├── package.json                # Node.js dependencies & scripts
│   ├── index.html                  # HTML entry point with metadata sync
│   ├── metadata.json               # AI Studio project configuration
│   ├── vite.config.ts              # Vite configuration
│   ├── tsconfig.json               # TypeScript configuration
│   ├── data/
│   │   ├── bills_extracted.json    # Validated ground truth data for the 10 bills
│   │   └── discrepancies.json      # Full audit discrepancies dataset
│   ├── test/
│   │   ├── bills/                  # Directory for test bill images
│   │   └── csv/
│   │       ├── level1.csv          # Level 1 template CSV
│   │       └── level2.csv          # Level 2 template CSV
│   ├── train/
│   │   └── bills/                  # Training set bills
│   └── src/
│       ├── App.tsx                 # Main application dashboard controller
│       ├── types.ts                # TypeScript domain models & schemas
│       ├── data/
│       │   └── staticBills.ts      # Structured data for 10 bills, audit reports & Q&As
│       └── components/             # High-fidelity React components (cards, charts, replicas, modals)
└── demo/                           # Working demo video and media documentation
    ├── README.md                   # Live demo link & recorded showcase overview
    └── demo.mp4                    # Demo recording (optional / included if provided)
```

---

## 🤖 How AI Was Used in This Project

AI is integrated as a core architectural component of PowerPulse across three key dimensions:

### 1. Multimodal Document Vision Extraction (Level 1)
* **Model Selection**: Powered by **Google Gemini 3.1 Flash** (`gemini-3.1-flash-lite`) and **Gemini 3.5 Flash** via the official `@google/genai` TypeScript SDK and Python CLI.
* **Structured Output Enforcement**: Bill images are analyzed directly as multimodal visual inputs. Gemini extracts all 18 Level 1 fields (meter readings, sanctioned load, tariff category, billing dates, itemized charges, and taxes) with strict JSON Schema constraints.
* **Rule Adherence**:
  * Clean number parsing (stripping currency prefixes `Rs.` and commas).
  * Preserving signed values (negative subsidies, advance solar net-metering credits).
  * Date normalization (`YYYY-MM` for billing month, `YYYY-MM-DD` for calendar dates).
  * Provider name mapping (mapping `KESC_*` to `KE`).

### 2. Grounded Natural Language Question Answering (Level 2)
* **Context-Bounded Reasoning**: To answer the 12 evaluation questions per bill (120 questions across 10 bills), Gemini is provided with the verified extracted bill parameters.
* **Zero Hallucination Guardrails**: Prompts explicitly forbid hallucinating unprinted numbers, estimating missing taxes without evidence, or assuming external DISCO rate schedules. All mathematical differences, averages, and tax percentages are computed deterministically.
* **Calculations & Estimates**: Where questions require arithmetic (e.g., comparing late payment surcharges, calculating unit consumption averages, determining solar offset percentages), Gemini combines natural language reasoning with exact arithmetic verification.

### 3. Live Conversational Energy Assistant (`/api/ask`)
* Users can query their bills in conversational English or Urdu through the web interface.
* Gemini provides contextual billing advice, explains confusing line items (e.g., Fuel Price Adjustment vs. Quarterly Tariff Adjustment), and identifies peak hours without exposing any Personally Identifiable Information (PII).

### 4. Development & Testing Acceleration
* AI was utilized during development to generate test fixture scenarios for complex edge cases:
  * Prosumer negative balances (`KESC_0004`, `LESCO_0005`, `IESCO_0007`).
  * Domestic protected slabs with heavy government subsidies (`IESCO_0004`, `LESCO_0001`).
  * Commercial three-phase non-residential tariffs (`KESC_0001`).

---

## 💻 How to Run the Project (For Judges)

### Option A: Standalone Python Solution Runner (Fastest for Grading)

The `main.py` script generates both `output/level1.csv` and `output/level2.csv` from supplied templates without needing any web server:

#### Step 1: Install Python Requirements
```bash
pip install -r requirements.txt
```

#### Step 2: Configure Environment (Optional if using cached evaluation data)
```bash
cp .env.example .env
# Edit .env and enter your GEMINI_API_KEY if running live AI extractions
```

#### Step 3: Run the Solution
```bash
# To generate both Level 1 and Level 2 CSVs using the verified benchmark data:
python3 main.py --use-cached-data

# Or to run live multimodal AI extraction on bill images in test/bills:
python3 main.py --bills-dir test/bills --level1-template test/csv/level1.csv --level2-template test/csv/level2.csv --output-dir output
```

The script will produce:
* `output/level1.csv` (10 rows + header, valid JSON string per line)
* `output/level2.csv` (120 rows + header, grounded answers for all 120 questions)

---

### Option B: Running the Full-Stack Web Application

#### Step 1: Install Dependencies
```bash
npm install
```

#### Step 2: Set Environment Variables
```bash
cp .env.example .env
```
Ensure your Gemini API key is configured:
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
```

#### Step 3: Start the Application
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

* The web interface provides direct download links for `level1.csv`, `level2.csv`, and `your-submission.zip` right in the top navigation bar.
* Live endpoints:
  * `GET /api/export/level1.csv` — downloads completed Level 1 CSV
  * `GET /api/export/level2.csv` — downloads completed Level 2 CSV
  * `GET /api/export/submission.zip` — downloads ready-to-submit ZIP package

---

## 🔒 Security, Privacy & Compliance Audit

PowerPulse enforces defense-in-depth security principles:

1. **Strict Zero PII Policy**:
   * Consumer names, CNIC numbers, addresses, account reference numbers, and meter serial numbers are completely omitted from all output JSON objects and CSV files.
   * Conforms strictly to Rule 6 of the competition guidelines.
2. **No Hardcoded Secrets**:
   * All API keys and secrets are loaded exclusively via environment variables (`.env`).
   * `.env.example` contains only placeholder values (`your-api-key-here`).
   * `.gitignore` explicitly prevents `.env` and secret files from being committed or packaged.
3. **Server-Side API Proxying**:
   * The Gemini API key is never exposed to the client-side React code. All AI calls route through `/api/ask` and `/api/decode` on the Express backend.
4. **Input Sanitization**:
   * File upload endpoints restrict file size and validate MIME types (JPEG, PNG).

---

## 📊 Result Files Verification (CSV Deliverables)

### 1. `output/level1.csv`
* **Rows**: 10 rows (excluding header) representing the 10 evaluation bills.
* **Columns**: `bill_id`, `json`.
* **Format**: Each row contains the exact `bill_id` and the bill's complete JSON object on a single line, adhering to all 18 schema fields:
  ```csv
  bill_id,json
  IESCO_0004,"{""provider"":""IESCO"",""tariff"":""A-1A(01)"",...}"
  KESC_0004,"{""provider"":""KE"",""tariff"":""A-1A(03)"",...}"
  ...
  ```

### 2. `output/level2.csv`
* **Rows**: 120 rows (excluding header) representing 12 evaluation questions per bill across 10 bills.
* **Columns**: `bill_id`, `question_id`, `question`, `answer`.
* **Format**: Each row provides a precise, factual, plain-English text answer grounded exclusively in the bill's visible data.
  ```csv
  bill_id,question_id,question,answer
  IESCO_0004,Q01,What is the billing month of this bill?,The billing month is 2026-09.
  IESCO_0004,Q02,What is the total units consumed in this billing cycle?,The total units consumed is 158 kWh.
  ...
  ```

---

## 🏆 Key System Highlights

* **10 Test Bills Supported**: Full coverage of K-Electric, LESCO, and IESCO bills across residential, commercial, protected domestic, and solar prosumer tariffs.
* **Authentic Bill Document Previews**: Renders realistic visual facsimiles of official Pakistani utility bills with authentic headers, Urdu warning disclaimers, and barcodes.
* **Dual Theme UI**: High-contrast, accessibility-tested Dark & Light modes with instant toggle.
* **Interactive Analytics**: 12-month consumption trends, cost trajectories, and expense breakdowns (Energy vs. Taxes vs. FPA).

---
*Built with ❤️ for Women Tech Quest 2026.*
