import re
import pymupdf
from docx import Document


def extract_text_from_pdf(file_path: str) -> str:
    text = ""

    document = pymupdf.open(file_path)

    for page in document:
        text += page.get_text()

    document.close()

    return text


def extract_text_from_docx(file_path: str) -> str:
    document = Document(file_path)

    return "\n".join(
        paragraph.text
        for paragraph in document.paragraphs
    )


def extract_resume_text(file_path: str) -> str:
    if file_path.lower().endswith(".pdf"):
        return extract_text_from_pdf(file_path)

    if file_path.lower().endswith(".docx"):
        return extract_text_from_docx(file_path)

    raise ValueError("Only PDF and DOCX files are supported.")


def clean_line(line: str) -> str:
    line = line.strip()

    # Remove repeated spaces
    line = re.sub(r"\s+", " ", line)

    return line


def extract_resume_sections(text: str) -> dict:

    sections = {
        "education": [],
        "experience": [],
        "projects": [],
        "certifications": [],
        "achievements": []
    }

    current_section = None

    section_map = {
        "education": "education",
        "academic background": "education",
        "academic qualification": "education",

        "experience": "experience",
        "work experience": "experience",
        "professional experience": "experience",

        "projects": "projects",
        "academic projects": "projects",
        "personal projects": "projects",

        "certifications": "certifications",
        "certificates": "certifications",
        "certification": "certifications",

        "achievements": "achievements",
        "accomplishments": "achievements"
    }

    ignored_sections = {
        "skills",
        "technical skills",
        "core subjects and concepts",
        "summary",
        "profile",
        "objective",
        "contact",
        "interests",
        "hobbies"
    }

    for raw_line in text.splitlines():

        line = clean_line(raw_line)

        if not line:
            continue

        heading = line.lower().replace("•", "").strip()

        # Detect section heading
        if heading in section_map:
            current_section = section_map[heading]
            continue

        # Stop collecting for ignored sections
        if heading in ignored_sections:
            current_section = None
            continue

        if current_section:
            sections[current_section].append(line)

    # Extract certifications from achievements
    certification_keywords = [
        "certificate",
        "certification",
        "nptel",
        "coursera",
        "udemy"
    ]

    achievement_items = []

    for item in sections["achievements"]:

        item_lower = item.lower()

        if any(keyword in item_lower for keyword in certification_keywords):
            sections["certifications"].append(item)
        else:
            achievement_items.append(item)

    sections["achievements"] = achievement_items

    return sections