# Hybrid GenAI Chatbot

An intelligent hybrid chatbot combining **Rasa NLU**, **LLM (GPT-4)**, and **RAG**.

## 🚀 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│                    Admin Dashboard                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (Node.js + Express)               │
│              REST API + JWT Auth + MongoDB                   │
└─────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
       ┌──────────┐   ┌──────────────┐  ┌──────────┐
       │   RASA   │   │ ACTION SERVER│  │ MONGODB  │
       │  Server  │◄──│ Python + RAG │  │          │
       └──────────┘   └──────────────┘  └──────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
       ┌──────────────┐              ┌──────────────┐
       │   CHROMADB   │              │   OPENAI     │
       │ Vector Store │              │   GPT-4      │
       └──────────────┘              └──────────────┘
```

## 📁 Project Structure

```
rasa_genai/
├── rasa/                  # Rasa NLU Project
│   ├── config.yml         # NLU Pipeline + Policies
│   ├── domain.yml         # Intents, entities, responses
│   ├── data/              # Training data
│   └── Dockerfile
├── actions/               # Python Action Server
│   ├── core/              # RAG Pipeline, Embeddings, LLM
│   ├── actions/           # Rasa Custom Actions
│   ├── utils/             # Config, Logger
│   └── Dockerfile
├── backend/               # Node.js Backend
│   ├── src/
│   │   ├── routes/        # API Routes
│   │   ├── controllers/   # Controllers
│   │   ├── services/      # Business logic
│   │   ├── models/        # MongoDB models
│   │   └── middlewares/   # Auth, validation
│   └── Dockerfile
├── frontend/              # React Dashboard
│   ├── src/
│   │   ├── pages/         # Pages (Dashboard, Intents, etc.)
│   │   ├── components/    # UI Components
│   │   └── store/         # Zustand stores
│   └── Dockerfile
└── docker-compose.yml     # Orchestration
```

## 🛠️ Installation

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Python 3.11+
- OpenAI API Key

### Quick Start

1. **Clone and Configure**
   ```bash
   git clone https://github.com/waeletteyeb/rasa_genai.git
   cd rasa_genai
   cp .env.example .env
   # Edit .env with your OpenAI Key
   ```

2. **Run with Docker**
   ```bash
   docker-compose up -d
   ```

3. **Access Services**
   - Dashboard: http://localhost
   - Backend API: http://localhost:3001
   - Rasa Server: http://localhost:5005
   - Action Server: http://localhost:5055

### Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev

# Rasa
cd rasa
rasa train
rasa run --enable-api --cors "*"

# Action Server
cd actions
pip install -r requirements.txt
rasa run actions
```

## 🔧 Configuration

### NLU Confidence Threshold

Routing to RAG is configured with a threshold of **0.75**:
- Confidence ≥ 0.75 → Standard Rasa Response
- Confidence < 0.75 → RAG Pipeline (Search + LLM)

Modify in `actions/utils/config.py` or via environment variable `RAG_CONFIDENCE_THRESHOLD`.

### LLM (OpenAI)

- Model: GPT-4
- Embeddings: text-embedding-ada-002
- Configurable via `OPENAI_MODEL`, `OPENAI_EMBEDDING_MODEL`

### Vector Store (ChromaDB)

- Local persistence by default
- Configurable for MongoDB Atlas Vector Search in production

## 📊 Features

### Admin Dashboard
- 📈 Real-time Analytics
- 💬 Conversation History
- 📝 Intent Management
- 📄 Document Upload & Indexing
- ⚙️ Chatbot Configuration

### RAG Pipeline
- Intelligent Document Chunking
- OpenAI Embeddings
- ChromaDB Semantic Search
- GPT-4 Contextual Generation

### Intelligent Routing
- NLU Confidence Analysis
- Automatic Fallback to RAG
- Human Escalation if necessary

## 🧪 Tests

```bash
# Rasa Tests
cd rasa
rasa test

# Backend Tests
cd backend
npm test

# Frontend Tests
cd frontend
npm test
```

## 📝 API Endpoints

### Auth
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register

### Intents
- `GET /api/intents` - List intents
- `POST /api/intents` - Create intent
- `PUT /api/intents/:id` - Edit
- `DELETE /api/intents/:id` - Delete

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents/upload` - Upload PDF/TXT
- `POST /api/documents/search` - RAG Search
- `DELETE /api/documents/:id` - Delete

### Analytics
- `GET /api/analytics/dashboard` - Global stats
- `GET /api/analytics/intents` - Stats by intent
- `GET /api/analytics/rag` - RAG stats

## 🔐 Security

- JWT Authentication
- Rate limiting
- Helmet (secure headers)
- Joi Validation
- CORS Configured

## 📦 Tech Stack

| Component | Technologies |
|-----------|--------------|
| NLU | Rasa 3.6+, SpaCy, DIET |
| LLM | OpenAI GPT-4 |
| RAG | ChromaDB, LangChain |
| Backend | Node.js, Express, MongoDB |
| Frontend | React, Vite, Tailwind, Zustand |
| DevOps | Docker, Docker Compose |

## 📄 License

© 2024
