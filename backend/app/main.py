from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.resume import router as resume_router
from app.routes.analysis import router as analysis_router
from app.routes.jobs import router as jobs_router


app = FastAPI(
    title="AI Resume Scanner API",
    description="AI-powered resume screening, job matching and skill gap analysis",
    version="1.0.0",
)


# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://localhost:5173",
        "https://resumeiq-mu-six.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routes
app.include_router(resume_router)
app.include_router(analysis_router)
app.include_router(jobs_router)


# Root endpoint
@app.get("/")
def root():
    return {
        "message": "AI Resume Scanner API is running"
    }


# Health check endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }
