# AI Candidate Shortlisting System

A full-stack application built with React, Node.js, Express, MongoDB, and OpenRouter AI.

## Features
- 🚀 **Candidate Management**: Add and view candidates with their skills and experience.
- 🧠 **Smart Matching Logic**: Calculate match scores based on required/preferred skills and experience.
- 🤖 **AI Integration**: Uses OpenRouter (e.g. GPT-4o) to analyze candidates, provide insights, and generate tailored interview questions.
- 🎨 **Futuristic UI**: Dark theme, glassmorphism, neon glows, and responsive design.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide React
- **Backend**: Node.js, Express, MongoDB (Mongoose), Axios
- **AI**: OpenRouter API

## Setup Instructions

### 1. Database Setup
Make sure you have a MongoDB cluster (e.g., MongoDB Atlas).

### 2. Backend Setup
1. Navigate to the \`backend\` folder: \`cd backend\`
2. Install dependencies: \`npm install\`
3. Create a \`.env\` file in the \`backend\` directory with:
   \`\`\`
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   OPENROUTER_API_KEY=your_openrouter_api_key
   OPENROUTER_MODEL=openai/gpt-4o
   \`\`\`
4. Start the backend server: \`npm run dev\`

### 3. Frontend Setup
1. Navigate to the \`frontend\` folder: \`cd frontend\`
2. Install dependencies: \`npm install\`
3. Start the Vite dev server: \`npm run dev\`
4. Open the displayed local URL in your browser.

## Usage
1. Go to "Add Candidate" and add a few profiles.
2. Go to "Job Requirements" to input a job description.
3. Click "Run System Match" to see the algorithmic match scores.
4. Click "Trigger AI Analysis" to get OpenRouter's insights and interview questions.
