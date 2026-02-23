import React from "react";
import ScoreGage from "./ScoreGage";
import ScoreBadge from "./ScoreBadge";

const Category = ({ title, score }: { title: string; score: number }) => {
  const textColor =
    score > 70
      ? "text-green-600"
      : score > 60
        ? "text-yellow-600"
        : "text-red-600";

  return (
    <div className="resume-summary">
      <div className="category">
        <div className="flex flex-row gap-2 items-center justify-center">
          <p className="text-2xl">{title}</p>
          <ScoreBadge score={score} />
        </div>
        <p className="text-2xl">
          <span className={textColor}>{score}</span>/100
        </p>
      </div>
    </div>
  );
};

const Summary = ({ feedback }: { feedback: Feedback }) => {
  console.log("Feedback", feedback);
  const sectionEntries = Object.entries(feedback.sections);

  return (
    <div className="bg-white rounded-2xl shadow-md  w-full">
      <div className="flex flex-row items-center p-4 gap-8">
        <ScoreGage score={feedback?.overallScore} />

        <div className="flex flex-col gap-2">
          <h2 className="text-2xl font-bold">Your Resume Score</h2>
          <p className="text-sm text-gray-500">
            This score is calculated based on the variables listed below.
          </p>
        </div>
      </div>
      {sectionEntries.map(([key, value]) => (
        <Category
          key={key}
          title={key
            // Insert space before capital letters
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            // Capitalize each word
            .replace(/\b\w/g, (c) => c.toUpperCase())}
          score={value.score}
        />
      ))}
    </div>
  );
};

export default Summary;
