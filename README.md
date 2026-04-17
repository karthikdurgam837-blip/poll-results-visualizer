# Poll Results Visualizer 📊

An industry-grade analytics platform designed to convert raw survey responses into high-impact visual stories and AI-powered strategic insights.

## 🚀 Project Overview
This tool is built for Data Analysts and Insights Specialists who need to process large volumes of feedback data quickly. It handles the entire data lifecycle: **Ingestion → Preprocessing → Visualization → AI Synthesis**.

## ✨ Key Features
- **Real-time Data Visualization**: Dynamic charts (Bar, Area, Pie) powered by Recharts.
- **Synthetic Data Engine**: Generates realistic poll responses with regional and demographic variance for testing and simulation.
- **AI-Powered Insights**: Integrated with **Google Gemini 3 Flash** to narrate trends and recommend strategic actions.
- **Responsive Dashboard**: Professional UI built with **Tailwind CSS v4** and **shadcn/ui**.
- **Data Table View**: Clean, searchable interface for deep-diving into individual raw responses.

## 🛠️ Tech Stack
- **Frontend**: React 19, TypeScript 5.8
- **Styling**: Tailwind CSS v4, Motion (Animations)
- **Visualization**: Recharts
- **AI Engine**: @google/genai (Gemini 3 Flash)
- **Components**: shadcn/ui (Radix Primitives)

## 📁 Project Structure
```
Poll-Results-Visualizer/
├── src/
│   ├── components/ui/   # Reusable Atomic UI Components
│   ├── lib/             # Data Processing & Simulation Logic
│   ├── services/        # AI Service Integration (Gemini)
│   ├── App.tsx          # Main Dashboard Orchestrator
│   └── main.tsx         # Application Entry Point
├── metadata.json        # App Configuration
└── package.json         # Dependency Manifest
```

## 📈 How to Run
1. Install dependencies: `npm install`
2. Start the dev server: `npm run dev`
3. Click "Run Analysis Engine" in the AI Insights tab to see the power of LLM-based data synthesis.

## 🎓 Placement & Interview Tips
- **The "Why"**: Explain how companies like Google, Nielsen, and Qualtrics use this to guide product roadmaps.
- **Technical Depth**: Mention using **useMemo** for expensive data processing to keep the UI smooth at 60fps.
- **AI Integration**: Highlight the "Context Window" management when sending data summaries to Gemini for insight generation.

---
Built with ❤️ for professional growth D karthik.
