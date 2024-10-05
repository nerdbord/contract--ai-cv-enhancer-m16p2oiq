import React from "react";

interface JobDescriptionFormProps {
  actionData?: {
    jobDescription?: string;
  };
  errorMessage?: string;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export const JobDescriptionForm: React.FC<JobDescriptionFormProps> = ({
  actionData,
  errorMessage,
  onSubmit,
}) => (
  <form
    onSubmit={onSubmit}
    className="w-full flex gap-9 flex-col items-center w-[650px] h-1/2
"
  >
    <h1 className="text-center text-5xl not-italic font-normal ">
      Add your job description
    </h1>
    <p className="text-base text-start not-italic font-normal leading-6">
      Paste link to a job offer or the job description you want to compare your
      resume to.
    </p>
    <textarea
      name="jobDescription"
      className="gap-6 border border-slate-300 rounded-lg w-[650px] p-6 cursor-pointer bg-inherit h-[200px] resize-none"
      placeholder="e.g. https://theprotocol.it/filtry/backend;sp/praca/junior-php-developer"
      defaultValue={actionData?.jobDescription || ""}
    />
    {errorMessage && <div className="text-red-500 mt-4">{errorMessage}</div>}
  </form>
);
