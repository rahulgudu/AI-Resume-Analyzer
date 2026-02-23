// import React from "react";

// interface ATSProps {
//   score: number;
//   improvements?: string[];
//   feedback?: string;
// }

// const ATS: React.FC<ATSProps> = ({ score, improvements, feedback }) => {
//   // Determine background gradient based on score
//   const gradientClass =
//     score > 69
//       ? "from-green-100"
//       : score > 49
//         ? "from-yellow-100"
//         : "from-red-100";

//   // Determine icon based on score
//   const iconSrc =
//     score > 69
//       ? "/icons/ats-good.svg"
//       : score > 49
//         ? "/icons/ats-warning.svg"
//         : "/icons/ats-bad.svg";

//   // Determine subtitle based on score
//   const subtitle =
//     score > 69 ? "Great Job!" : score > 49 ? "Good Start" : "Needs Improvement";

//   // Check if feedback has numbered points like "1) ..."
//   const hasNumberedPoints = /\d+[.)]/.test(feedback || "");

//   let intro = "";
//   let points: string[] = [];

//   if (hasNumberedPoints && feedback) {
//     const split = feedback.split(/\s*\d+[.)]\s/);
//     intro = split[0];
//     points = split.slice(1);
//   }

//   return (
//     <div
//       className={`bg-linear-to-b ${gradientClass} to-white rounded-2xl shadow-md w-full p-6`}>
//       {/* Top section with icon and headline */}
//       <div className="flex items-center gap-4 mb-6">
//         <img src={iconSrc} alt="ATS Score Icon" className="w-12 h-12" />
//         <div>
//           <h2 className="text-2xl font-bold">ATS Score - {score}/100</h2>
//         </div>
//       </div>

//       {/* Subtitle */}
//       <h3 className="text-xl font-semibold mb-4">{subtitle}</h3>

//       {/* Feedback Section */}
//       <div className="text-gray-600 mb-6">
//         {hasNumberedPoints ? (
//           <>
//             {intro && <p className="mb-2">{intro.trim()}</p>}
//             <ol className="list-decimal list-inside space-y-2">
//               {points.map((point, index) => (
//                 <li key={index}>{point.trim()}</li>
//               ))}
//             </ol>
//           </>
//         ) : (
//           <p>{feedback}</p>
//         )}
//       </div>

//       {/* Suggestions */}
//       {improvements && improvements.length > 0 && (
//         <div className="space-y-3 mb-6">
//           {improvements.map((suggestion, index) => (
//             <div key={index} className="flex items-start gap-3">
//               <img
//                 src={"/icons/warning.svg"}
//                 alt={"Warning"}
//                 className="w-5 h-5 mt-1"
//               />
//               <p className={"text-amber-700"}>{suggestion}</p>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Closing encouragement */}
//       <p className="text-gray-700 italic">
//         Keep refining your resume to improve your chances of getting past ATS
//         filters and into the hands of recruiters.
//       </p>
//     </div>
//   );
// };

// export default ATS;



import React from "react";

interface ATSProps {
  score: number;
  feedback?: string;
  improvements?: string[];
  label?: string; // allows reuse (e.g., "ATS Score", "Job Match Score")
}

const ATS: React.FC<ATSProps> = ({
  score,
  feedback,
  improvements = [],
  label = "ATS Score",
}) => {
  /* ---------------- Score Classification ---------------- */

  const getScoreMeta = (score: number) => {
    if (score >= 80) {
      return {
        gradient: "from-green-100",
        icon: "/icons/ats-good.svg",
        subtitle: "Excellent Optimization",
        accentText: "text-green-700",
      };
    }

    if (score >= 60) {
      return {
        gradient: "from-yellow-100",
        icon: "/icons/ats-warning.svg",
        subtitle: "Good Foundation",
        accentText: "text-yellow-700",
      };
    }

    return {
      gradient: "from-red-100",
      icon: "/icons/ats-bad.svg",
      subtitle: "Needs Improvement",
      accentText: "text-red-700",
    };
  };

  const { gradient, icon, subtitle, accentText } = getScoreMeta(score);

  /* ---------------- Numbered Feedback Parsing ---------------- */

  const parseFeedback = (text?: string) => {
    if (!text) return { intro: "", points: [] };

    const hasNumbers = /\d+[.)]/.test(text);

    if (!hasNumbers) {
      return { intro: text, points: [] };
    }

    const split = text.split(/\s*\d+[.)]\s/);
    return {
      intro: split[0]?.trim(),
      points: split.slice(1).map((p) => p.trim()),
    };
  };

  const { intro, points } = parseFeedback(feedback);

  /* ---------------- UI ---------------- */

  return (
    <div
      className={`bg-gradient-to-b ${gradient} to-white rounded-2xl shadow-md w-full p-8 transition-all`}
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <img src={icon} alt="Score Icon" className="w-12 h-12" />
        <div>
          <h2 className="text-2xl font-bold">
            {label} — {score}/100
          </h2>
          <p className={`text-sm font-medium ${accentText}`}>
            {subtitle}
          </p>
        </div>
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="text-gray-700 mb-6 space-y-3">
          {intro && <p>{intro}</p>}

          {points.length > 0 && (
            <ol className="list-decimal list-inside space-y-2">
              {points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ol>
          )}
        </div>
      )}

      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="bg-white border rounded-xl p-4 mb-6 space-y-3">
          <h4 className="font-semibold text-gray-800">
            Suggested Improvements
          </h4>

          {improvements.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <img
                src="/icons/warning.svg"
                alt="Suggestion"
                className="w-5 h-5 mt-1"
              />
              <p className="text-amber-700">{item}</p>
            </div>
          ))}
        </div>
      )}

      {/* Encouragement */}
      <p className="text-gray-600 italic text-sm">
        Continue refining your resume to maximize visibility in automated
        screening systems and improve recruiter engagement.
      </p>
    </div>
  );
};

export default ATS;