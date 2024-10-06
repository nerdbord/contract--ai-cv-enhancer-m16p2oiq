export const Ellipse = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 25"
      fill="none"
    >
      <circle cx="12" cy="12.5" r="12" fill="#570DF8" />
    </svg>
  );
};

export const InactiveEllipse = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 25"
      fill="none"
    >
      <circle cx="12" cy="12.5" r="12" fill="#9CA3AF" />{" "}
    </svg>
  );
};

interface StepProps {
  label: string;
  completed: boolean;
  active: boolean;
  index: number;
  isLastStep: boolean;
}

export const Step = ({ label, completed, active, isLastStep }: StepProps) => {
  const stepClasses = `flex items-center justify-center w-7 h-7 rounded-full text-white border ${
    completed
      ? "border-cyan-500 bg-cyan-500"
      : active
      ? "border-violet-500 bg-white p-0.5"
      : "border-gray-400 bg-white p-0.5"
  }`;

  const lineClasses = `absolute top-3 left-24 w-[85px] h-0.5 ${
    completed ? "bg-cyan-500" : "bg-gray-400"
  }`;

  const labelClasses = `text-xs font-normal leading-[16px]`;

  return (
    <div className="relative flex flex-col items-center text-center gap-2 min-w-[140px]">
      <div className={stepClasses}>
        {completed ? (
          <CheckedIcon />
        ) : active ? (
          <Ellipse />
        ) : (
          <InactiveEllipse />
        )}
      </div>

      {!isLastStep && <div className={lineClasses}></div>}
      <p className={labelClasses}>{label}</p>
    </div>
  );
};

interface StepperProps {
  activeStep: number;
  steps: Array<{ label: string }>;
}

export const Stepper = ({ activeStep, steps }: StepperProps) => {
  return (
    <div className="flex justify-center items-center p-2">
      {steps.map((step, index) => (
        <Step
          key={index}
          completed={activeStep > index}
          active={activeStep === index}
          label={step.label}
          index={index}
          isLastStep={index === steps.length - 1}
        />
      ))}
    </div>
  );
};

export const CheckedIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);
