import os
import shutil

from fastapi import APIRouter, File, UploadFile, HTTPException

from app.services.parser import extract_resume_text, extract_resume_sections
from app.services.skill_extractor import extract_skills


router = APIRouter(prefix="/resume", tags=["Resume"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/upload")
async def upload_resume(file: UploadFile = File(...)):

    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        text = extract_resume_text(file_path)
        skills = extract_skills(text)
        sections = extract_resume_sections(text)

        return {
            "filename": file.filename,
            "message": "Resume uploaded successfully",
            "skills": skills,
            "education": sections["education"],
            "experience": sections["experience"],
            "projects": sections["projects"],
            "certifications": sections["certifications"],
            "text": text
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )