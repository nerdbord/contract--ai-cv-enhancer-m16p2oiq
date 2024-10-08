type Props = {
  mainText?: string;
  subText?: string;
  subText2?: string;
};

export const Loader = ({ mainText, subText, subText2 }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center gap-6 pb-40">
      <span className="loading loading-dots loading-lg text-indigo-900 "></span>

      <div>
        <p className="text-center text-2xl not-italic font-normal leading-8 pb-4">
          {mainText}
        </p>
        <p className="text-center">{subText}</p>
        <p className="text-center">{subText2}</p>
      </div>
    </div>
  );
};
