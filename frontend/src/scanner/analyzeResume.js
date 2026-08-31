const API_URL = "https://resumeiq-backend-lv1q.onrender.com";
export async function analyzeResume(file) {
  // --------------------------------------------------
  // 1. Analyze resume
  // --------------------------------------------------

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_URL}/analysis/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || "Failed to analyze resume");
  }

  const data = await response.json();

  const breakdown = data.score_breakdown || {};

  // --------------------------------------------------
  // 2. Get available jobs
  // --------------------------------------------------

  const jobsResponse = await fetch(`${API_URL}/jobs/`);

  if (!jobsResponse.ok) {
    throw new Error("Failed to load jobs");
  }

  const jobsData = await jobsResponse.json();

  const availableJobs = jobsData.jobs || [];

  // --------------------------------------------------
  // 3. Match resume against every job
  // --------------------------------------------------

  const matchedJobs = await Promise.all(
    availableJobs.map(async (job, index) => {
      try {
        const matchForm = new FormData();

        matchForm.append("file", file);

        const matchResponse = await fetch(
          `${API_URL}/jobs/match?job_index=${index}`,
          {
            method: "POST",
            body: matchForm,
          }
        );

        if (!matchResponse.ok) {
          console.error(
            `Failed to match job ${index}:`,
            await matchResponse.text()
          );

          return null;
        }

        const matchData = await matchResponse.json();

        return {
          title: matchData.job_title,
          company: matchData.company,

          // Job matching score
          score: Number(matchData.match_score) || 0,

          // Skills present in resume
          matchedSkills: matchData.matched_skills || [],

          // Skills missing from resume
          missingSkills: matchData.missing_skills || [],
        };
      } catch (error) {
        console.error(`Error matching job ${index}:`, error);

        return null;
      }
    })
  );

  // --------------------------------------------------
  // 4. Remove failed matches
  //    and sort highest score first
  // --------------------------------------------------

  const validJobs = matchedJobs
    .filter(Boolean)
    .sort((a, b) => b.score - a.score);

  // --------------------------------------------------
  // 5. Take top 5 recommended jobs
  // --------------------------------------------------

  const recommendedJobs = validJobs.slice(0, 5);

  // --------------------------------------------------
  // // 6. Calculate best job matching score
  // --------------------------------------------------

  const jobMatchScore =
  validJobs.length > 0
    ? Math.max(...validJobs.map((job) => job.score))
    : 0;

  // --------------------------------------------------
  // 7. Prepare dashboard metrics
  // --------------------------------------------------

  const metrics = [
    {
      label: "Keyword & ATS Optimization",
      value: Math.min(
        100,
        (breakdown.skills || 0) * 4
      ),
    },

    {
      label: "Experience Depth",
      value: breakdown.experience
        ? Math.min(
            100,
            Math.round(
              (breakdown.experience / 15) * 100
            )
          )
        : 0,
    },

    {
      label: "Formatting & Readability",
      value: 75,
    },

    {
      label: "Impact & Quantified Results",
      value: Math.min(
        100,
        (breakdown.projects || 0) * 4
      ),
    },

    {
      label: "Education & Certifications",
      value: Math.min(
        100,
        Math.round(
          (
            ((breakdown.education || 0) +
              (breakdown.certifications || 0)) /
            25
          ) * 100
        )
      ),
    },
  ];

  // --------------------------------------------------
  // 8. Return complete dashboard result
  // --------------------------------------------------

  return {
    // File information
    fileName: data.filename,
    fileSize: file.size,

    // Overall resume score
    score: data.resume_score,

    //  Best job matching score
    jobMatchScore,

    // Dashboard metrics
    metrics,

    // Extracted skills
    skills: data.skills || [],

    // Resume summary
    summary: `Your resume received a score of ${data.resume_score}/100 and was rated "${data.score_label}".`,

    // Extracted resume text
    extracted: data.text || "",

    // Resume sections
    education: data.education || [],
    experience: data.experience || [],
    projects: data.projects || [],
    certifications: data.certifications || [],
    achievements: data.achievements || [],

    // Recommended jobs
    jobs: recommendedJobs,

    // Experience
    yearsExperience: breakdown.experience || 0,

    // ATS status
    atsSafe: data.resume_score >= 70,
  };
}
