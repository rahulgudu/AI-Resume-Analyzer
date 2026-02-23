// interface Job {
//   title: string;
//   description: string;
//   location: string;
//   requiredSkills: string[];
// }

// interface Resume {
//   id: string;
//   companyName?: string;
//   jobTitle?: string;
//   imagePath: string;
//   resumePath: string;
//   feedback: Feedback;
// }

// interface Feedback {
//   overallScore: number;
//   job_match_score: number;
//   job_match_feedback: string;

//   critical_issues: string[];
//   recommended_additions: string[];

//   sections: {
//     atsCompatibility: SectionDetail;
//     certifications: SectionDetail;
//     education: SectionDetail;
//     experience: SectionDetail;
//     formatting: SectionDetail;
//     leadership: SectionDetail;
//     professional_summary: SectionDetail;
//     projects: SectionDetail;
//     technical_skills: SectionDetail;
//   };
// }
// interface SectionDetail {
//   score: number;
//   feedback: string;
//   improvements: string[];
// }

// interface NormalizedFeedback {
//   overallScore: number;
//   sections: {
//     professionalSummary: { score: number; feedback: string };
//     experience: { score: number; feedback: string };
//     technicalSkills: { score: number; feedback: string };
//     education: { score: number; feedback: string };
//     projects: { score: number; feedback: string };
//     atsCompatibility: { score: number; feedback: string; improvements: string[] };
//   };
//   criticalIssues: string[];
//   strengths: string[];
//   overallRecommendation: string;
// }


/* ============================================================
   Job Types
============================================================ */

 type JobType =
  | "technical"
  | "marketing"
  | "sales"
  | "design"
  | "hr"
  | "finance"
  | "operations"
  | "other";

 type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship"
  | "Freelance";

/* ============================================================
   Job Interface
============================================================ */

 interface Job {
  id: string;
  title: string;
  department?: string;
  location: string;

  employmentType?: EmploymentType;
  jobType?: JobType;

  description: string;
  responsibilities?: string[];

  requiredSkills: string[];
  preferredSkills?: string[];

  createdAt?: string;
  updatedAt?: string;
}

/* ============================================================
   Feedback Section (Dynamic + Role-Agnostic)
============================================================ */

 interface FeedbackSection {
  id: string; // unique key: "experience", "leadership", etc.
  title: string; // UI display name
  score: number; // 0–100

  feedback: string;
  improvements?: string[];
}

/* ============================================================
   Main Feedback Model (Universal)
============================================================ */

 interface Feedback {
  overallScore: number;

  jobMatch: {
    score: number;
    feedback: string;
  };

  criticalIssues?: string[];
  recommendedAdditions?: string[];
  strengths?: string[];

  sections: FeedbackSection[];

  overallRecommendation?: string;

  createdAt?: string;
}

/* ============================================================
   Resume Model
============================================================ */

interface Resume {
  id: string;

  candidateName?: string;
  companyName?: string;
  jobTitle?: string;

  jobType?: JobType;

  assets: {
    previewImage: string;
    filePath: string;
  };

  feedback: Feedback;

  createdAt?: string;
  updatedAt?: string;
}

/* ============================================================
   Legacy AI Response (Optional – For Normalization Only)
   Keep only if your backend still returns old structure.
============================================================ */

interface LegacySectionDetail {
  score: number;
  feedback: string;
  improvements?: string[];
}
interface LegacyFeedback {
  overallScore: number;
  job_match_score: number;
  job_match_feedback: string;

  critical_issues: string[];
  recommended_additions: string[];

  sections: Record<string, LegacySectionDetail>;
}