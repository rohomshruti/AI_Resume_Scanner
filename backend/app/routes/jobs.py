import os
import shutil

from fastapi import APIRouter, File, UploadFile, HTTPException

from app.models.job import Job
from app.services.parser import extract_resume_text
from app.services.matcher import calculate_match_score
from app.services.skill_extractor import extract_skills


router = APIRouter(prefix="/jobs", tags=["Jobs"])


# --------------------------------------------------
# Sample Jobs
# --------------------------------------------------

jobs = [
    Job(
        title="Machine Learning Engineer",
        company="AI Tech Solutions",
        description=(
            "Develop and deploy machine learning models using Python, "
            "TensorFlow, Scikit-learn and Pandas. Work on data preprocessing, "
            "model evaluation, deep learning and AI applications."
        ),
        required_skills=[
            "Python",
            "Machine Learning",
            "TensorFlow",
            "Scikit-learn",
            "Pandas",
            "Deep Learning",
        ],
    ),

    Job(
        title="Data Scientist",
        company="DataWorks",
        description=(
            "Analyze large datasets and build predictive machine learning "
            "models. Strong knowledge of Python, Pandas, NumPy, Scikit-learn, "
            "SQL, statistics and data visualization is required."
        ),
        required_skills=[
            "Python",
            "Machine Learning",
            "Pandas",
            "NumPy",
            "Scikit-learn",
            "SQL",
            "Data Analysis",
        ],
    ),

    Job(
        title="AI Engineer",
        company="Innovate AI",
        description=(
            "Build artificial intelligence and deep learning solutions using "
            "Python, TensorFlow and machine learning techniques. Experience "
            "with computer vision, NLP and model deployment is preferred."
        ),
        required_skills=[
            "Python",
            "Artificial Intelligence",
            "Machine Learning",
            "Deep Learning",
            "TensorFlow",
            "Computer Vision",
        ],
    ),

    Job(
        title="Data Analyst",
        company="Analytics Hub",
        description=(
            "Analyze business data using Python, SQL, Pandas and data "
            "visualization tools. Create reports, identify trends and "
            "communicate insights to business teams."
        ),
        required_skills=[
            "Python",
            "SQL",
            "Pandas",
            "Data Analysis",
            "Excel",
            "Data Visualization",
        ],
    ),

    Job(
        title="Python Developer",
        company="Software Labs",
        description=(
            "Develop backend applications and REST APIs using Python. "
            "Experience with FastAPI, databases, SQL, Git and software "
            "development practices is required."
        ),
        required_skills=[
            "Python",
            "FastAPI",
            "REST API",
            "SQL",
            "Git",
            "MongoDB",
        ],
    ),
]


# --------------------------------------------------
# Create Job
# --------------------------------------------------

@router.post("/")
def create_job(job: Job):

    jobs.append(job)

    return {
        "message": "Job added successfully",
        "job": job,
    }


# --------------------------------------------------
# Get All Jobs
# --------------------------------------------------

@router.get("/")
def get_jobs():

    return {
        "jobs": jobs,
    }


# --------------------------------------------------
# Match Resume With Job
# --------------------------------------------------

@router.post("/match")
async def match_resume_to_job(
    job_index: int,
    file: UploadFile = File(...),
):

    # Validate file
    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported.",
        )

    # Validate job index
    if job_index < 0 or job_index >= len(jobs):
        raise HTTPException(
            status_code=404,
            detail="Job not found.",
        )

    # Create upload directory
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)

    file_path = os.path.join(upload_dir, file.filename)

    # Save uploaded resume
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:

        # --------------------------------------------------
        # Extract Resume Text
        # --------------------------------------------------

        resume_text = extract_resume_text(file_path)

        # --------------------------------------------------
        # Get Selected Job
        # --------------------------------------------------

        job = jobs[job_index]

        # --------------------------------------------------
        # Calculate Semantic Match Score
        # --------------------------------------------------

        match_score = calculate_match_score(
            resume_text,
            job.description,
        )

        # --------------------------------------------------
        # Extract Resume Skills
        # --------------------------------------------------

        resume_skills = extract_skills(resume_text)

        # Normalize skills
        resume_skill_set = {
            skill.lower().strip()
            for skill in resume_skills
        }

        job_skill_set = {
            skill.lower().strip()
            for skill in job.required_skills
        }

        # --------------------------------------------------
        # Find Matched Skills
        # --------------------------------------------------

        matched_skills = sorted(
            resume_skill_set.intersection(job_skill_set)
        )

        # --------------------------------------------------
        # Find Missing Skills
        # --------------------------------------------------

        missing_skills = sorted(
            job_skill_set - resume_skill_set
        )

        # --------------------------------------------------
        # Return Result
        # --------------------------------------------------

        return {
            "job_title": job.title,
            "company": job.company,
            "match_score": round(float(match_score)),
            "matched_skills": matched_skills,
            "missing_skills": missing_skills,
        }

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Job matching failed: {str(e)}",
        )

    finally:

        # Remove temporary uploaded file
        if os.path.exists(file_path):
            os.remove(file_path)