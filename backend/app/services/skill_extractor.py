TECHNICAL_SKILLS = {
    "python", "java", "c++", "c", "javascript", "typescript",
    "react", "node.js", "fastapi", "django",
    "machine learning", "deep learning", "artificial intelligence",
    "tensorflow", "pytorch", "scikit-learn",
    "nlp", "natural language processing",
    "sql", "mysql", "postgresql",
    "mongodb", "git", "github",
    "docker", "aws", "azure",
    "pandas", "numpy", "matplotlib",
    "power bi", "tableau",
    "rest api", "html", "css",
    "tailwind css", "flask"
}


def extract_skills(text: str) -> list[str]:
    text_lower = text.lower()

    found_skills = []

    for skill in TECHNICAL_SKILLS:
        if skill in text_lower:
            found_skills.append(skill)

    return sorted(found_skills)