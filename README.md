# ⚙️ Graph8 Migration Challenge

A full-stack project powered by **FastAPI** (backend) and **React** (frontend), migrated from a Ruby on Rails architecture.

---

## 🌐 Live Links

| Service     | URL                                                                                                |
| ----------- | -------------------------------------------------------------------------------------------------- |
| 🖥️ Frontend | [https://your-frontend.vercel.app](https://your-frontend.vercel.app)                               |
| 🛠️ Backend  | [https://graph8-migration-challenge.onrender.com](https://graph8-migration-challenge.onrender.com) |

---

## 🧩 Tech Stack

- 🐍 Backend: FastAPI + SQLAlchemy + Alembic
- ⚛️ Frontend: React + Vite
- 🐘 Database: PostgreSQL (Locally or on Render)

---

## 🖥️ Frontend Setup

### Prerequisites

- Node.js (v18+ recommended)
- Yarn or npm

### Run Frontend Locally

```bash
cd frontend
npm install  # or yarn install
npm run dev  # or yarn dev
```

Access the app at http://localhost:5173

### API Connection

Make sure your frontend `.env` has:

```
VITE_API_BASE_URL=http://localhost:8000
```

Or set it to your production URL for deployed frontend:

```
VITE_API_BASE_URL=https://graph8-migration-challenge.onrender.com
```

---

## ⚙️ Backend Setup

### Prerequisites

- Python 3.10.16
- PostgreSQL
- Git

### Run Backend Locally

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

Create `.env` inside `backend/`:

```
DATABASE_URL=postgresql://<user>:<password>@localhost:5432/<db_name>
```

Make sure your local Postgres DB and user exist:

```bash
createdb <db_name>
```

### Apply Migrations

```bash
alembic revision --autogenerate -m "initial migration"
alembic upgrade head
```

### Run Dev Server

```bash
uvicorn app.main:app --reload
```

- API: http://localhost:8000
- Docs: http://localhost:8000/docs

---

## 🧑‍💻 Deployment Setup

### Backend (Render)

- Add the following to Start Command:
  ```
  uvicorn app.main:app --host 0.0.0.0 --port $PORT
  ```
- Working Directory: `backend`
- Build Command:
  ```
  cd backend && pip install -r requirements.txt
  ```
- Add environment variable:
  ```
  DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<dbname>
  ```

### Frontend (Vercel)

- Set environment variable in Vercel project:
  ```
  VITE_API_BASE_URL=https://graph8-migration-challenge.onrender.com
  ```
- Deploy via Vercel Git integration or CLI
