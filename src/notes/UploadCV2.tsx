import { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Document, Page, pdfjs } from "react-pdf";
import { UploadIcon } from "../app/components/ui/UploadIcon";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// Ustaw workera z CDN
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

interface UploadCVProps {
  onFileUpload: (file: File) => void;
}

export const UploadCV: React.FC<UploadCVProps> = ({ onFileUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

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
      setIsLoading(true);
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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setIsLoading(false);
    setNumPages(numPages);
    setPageNumber(1);
  };

  const LoadingMessage = () => (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="ml-2">Loading PDF...</span>
    </div>
  );

  return (
    <div className="flex flex-col justify-center items-center gap-8">
      {!uploadedFile && (
        <h1 className="text-center text-5xl font-normal">Upload your resume</h1>
      )}

      {uploadedFile ? (
        <div className="w-full max-w-2xl">
          {uploadedFile.type === "application/pdf" && pdfUrl ? (
            <div className="pdf-viewer border rounded-lg p-4">
              {isLoading && <LoadingMessage />}
              <Document
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={(error) => {
                  console.error("Error loading PDF:", error);
                  setErrorMessage("Error loading PDF file. Please try again.");
                  setIsLoading(false);
                }}
                loading={<LoadingMessage />}
                className="flex justify-center"
              >
                <Page
                  key={`page_${pageNumber}`}
                  pageNumber={pageNumber}
                  className="max-w-full h-auto"
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  scale={1.0}
                  loading={<LoadingMessage />}
                />
              </Document>

              {numPages && numPages > 1 && (
                <div className="flex justify-center gap-4 mt-4">
                  <button
                    onClick={() =>
                      setPageNumber((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={pageNumber <= 1}
                    className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="flex items-center">
                    Page {pageNumber} of {numPages}
                  </span>
                  <button
                    onClick={() =>
                      setPageNumber((prev) => Math.min(prev + 1, numPages))
                    }
                    disabled={pageNumber >= numPages}
                    className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-lg font-normal">
              File uploaded: {uploadedFile.name}
            </p>
          )}
        </div>
      ) : (
        <div
          className="upload flex flex-col justify-center items-center gap-4 border border-slate-300 rounded-lg w-full p-6 cursor-pointer hover:border-slate-400 transition-colors"
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              fileInputRef.current?.click();
            }
          }}
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          tabIndex={0}
        >
          <UploadIcon />
          <p className="text-center text-lg font-normal">
            Click the icon above or drop your resume in here!
          </p>
          <p className="text-center text-xs font-normal text-slate-300">
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
