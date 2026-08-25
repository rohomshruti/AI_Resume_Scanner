import os
import shutil

from fastapi import APIRouter, File, UploadFile, HTTPException

from app.services.parser import extract_resume_text, extract_resume_sections
from app.services.skill_extractor import extract_skills


router = APIRouter(prefix="/analysis", tags=["Analysis"])

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.post("/analyze")
async def analyze_resume(file: UploadFile = File(...)):

    if not file.filename.lower().endswith((".pdf", ".docx")):
        raise HTTPException(
            status_code=400,
            detail="Only PDF and DOCX files are supported."
        )

    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        # Extract resume text
        text = extract_resume_text(file_path)

        # Extract skills
        skills = extract_skills(text)

        # Extract resume sections
        sections = extract_resume_sections(text)

        # -----------------------------
        # ATS / Resume Score
        # -----------------------------

        # Skills - 25 points
        skill_score = min(len(skills) * 2, 25)

        # Education - 15 points
        education_score = 15 if sections["education"] else 0

        # Projects - 25 points
        project_count = len(sections["projects"])

        if project_count >= 3:
            project_score = 25
        elif project_count == 2:
            project_score = 20
        elif project_count == 1:
            project_score = 12
        else:
            project_score = 0

        # Experience - 15 points
        experience_score = 15 if sections["experience"] else 0

        # Certifications - 10 points
        certification_score = min(
            len(sections["certifications"]) * 5,
            10
        )

        # Achievements - 10 points
        achievement_score = min(
            len(sections["achievements"]) * 2,
            10
        )

        # Final score
        score = min(
            skill_score
            + education_score
            + project_score
            + experience_score
            + certification_score
            + achievement_score,
            100
        )

        # Score label
        if score >= 85:
            score_label = "Excellent"
        elif score >= 70:
            score_label = "Good"
        elif score >= 50:
            score_label = "Average"
        else:
            score_label = "Needs Improvement"

        # -----------------------------
        # Return complete analysis
        # -----------------------------

        return {
            "filename": file.filename,
            "message": "Resume analyzed successfully",

            "resume_score": score,
            "score_label": score_label,

            "score_breakdown": {
                "skills": skill_score,
                "education": education_score,
                "projects": project_score,
                "experience": experience_score,
                "certifications": certification_score,
                "achievements": achievement_score
            },

            "skills_count": len(skills),
            "skills": skills,

            "education": sections["education"],
            "experience": sections["experience"],
            "projects": sections["projects"],
            "certifications": sections["certifications"],
            "achievements": sections["achievements"],

            "text": text
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )