from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from utils.hashing import hash_password, verify_password

# In-memory user "database"
users_db = {}

# FastAPI app
app = FastAPI()

# Allow CORS from your frontend (adjust the port)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5500",  # <-- Add this
    "http://localhost:5500"   # <-- optional
]
  # or localhost:3000 if React

app.add_middleware(
    CORSMiddleware,
    
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# Pydantic models
class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class SigninRequest(BaseModel):
    email: str
    password: str

# Signup endpoint
@app.post("/signup")
def signup(user: SignupRequest):
    if user.email in users_db:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_pw = hash_password(user.password)
    users_db[user.email] = {
        "username": user.username,
        "email": user.email,
        "password": hashed_pw
    }
    return {"message": "Signup successful"}

# Signin endpoint
@app.post("/signin")
def signin(user: SigninRequest):
    db_user = users_db.get(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Signin successful", "username": db_user["username"]}
