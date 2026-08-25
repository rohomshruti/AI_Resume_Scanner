from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# Load model once when the server starts
model = SentenceTransformer("all-MiniLM-L6-v2")


def calculate_match_score(resume_text: str, job_description: str) -> float:

    resume_embedding = model.encode([resume_text])
    job_embedding = model.encode([job_description])

    similarity = cosine_similarity(
        resume_embedding,
        job_embedding
    )[0][0]

    score = round(float(similarity) * 100, 2)

    return score