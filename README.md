# ResumeIQ – AI Resume Scanner & Job Matching System

ResumeIQ is an AI-powered resume analysis and job matching system that analyzes resumes, extracts skills, evaluates resume quality, and compares the candidate's profile with suitable job roles.

It combines NLP, Machine Learning, and a modern React interface with a FastAPI backend to provide actionable resume insights.

---

## 🚀 Features

- 📄 Resume upload and PDF text extraction
- 🤖 AI-powered resume analysis
- 📊 Overall resume scoring
- 🧠 Automatic skill extraction
- 📋 Resume quality evaluation
- 🔍 ATS-friendly resume analysis
- 💼 Job matching based on skills
- 📈 Job compatibility scores
- ✅ Matched skill identification
- ❌ Missing skill identification
- 📝 Extracted resume text display
- ⚡ FastAPI backend
- 🎨 Modern React + Tailwind CSS dashboard

---

## 🖥️ Application Preview

### Resume Analysis Dashboard

The dashboard displays:

- Overall Resume Score
- Detected Skills
- ATS Safety
- Keyword & ATS Optimization
- Experience Depth
- Formatting & Readability
- Impact & Quantified Results
- Education & Certifications
- Resume Summary
- Job Matching Score
- Recommended Jobs
- Matched Skills
- Missing Skills
- Extracted Resume Text

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- JavaScript
- Tailwind CSS
- Axios
- React Icons
- Framer Motion

### Backend

- Python
- FastAPI
- Uvicorn
- PyMuPDF
- Pydantic

### AI / Machine Learning

- Sentence Transformers
- Scikit-learn
- XGBoost
- Cosine Similarity
- NLP-based skill extraction

---

## 📁 Project Structure

```text
AI_Resume_Scanner/
│
├── backend/
│   ├── app/
│   │   ├── routes/
│   │   │   ├── analysis.py
│   │   │   ├── jobs.py
│   │   │   └── resume.py
│   │   │
│   │   ├── models/
│   │   └── services/
│   │
│   ├── requirements.txt
│   └── ...
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   └── scanner/
│   │       ├── components/
│   │       ├── ResumeScannerApp.jsx
│   │       └── analyzeResume.js
│   │
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── .gitignore
└── README.md
