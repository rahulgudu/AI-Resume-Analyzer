// import React, { useEffect, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router";
// import ATS from "~/components/ATS";
// import Details from "~/components/Details";
// import Summary from "~/components/Summary";
// import { usePuterStore } from "~/lib/puter";
// export const meta = () => [
//   { title: "Resumind | Review" },
//   { name: "description", content: "Detalied Overview" },
// ];
// const Resume = () => {
//   const { auth, isLoading, fs, kv } = usePuterStore();
//   const [imageUrl, setImageUrl] = useState("");
//   const [resumeUrl, setResumeUrl] = useState("");
//   const [feedback, setFeedback] = useState<Feedback | null>(null);
//   const navigate = useNavigate();
//   const { id } = useParams();

//   useEffect(() => {
//     if (!isLoading && !auth.isAuthenticated) {
//       navigate(`/auth?next=/resume/${id}`);
//     }
//   }, [isLoading]);
//   useEffect(() => {
//     const loadResume = async () => {
//       const resume = await kv.get(`resume:${id}`);

//       if (!resume) return;

//       const data = JSON.parse(resume);

//       const resumeBlob = await fs.read(data.resumePath);
//       if (!resumeBlob) return;

//       const pdfBlob = new Blob([resumeBlob], { type: "application/pdf" });
//       const resumeUrl = URL.createObjectURL(pdfBlob);
//       setResumeUrl(resumeUrl);

//       const imageBlob = await fs.read(data.imagePath);
//       if (!imageBlob) return;
//       const imageUrl = URL.createObjectURL(imageBlob);
//       setImageUrl(imageUrl);

//       setFeedback(data.feedback);
//       console.log({ resumeUrl, imageUrl, feedback: data.feedback });
//     };

//     loadResume();
//   }, [id]);
//   return (
//     <main className="pt-0!">
//       <nav className="resume-nav">
//         <Link to={"/"} className="back-button">
//           <img src="/icons/back.svg" alt="logo" className="w-2.5 h-2.5" />
//           <span className="text-gray-800 text-sm font-semibold">
//             Back to Homepage
//           </span>
//         </Link>
//       </nav>

//       <div className="flex flex-row w-full max-lg:flex-col-reverse">
//         <section className="feedback-section bg-[url('/images/bg-small.svg') bg-cover h-[100vh] sticky top-0 items-center justify-center">
//           {imageUrl && resumeUrl && (
//             <div className="animate-in fade-in duration-1000 gradient-border max-sm:m-0 h-[90%] max-wxl:h-fit w-fit">
//               <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
//                 <img
//                   src={imageUrl}
//                   className="w-full h-full object-contain rounded-2xl"
//                   title="resume"
//                 />
//               </a>
//             </div>
//           )}
//         </section>

//         <section className="feedback-section">
//           <h2 className="text-4xl text-black! font-bold">Resume Review</h2>
//           {feedback ? (
//             <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
//               <Summary feedback={feedback} />
//               <ATS
//                 score={feedback?.sections?.ats_ompatibility?.score || 0}
//                 improvements={feedback?.sections?.atsCompatibility?.improvements || []}
//                 feedback={feedback?.sections?.atsCompatibility?.feedback}
//               />
//               {/* <Details feedback={feedback} /> */}
//             </div>
//           ) : (
//             <img
//               src="/images/resume-scan-2.gif"
//               alt="resume"
//               className="w-full"
//             />
//           )}
//         </section>
//       </div>
//     </main>
//   );
// };

// export default Resume;

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import ATS from "~/components/ATS";
import Details from "~/components/Details";
import Summary from "~/components/Summary";
import { usePuterStore } from "~/lib/puter";

export const meta = () => [
  { title: "Resumind | Review" },
  { name: "description", content: "Detailed Overview" },
];

