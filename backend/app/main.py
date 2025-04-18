from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1 import contacts, organizations

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(contacts.router)
app.include_router(organizations.router)

@app.get("/up")
def health_check():
    return {"status": "ok"}