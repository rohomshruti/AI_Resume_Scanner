from fastapi import FastAPI

from app.routes.resume import router as resume_router
from app.routes.analysis import router as analysis_router
from app.routes.jobs import router as jobs_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="AI Resume Scanner API",
    description="AI-powered resume screening, job matching and skill gap analysis",
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(resume_router)
app.include_router(analysis_router)
app.include_router(jobs_router)

@app.get("/")
def root():
    return {
        "message": "AI Resume Scanner API is running"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }