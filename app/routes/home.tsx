import Navbar from "~/components/Navbar";
import type { Route } from "./+types/home";
import ResumeCard from "~/components/ResumeCard";
// import { resumes } from "constants";
import { usePuterStore } from "~/lib/puter";
import { Link, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Resumind" },
    { name: "description", content: "Smart feedback for your dream job" },
  ];
}

export default function Home() {
  const { kv, auth } = usePuterStore();
  const location = useLocation();
  const [resumes, setResumes] = useState<any>([]);
  const [loadingResumes, setLoadingResumes] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    if (!auth.isAuthenticated) {
      navigate("/auth?next=/");
    }
  }, [auth.isAuthenticated]);

  useEffect(() => {
    const loadResumes = async () => {
      setLoadingResumes(true);
      try {
        const resumes = (await kv.list("resume:*", true)) as KVItem[];

        const parsedResumes = resumes
          .map((resume) => {
            if (!resume.value) return null;

            // If it's a string, try parsing it
            if (typeof resume.value === "string") {
              try {
                return JSON.parse(resume.value);
              } catch (err) {
                console.error("Failed to parse resume:", resume.value, err);
                return null; // skip invalid JSON
              }
            }

            // If it's already an object, return as-is
            if (typeof resume.value === "object") {
              return resume.value;
            }

            // If it's neither, skip
            return null;
          })
          .filter(Boolean); // remove nulls

        console.log("parsed resumes:", parsedResumes);
        setResumes(parsedResumes);
      } catch (err) {
        console.error("Error loading resumes:", err);
      } finally {
        setLoadingResumes(false);
      }
    };

    loadResumes();
  }, []);

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover">
      <Navbar />
      <section className="main-section">
        <div className="page-heading py-16">
          <h1>Track Your Applications & Resume Ratings</h1>

          {!loadingResumes && resumes.length === 0 ? (
            <h2>No resumes found. Upload your first resume to get feedback.</h2>
          ) : (
            <h2>Review your submissions and check AI-powered feedback</h2>
          )}
        </div>

        {loadingResumes && (
          <div>
            <img src="/images/resume-scan-2.gif" alt="" className="w-50" />
          </div>
        )}

        {!loadingResumes && resumes?.length > 0 && (
          <div className="resumes-section">
            {resumes?.map((resume: any) => (
              <ResumeCard key={resume.id} resume={resume} />
            ))}
          </div>
        )}

        {!loadingResumes && resumes?.length === 0 && (
          <div className="flex flex-col items-center justify-center mt-10 gap-4">
            <Link
              to="/upload"
              className="primary-button w-fit text-xl font-semibold">
              Upload Resume
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
