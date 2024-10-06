import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { Worker, Viewer } from "@react-pdf-viewer/core";
import { UploadIcon } from "./ui/UploadIcon";
import "@react-pdf-viewer/core/lib/styles/index.css";

export const UploadCV: React.FC<{ onFileUpload: (file: File) => void }> = ({
  onFileUpload,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validFormats = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validFormats.includes(file.type)) {
      setErrorMessage(
        "Invalid file format. Please upload a PDF or Word document."
      );
      return false;
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrorMessage("File size exceeds 2MB limit.");
      return false;
    }

    return true;
  };

  const handleFileUpload = (file: File) => {
    if (validateFile(file)) {
      setErrorMessage(null);
      setUploadedFile(file);
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      const newUrl = URL.createObjectURL(file);
      setPdfUrl(newUrl);
      onFileUpload(file);
    }
  };

  const handleDivClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      {!uploadedFile && (
        <h1 className="text-center text-5xl not-italic font-normal">
          Upload your resume
        </h1>
      )}
      {uploadedFile ? (
        <div className="uploaded-file flex flex-col items-center gap-4 w-full">
          {uploadedFile.type === "application/pdf" && (
            <div className="w-full h-96">
              <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js">
                <div
                  style={{
                    height: "330px",
                    border: "none",
                    borderBottom: "1px solid #e8e8e8",
                    boxShadow: "none",
                    overflowY: "hidden",
                  }}
                >
                  <Viewer
                    fileUrl={pdfUrl || ""}
                    renderLoader={(percentages: number) => (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Loading PDF...</span>
                      </div>
                    )}
                  />
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
          className="upload flex flex-col justify-center items-center gap-4 border border-slate-300 rounded-lg w-full p-6 cursor-pointer hover:border-slate-400 transition-colors"
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
              handleFileUpload(file);
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
            className="hidden"
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
