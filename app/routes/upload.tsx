// import { prepareInstructions } from "constants";
// import React, { useState, type FormEvent } from "react";
// import { useNavigate } from "react-router";
// import FileUploader from "~/components/FileUploader";
// import Navbar from "~/components/Navbar";
// import { normalizeFeedback } from "~/lib/normalizer";
// import { convertPdfToImage } from "~/lib/pdfToImage";
// import { usePuterStore } from "~/lib/puter";
// import { generateUUID } from "~/lib/utils";
// import JOSN5 from "json5";

// const Upload = () => {
//   const { auth, isLoading, fs, ai, kv } = usePuterStore();
//   const navigate = useNavigate();
//   const [isProcessing, setIsProcessing] = useState(false);
//   const [statusText, setStatusText] = useState("");
//   const [file, setFile] = useState<File | null>(null);
//   const handleFileSelect = (file: File | null) => {
//     setFile(file);
//   };

//   const handleAnalyze = async ({
//     companyName,
//     jobTitle,
//     jobDescription,
//     file,
//   }: {
//     companyName: string;
//     jobTitle: string;
//     jobDescription: string;
//     file: File;
//   }) => {
//     setIsProcessing(true);
//     setStatusText("Uploading the file....");
//     const uploadFile = await fs.upload([file]);

//     if (!uploadFile) return setStatusText("Error Failed to upload file");

//     setStatusText("Coverting to image");

//     const imageFile = await convertPdfToImage(file);

//     if (!imageFile.file) {
//       return setStatusText("Error: Failed to convert PDF to image");
//     }

//     setStatusText("Uploading image....");

//     const uploadImage = await fs.upload([imageFile.file]);

//     if (!uploadImage) {
//       return setStatusText("Error: Failed to upload image");
//     }

//     setStatusText("Preparing Data....");

//     const uuid = generateUUID();

//     const data = {
//       id: uuid,
//       resumePath: uploadFile.path,
//       imagePath: uploadImage.path,
//       companyName,
//       jobTitle,
//       jobDescription,
//       feedback: "",
//     };

//     await kv.set(`resume:${uuid}`, JSON.stringify(data));

//     const feedback = await ai.feedback(
//       uploadFile.path,
//       prepareInstructions({ jobTitle, jobDescription }),
//     );
//     if (!feedback) return setStatusText("Error: Failed to analyse resume");

//     let feedBackText =
//       typeof feedback.message.content === "string"
//         ? feedback.message.content
//         : feedback.message.content[0].text;

//     const parsed = JSON.parse(feedBackText);
//     data.feedback = parsed

//     await kv.set(`resume:${uuid}`, JSON.stringify(data));
//     setStatusText("Analysis complete, redirecting");
//     console.log(data);
//     navigate(`/resume/${uuid}`);
//   };

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     const form = e.currentTarget.closest("form");
//     if (!form) return;
//     const formData = new FormData(form);
//     const companyName = formData.get("company-name") as string;
//     const jobTitle = formData.get("job-title") as string;
//     const jobDescription = formData.get("job-description") as string;

//     if (!file) {
//       return;
//     }

//     handleAnalyze({ companyName, jobTitle, jobDescription, file });
//   };
//   return (
//     <main className="bg-[url('/images/bg-main.svg')] bg-cover">
//       <Navbar />
//       <section className="main-section">
//         <div className="page-heading py-16">
//           <h1>Smart feedback for your dream job</h1>
//           {isProcessing ? (
//             <>
//               <h2>{statusText}</h2>
//               <img src="/images/resume-scan.gif" className="w-full" />
//             </>
//           ) : (
//             <>
//               <h2>Drop your resume for an ATS score and improvement tips</h2>
//             </>
//           )}
//           {!isProcessing && (
//             <form
//               id="upload-form"
//               onSubmit={handleSubmit}
//               className="flex flex-col gap-4 mt-8">
//               <div className="form-div">
//                 <label htmlFor="company-name">Company Name</label>
//                 <input
//                   type="text"
//                   name="company-name"
//                   placeholder="Company Name"
//                   className="border border-gray-400"
//                 />
//               </div>
//               <div className="form-div">
//                 <label htmlFor="job-title">Job Title</label>
//                 <input
//                   type="text"
//                   name="job-title"
//                   placeholder="Job Title"
//                   className="border border-gray-400"
//                 />
//               </div>
//               <div className="form-div">
//                 <label htmlFor="job-description">Job Description</label>
//                 <textarea
//                   rows={5}
//                   name="job-description"
//                   placeholder="Job Description"
//                   className="border border-gray-400"
//                 />
//               </div>
//               <div className="form-div">
//                 <label htmlFor="uploader">Upload Resume</label>
//                 <FileUploader onFileSelect={handleFileSelect} />
//               </div>

//               <button className="primary-button" type="submit">
//                 Analyze Resume
//               </button>
//             </form>
//           )}
//         </div>
//       </section>
//     </main>
//   );
// };

// export default Upload;

