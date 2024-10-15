import React, { forwardRef } from "react";

interface JobDescriptionFormProps {
  actionData?: {
    jobDescription?: string;
  };
  errorMessage?: string;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  defaultValue?: string;
}

export const JobOfferForm = forwardRef<
  HTMLFormElement,
  JobDescriptionFormProps
>(({ actionData, errorMessage, onChange, onSubmit }, ref) => (
  <form
    ref={ref}
    onSubmit={onSubmit}
    className="w-full flex flex-col items-center bg-white"
  >
    <h1 className="text-center text-5xl not-italic font-normal pb-9">
      Add your job description
    </h1>
    <p className="text-base text-start not-italic font-normal leading-6 pb-9">
      Paste link to a job offer or the job description you want to compare your
      resume to.
    </p>
    <textarea
      name="jobDescription"
      className="gap-6 border border-slate-300 rounded-lg w-[650px] h-[188px] p-6 cursor-pointer bg-inherit resize-none flex-grow focus:outline-none focus:ring-0 focus:border-slate-300"
      placeholder="e.g. https://theprotocol.it/filtry/backend;sp/praca/junior-php-developer or leave it empty if you want only to enhance your resume"
      defaultValue={actionData?.jobDescription || ""}
      onChange={onChange}
    />
    {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
  </form>
));

JobOfferForm.displayName = "JobOfferForm";
