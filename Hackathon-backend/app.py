from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime
from utils.preprocessing import clean_text
from model.model_loader import predict_text
from utils.hashing import hash_password, verify_password

# ----------------------------
# Data structures / in-memory storage
# ----------------------------
trends = []  # last 10 predictions
users_db = {}  # simple in-memory user "database"

# ----------------------------
# FastAPI setup
# ----------------------------
app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# Pydantic models
# ----------------------------
class InputText(BaseModel):
    text: str

class SignupRequest(BaseModel):
    username: str
    email: str
    password: str

class SigninRequest(BaseModel):
    email: str
    password: str

# ----------------------------
# User authentication endpoints
# ----------------------------
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

@app.post("/signin")
def signin(user: SigninRequest):
    db_user = users_db.get(user.email)
    if not db_user or not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Signin successful", "username": db_user["username"]}

# ----------------------------
# AI prediction endpoints
# ----------------------------
@app.post("/predict")
def predict(input: InputText):
    # Step 1: Preprocess text
    processed_text = clean_text(input.text)

    # Step 2: Get prediction from Hugging Face model
    prediction = predict_text(processed_text)  # should return dict: top_emotions, scores, main_emotion, score

    # Step 3: Add extra info
    prediction["processed_text"] = processed_text
    prediction["timestamp"] = datetime.now().isoformat()

    # Step 4: Store in trends (last 10)
    trends.append(prediction)
    if len(trends) > 10:
        trends.pop(0)

    # Step 5: Return prediction
    return prediction

@app.get("/trend")
def trend():
    return {"recent_predictions": trends}
