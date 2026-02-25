from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="CodeBlueHalo.AI v2.0 API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/v1/system/health")
async def health_check():
    return {"status": "healthy"}

from api.router import router
app.include_router(router, prefix="/api/v1")
