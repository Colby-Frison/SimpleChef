from fastapi import FastAPI

app = FastAPI(title="SimpleChef API")

@app.get("/")
def read_root():
    return {"message": "Welcome to SimpleChef API"}
