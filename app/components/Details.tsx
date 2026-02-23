import { cn } from "~/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
} from "./Accordin";

/* ============================================================
   Score Badge
============================================================ */

const getScoreStyles = (score: number) => {
  if (score >= 70) {
    return {
      bg: "bg-green-100",
      text: "text-green-700",
      icon: "/icons/check.svg",
    };
  }

  if (score >= 60) {
    return {
      bg: "bg-yellow-100",
      text: "text-yellow-700",
      icon: "/icons/warning.svg",
    };
  }

  return {
    bg: "bg-red-100",
    text: "text-red-700",
    icon: "/icons/warning.svg",
  };
};

const ScoreBadge = ({ score }: { score: number }) => {
  const { bg, text, icon } = getScoreStyles(score);

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium",
        bg,
        text,
      )}>
      <img src={icon} alt="score icon" className="size-4" />
      {score}/100
    </div>
  );
};

/* ============================================================
   Section Header
============================================================ */

const CategoryHeader = ({
  title,
  categoryScore,
}: {
  title: string;
  categoryScore: number;
}) => {
  return (
    <div className="flex items-center justify-between w-full py-4">
      <p className="text-xl font-semibold tracking-tight">{title}</p>
      <ScoreBadge score={categoryScore} />
    </div>
  );
};

/* ============================================================
   Section Content
============================================================ */

const CategoryContent = ({
  improvements = [],
  feedback,
}: {
  improvements?: string[];
  feedback?: string;
}) => {
  /* -------- Parse numbered feedback -------- */

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

  return (
    <div className="flex flex-col gap-6 w-full pb-4">
      {/* Improvements */}
      {improvements.length > 0 && (
        <div className="bg-gray-50 rounded-xl p-5 border space-y-3">
          <h4 className="font-semibold text-gray-800">
            Suggested Improvements
          </h4>

          {improvements.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <img
                src="/icons/warning.svg"
                alt="suggestion"
                className="w-5 h-5 mt-1"
              />
              <p className="text-gray-700">{item}</p>
            </div>
          ))}
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div className="bg-white border rounded-xl p-5 space-y-3">
          <h4 className="font-semibold text-gray-800">Detailed Feedback</h4>

          {intro && <p className="text-gray-700">{intro}</p>}

          {points.length > 0 && (
            <ol className="list-decimal list-inside space-y-2 text-gray-700">
              {points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ol>
          )}
        </div>
      )}
    </div>
  );
};

/* ============================================================
   Main Details Component
============================================================ */

const Details = ({ feedback }: { feedback: Feedback }) => {
  const sectionsArray = Array.isArray(feedback.sections)
    ? feedback.sections
    : Object.entries(feedback.sections || {}).map(([key, value]: any) => ({
        id: key,
        title: key
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l: string) => l.toUpperCase()),
        ...value,
      }));
  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Top Summary */}
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Application Review</h2>
        <ScoreBadge score={feedback.overallScore} />
      </div>

      {/* Sections */}
      <Accordion>
        {sectionsArray.map((section: any) => (
          <AccordionItem
            key={section.id}
            id={section.id}
            className="border rounded-2xl px-4 bg-white shadow-sm hover:shadow-md transition">
            <AccordionHeader itemId={section.id}>
              <CategoryHeader
                title={section.title}
                categoryScore={section.score}
              />
            </AccordionHeader>

            <AccordionContent itemId={section.id}>
              <CategoryContent
                improvements={section.improvements}
                feedback={section.feedback}
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default Details;
