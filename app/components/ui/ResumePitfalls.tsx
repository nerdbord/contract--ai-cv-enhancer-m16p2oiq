import PropTypes from "prop-types";

const StatisticCard = ({
  title,
  description,
}: {
  title: string;
  description: string;
  isHighlighted?: boolean;
}) => {
  return (
    <div className="bg-indigo-600 text-white p-6 rounded-lg h-auto ">
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </div>
  );
};

StatisticCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

const statistics = [
  {
    title: "75% of CV are rejected",
    description:
      "75% of resumes don’t reach recruiters due to formatting issues or missing keywords in ATS systems.",
    isHighlighted: true,
  },
  {
    title: "6 seconds to stand out",
    description:
      "Recruiters spend only 6 seconds per resume, often discarding hard-to-read ones.",
  },
  {
    title: "54% mismatched CVs",
    description:
      "Over half of candidates don’t customize their CVs, reducing their chances of being hired.",
  },
  {
    title: "88% reject typos",
    description:
      "Typos and grammar mistakes lead to 88% of resumes being discarded by recruiters.",
  },
];

// Główny komponent
export const ResumePitfalls = () => {
  return (
    <div className="py-14  bg-indigo-900 flex items-start justify-start w-full text-white px-[60px]">
      <div className="flex flex-col items-start w-1/3 text-start pr-9">
        <h2 className="text-5xl not-italic font-normal leading-10 mb-2">
          Avoid Common Resume Pitfalls
        </h2>
        <p className="text-lg text-slate-200">
          By using Lumifile you reduce the risk of making these mistakes quickly
          and for free!
        </p>
      </div>

      <div
        className="grid gap-4 w-2/3 
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 px-24"
      >
        {statistics.map((stat, index) => (
          <StatisticCard
            key={index}
            title={stat.title}
            description={stat.description}
            isHighlighted={stat.isHighlighted}
          />
        ))}
      </div>
    </div>
  );
};
