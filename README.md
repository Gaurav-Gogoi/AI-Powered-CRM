"# AI CRM Project" 
# AI-First CRM HCP Module 🩺🤖

An AI-driven Customer Relationship Management (CRM) system designed for Life Science field representatives to log interactions with Healthcare Professionals (HCPs). 

This project was built as part of an assignment to demonstrate the power of **LangGraph** tool-calling. Instead of manually filling out tedious forms, field reps can simply chat with an AI assistant in natural language, and the AI automatically extracts the entities and populates the CRM database.

---

## 🌟 Key Features
- **Split-Screen UI:** A read-only CRM form on the left, and an AI chat assistant on the right.
- **Strict AI-Control:** Enforces the rule that users *cannot* manually type into the form. All data entry and editing is handled purely by the AI.
- **Agentic Workflow:** Powered by LangGraph and Groq (`llama-3.3-70b-versatile`), the AI intelligently decides which tools to call based on the user's conversational input.
- **Crash-Protected Backend:** Robust error handling ensures that if the LLM outputs malformed data, the server catches it and relays the error to the UI instead of crashing with CORS issues.

---

## 🛠️ Tech Stack
**Frontend:**
- React.js
- Redux Toolkit (State Management)
- Tailwind CSS (Styling)
- Axios & Lucide-React (Icons)

**Backend:**
- Python 3
- FastAPI (REST API framework)
- LangGraph & LangChain (AI Agent framework)
- Groq API (LLM inference)
- SQLAlchemy & SQLite (Database)

---

## 🧠 LangGraph Tools Implemented
The AI agent is equipped with 5 specific tools to manage sales-related activities:

1. **`log_interaction`**: Extracts HCP Name, Interaction Type, Sentiment, and Notes from natural language and saves them to the database while updating the UI form.
2. **`edit_interaction`**: Allows the user to correct specific fields (e.g., "Change the sentiment to negative") without rewriting the whole log.
3. **`search_hcp`**: Queries the database to find doctor specialties and IDs.
4. **`get_product_info`**: Retrieves approved medical product information (e.g., side effects, indications).
5. **`schedule_follow_up`**: Schedules future tasks/meetings based on chat input.

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js installed
- Python 3 installed
- A free API key from [Groq Console](https://console.groq.com/)

### 1. Backend Setup
Navigate to the backend directory:
```bash
cd backend
Install Python dependencies:

Bash
pip install fastapi uvicorn langgraph langchain-groq langchain-core sqlalchemy pydantic python-dotenv
Create a .env file in the backend folder and add your Groq API key:

Code snippet
GROQ_API_KEY=gsk_your_api_key_here
Start the FastAPI server:

Bash
uvicorn main:app --reload
The backend will run on http://localhost:8000

2. Frontend Setup
Open a new terminal window and navigate to the frontend directory:

Bash
cd frontend
Install Node modules:

Bash
npm install
Start the React development server:

Bash
npm start
The frontend will run on http://localhost:3000

💡 How to Use
Open the application in your browser.

Notice the left panel (Interaction Details) is locked (readOnly).

In the AI Chat on the right, type a prompt like:

"Today I met with Dr. Smith. We discussed CardioVex. The sentiment was positive."

Watch as the LangGraph agent calls the log_interaction tool, processes the data, and magically populates the form on the left.

To test the edit tool, type:

"Wait, change the sentiment to negative."

The AI will intelligently update just the sentiment field.

📁 Project Structure
Plaintext
my-ai-crm/
├── backend/
│   ├── .env                 # API Keys (Git Ignored)
│   ├── main.py              # FastAPI Endpoints & Error Handling
│   ├── agent.py             # LangGraph Agent & Tool Definitions
│   ├── database.py          # SQLAlchemy Database Config
│   └── crm.db               # SQLite Database
└── frontend/
    ├── src/
    │   ├── App.js           # Split-Screen UI & Chat Logic
    │   ├── store.js         # Redux Form State
    │   ├── index.css        # Tailwind Imports
    │   └── index.js         # React Entry Point
    ├── tailwind.config.js
    └── package.json
Created for the QMS/CRM Assignment Task 1.