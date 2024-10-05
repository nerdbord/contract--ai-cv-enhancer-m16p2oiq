/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/no-noninteractive-tabindex */
import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import UploadIcon from "./ui/UploadIcon";
import "@react-pdf-viewer/core/lib/styles/index.css";

export const UploadCV: React.FC<{ onFileUpload: (file: File) => void }> = ({
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validFormats = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!validFormats.includes(file.type)) {
        setErrorMessage(
          "Invalid file format. Please upload a PDF or Word document."
        );
        return;
      }
      setErrorMessage(null);
      setUploadedFile(file);
      onFileUpload(file);
      console.log("Selected file:", file);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-9 w-[650px] h-[350px]">
      {!uploadedFile && (
        <h1 className="text-center text-5xl not-italic font-normal ">
          Upload your resume
        </h1>
      )}
      {uploadedFile ? (
        <div className="uploaded-file flex flex-col items-center gap-4 w-[650px] ">
          {uploadedFile.type === "application/pdf" && (
            <div className="w-full h-96">
              <Worker
                workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}
              >
                <div
                  style={{
                    height: "350px",
                    border: "none",
                    boxShadow: "none",
                    overflowY: "hidden",
                  }}
                >
                  <Viewer fileUrl={URL.createObjectURL(uploadedFile)} />
                </div>
              </Worker>
            </div>
          )}
          {uploadedFile.type !== "application/pdf" && (
            <p className="text-center text-lg not-italic font-normal leading-7">
              File uploaded: {uploadedFile.name}
            </p>
          )}
        </div>
      ) : (
        <div
          className="upload flex flex-col justify-center items-center gap-6 border border-slate-300 rounded-lg w-[650px] p-6 cursor-pointer"
          onClick={handleDivClick}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              handleDivClick();
            }
          }}
          onDrop={(e) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file) {
              const validFormats = [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
              ];
              if (!validFormats.includes(file.type)) {
                setErrorMessage(
                  "Invalid file format. Please upload a PDF or Word document."
                );
                return;
              }
              setErrorMessage(null);
              setUploadedFile(file);
              onFileUpload(file);
              console.log("Dropped file:", file);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          tabIndex={0}
        >
          <UploadIcon />
          <p className="text-center text-lg not-italic font-normal leading-7">
            Click the icon above or drop your resume in here!
          </p>
          <p className="text-center text-xs not-italic font-normal leading-4 text-slate-300">
            Resumes in PDF or DOCS. Readable text only (no scans). Max 2MB file
            size.
          </p>
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx"
          />
        </div>
      )}
      {errorMessage && (
        <p className="text-red-500 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};
UploadCV.propTypes = {
  onFileUpload: PropTypes.func.isRequired,
};

export default UploadCV;