import { prepareInstructions } from "constants";
import React, { useState, type FormEvent } from "react";
import { useNavigate } from "react-router";
import FileUploader from "~/components/FileUploader";
import Navbar from "~/components/Navbar";
import { normalizeFeedback } from "~/lib/normalizer";
import { convertPdfToImage } from "~/lib/pdfToImage";
import { usePuterStore } from "~/lib/puter";
import { generateUUID } from "~/lib/utils";
import JSON5 from "json5";

const Upload = () => {
  const { fs, ai, kv } = usePuterStore();
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (file: File | null) => {
    setFile(file);
  };

  const handleAnalyze = async ({
    companyName,
    jobTitle,
    jobDescription,
    file,
  }: {
    companyName: string;
    jobTitle: string;
    jobDescription: string;
    file: File;
  }) => {
    try {
      setIsProcessing(true);
      setStatusText("Uploading resume...");

      /* ---------------- Upload PDF ---------------- */
      const uploadedFile = await fs.upload([file]);
      if (!uploadedFile) throw new Error("Failed to upload resume");

      /* ---------------- Convert to Image ---------------- */
      setStatusText("Converting resume to image...");
      const imageFile = await convertPdfToImage(file);
      if (!imageFile.file) throw new Error("Failed to convert PDF to image");

      /* ---------------- Upload Image ---------------- */
      setStatusText("Uploading preview image...");
      const uploadedImage = await fs.upload([imageFile.file]);
      if (!uploadedImage) throw new Error("Failed to upload image");

      /* ---------------- Save Initial Resume Data ---------------- */
      setStatusText("Preparing data...");
      const uuid = generateUUID();

      const data = {
        id: uuid,
        resumePath: uploadedFile.path,
        imagePath: uploadedImage.path,
        companyName,
        jobTitle,
        jobDescription,
        feedback: "",
      };

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      /* ---------------- AI Feedback ---------------- */
      setStatusText("Analyzing resume...");
      const feedback = await ai.feedback(
        uploadedFile.path,
        prepareInstructions({ jobTitle, jobDescription }),
      );

      if (!feedback) throw new Error("AI failed to analyze resume");

      const feedbackText =
        typeof feedback.message.content === "string"
          ? feedback.message.content
          : feedback.message.content[0].text;

      /* ---------------- Safe JSON Parse ---------------- */
      let parsed;
      try {
        parsed = JSON.parse(feedbackText); // handles trailing commas, etc.
      } catch {
        parsed = JSON.parse(feedbackText);
      }

      console.log(parsed);

      /* ---------------- Normalize to Universal Feedback ---------------- */
      const normalizedFeedback: Feedback = normalizeFeedback(parsed);

      /* ---------------- Save Final Data ---------------- */
      data.feedback = normalizedFeedback;

      await kv.set(`resume:${uuid}`, JSON.stringify(data));

      setStatusText("Analysis complete. Redirecting...");
      navigate(`/resume/${uuid}`);
    } catch (error: any) {
      console.error(error);
      setStatusText(error.message || "Something went wrong.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      alert("Please upload a resume file.");
      return;
    }

    const formData = new FormData(e.currentTarget);

    const companyName = formData.get("company-name") as string;
    const jobTitle = formData.get("job-title") as string;
    const jobDescription = formData.get("job-description") as string;

    handleAnalyze({ companyName, jobTitle, jobDescription, file });
  };

  return (
    <main className="bg-[url('/images/bg-main.svg')] bg-cover min-h-screen">
      <Navbar />

      <section className="main-section">
        <div className="page-heading py-16 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-center">
            Smart feedback for your dream job
          </h1>

          {isProcessing ? (
            <div className="flex flex-col items-center gap-6 mt-6">
              <h2 className="text-lg text-gray-600">{statusText}</h2>
              <img
                src="/images/resume-scan.gif"
                alt="Processing"
                className="w-64"
              />
            </div>
          ) : (
            <>
              <h2 className="text-gray-600 text-center mt-4">
                Drop your resume for an ATS score and personalized improvement
                tips
              </h2>

              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6 mt-10 bg-white p-8 rounded-2xl shadow-md">
                <div className="form-div">
                  <label htmlFor="company-name">Company Name</label>
                  <input
                    type="text"
                    name="company-name"
                    placeholder="Company Name"
                    className="border border-gray-300 rounded-lg p-2"
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="job-title">Job Title</label>
                  <input
                    type="text"
                    name="job-title"
                    placeholder="Job Title"
                    className="border border-gray-300 rounded-lg p-2"
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="job-description">Job Description</label>
                  <textarea
                    rows={5}
                    name="job-description"
                    placeholder="Paste job description..."
                    className="border border-gray-300 rounded-lg p-2"
                  />
                </div>

                <div className="form-div">
                  <label htmlFor="uploader">Upload Resume</label>
                  <FileUploader onFileSelect={handleFileSelect} />
                </div>

                <button
                  className="primary-button py-3 rounded-xl font-semibold"
                  type="submit">
                  Analyze Resume
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Upload;
