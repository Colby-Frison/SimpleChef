# SimpleChef

A smart cooking assistant app.

## Project Structure
- `backend/`: FastAPI Python Backend
- `frontend/`: React Native (Expo) Frontend

## Getting Started

### Prerequisites
- **Docker Desktop**: Required for the PostgreSQL database. Install from [docker.com](https://www.docker.com/products/docker-desktop/).
- **Node.js**: Required for the frontend.
- **Python 3.8+**: Required for the backend.

### Backend
1. Navigate to `backend`:
   ```bash
   cd backend
   ```
2. Create virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   # source venv/bin/activate  # Mac/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Start Database (Ensure Docker Desktop is running):
   ```bash
   docker compose up -d
   ```
5. Run Migrations:
   ```bash
   alembic upgrade head
   ```
6. Start Server:
   ```bash
   python run.py
   ```
   API will be available at `http://localhost:8000`. Docs at `http://localhost:8000/docs`.

### Frontend
1. Navigate to `frontend`:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Expo:
   ```bash
   npx expo start
   ```
   Scan the QR code with Expo Go app or press `a` for Android emulator / `w` for Web.

## Features implemented
- **User Auth**: Login/Signup.
- **Recipes**: Browse, Search, Add (Manual + AI Text Paste), Details.
- **Cooking Mode**: Step-by-step instructions with integrated timers.
- **Meal Planner**: Calendar view to plan meals.
- **Grocery List**: Auto-generated from plan or manual add.
