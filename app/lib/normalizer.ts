export const normalizeFeedback = (raw: any): NormalizedFeedback => {
  return {
    overallScore: raw.overall_score ?? raw.overallScore ?? 0,
    sections: {
      professionalSummary: raw.sections?.professional_summary ??
        raw.sections?.professionalSummary ?? { score: 0, feedback: "" },
      experience: raw.sections?.experience ?? { score: 0, feedback: "" },
      technicalSkills: raw.sections?.technical_skills ??
        raw.sections?.technicalSkills ?? { score: 0, feedback: "" },
      education: raw.sections?.education ?? { score: 0, feedback: "" },
      projects: raw.sections?.projects ?? { score: 0, feedback: "" },
      atsCompatibility: raw.sections?.ats_compatibility ??
        raw.sections?.atsCompatibility ?? {
          score: 0,
          feedback: "",
          improvements:
            raw.topImprovements ?? raw.suggesstions ?? raw.improvements ?? [],
        },
    },
    criticalIssues: raw.critical_issues ?? [],
    strengths: raw.strengths ?? [],
    overallRecommendation:
      raw.overall_recommendation ?? raw.overallRecommendation ?? "",
  };
};
