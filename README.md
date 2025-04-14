# 📦 FastAPI Backend - Graph8 Migration Challenge

This project is a FastAPI-based backend converted from a Ruby on Rails application.

## 🚀 Quick Start

### Prerequisites
- Python 3.10.16
- PostgreSQL
- Git

### Installation Steps

1. **Set Up Virtual Environment**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure Environment**
   Create a `.env` file in the `backend/` directory:
   ```
   DATABASE_URL=postgresql://dev@localhost:5432/test_db_1
   ```
   Make sure your Postgres user `dev` exists and the database `test_db_1` is created.

## 🗃️ Database Setup

### PostgreSQL Setup
```bash
# Create database (if not created already)
createdb test_db_1
```

### Run Migrations
```bash
# Create Alembic migration
alembic revision --autogenerate -m "initial migration"

# Apply migration
alembic upgrade head
```

## 🚀 Running the Application

### Development Server
```bash
uvicorn app.main:app --reload
```

Visit your API docs at: http://127.0.0.1:8000/docs