const Resume = () => {
  const { auth, isLoading, fs, kv } = usePuterStore();
  const navigate = useNavigate();
  const { id } = useParams();

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [resumeUrl, setResumeUrl] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loading, setLoading] = useState(true);

  /* ============================================================
     Redirect if not authenticated
  ============================================================ */

  useEffect(() => {
    if (!isLoading && !auth.isAuthenticated) {
      navigate(`/auth?next=/resume/${id}`);
    }
  }, [isLoading, auth.isAuthenticated, navigate, id]);

  /* ============================================================
     Load Resume Data
  ============================================================ */

  useEffect(() => {
    if (!id) return;

    const loadResume = async () => {
      try {
        setLoading(true);

        const stored = await kv.get(`resume:${id}`);
        if (!stored) return;

        const data = JSON.parse(stored);

        /* ---------- Load Resume PDF ---------- */
        const resumeBlob = await fs.read(data.assets.filePath);
        if (resumeBlob) {
          const pdfBlob = new Blob([resumeBlob], {
            type: "application/pdf",
          });
          const pdfUrl = URL.createObjectURL(pdfBlob);
          setResumeUrl(pdfUrl);
        }

        /* ---------- Load Preview Image ---------- */
        const imageBlob = await fs.read(data.assets.previewImage);
        if (imageBlob) {
          const imgUrl = URL.createObjectURL(imageBlob);
          setImageUrl(imgUrl);
        }

        setFeedback(data.feedback);
      } catch (error) {
        console.error("Failed to load resume:", error);
      } finally {
        setLoading(false);
      }
    };

    loadResume();

    /* ---------- Cleanup Object URLs ---------- */
    return () => {
      if (resumeUrl) URL.revokeObjectURL(resumeUrl);
      if (imageUrl) URL.revokeObjectURL(imageUrl);
    };
  }, [id]);

  /* ============================================================
     Find ATS Section Dynamically
  ============================================================ */

  const sectionsArray = Array.isArray(feedback?.sections)
    ? feedback.sections
    : feedback?.sections
      ? Object.entries(feedback.sections).map(([key, value]: any) => ({
          id: key,
          title: key
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l: string) => l.toUpperCase()),
          ...value,
        }))
      : [];

  const atsSection = sectionsArray.find((s) =>
    s.id.toLowerCase().includes("ats"),
  );

  return (
    <main>
      {/* Top Nav */}
      <nav className="resume-nav">
        <Link to="/" className="back-button">
          <img src="/icons/back.svg" alt="back" className="w-2.5 h-2.5" />
          <span className="text-gray-800 text-sm font-semibold">
            Back to Homepage
          </span>
        </Link>
      </nav>

      <div className="flex flex-row w-full max-lg:flex-col-reverse">
        {/* Left Preview Panel */}
        <section className="bg-[url('/images/bg-small.svg')] bg-cover h-screen sticky top-0 flex items-center justify-center p-6">
          {imageUrl && resumeUrl && (
            <div className="animate-in fade-in duration-1000 gradient-border h-[90%] w-fit">
              <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                <img
                  src={imageUrl}
                  className="h-full object-contain rounded-2xl"
                  alt="Resume Preview"
                />
              </a>
            </div>
          )}
        </section>

        {/* Right Feedback Panel */}
        <section className="flex-1 p-10">
          <h2 className="text-4xl font-bold mb-8">Resume Review</h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <img
                src="/images/resume-scan-2.gif"
                alt="Loading"
                className="h-40 w-auto object-contain"
              />
            </div>
          ) : feedback ? (
            <div className="flex flex-col gap-10 animate-in fade-in duration-1000">
              {/* Summary */}
              <Summary feedback={feedback} />

              {/* ATS (if exists) */}
              {atsSection && (
                <ATS
                  score={atsSection.score}
                  feedback={atsSection.feedback}
                  improvements={atsSection.improvements}
                />
              )}

              {/* All Sections */}
              <Details feedback={feedback} />
            </div>
          ) : (
            <p className="text-gray-500">
              No feedback available for this resume.
            </p>
          )}
        </section>
      </div>
    </main>
  );
};

export default Resume;
