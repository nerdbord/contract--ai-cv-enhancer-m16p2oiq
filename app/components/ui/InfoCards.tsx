import { InfoCards1 } from "~/assets/InfoCards1";
import { InfoCards2 } from "~/assets/InfoCards2";
import { InfoCards3 } from "~/assets/InfoCards3";
import PropTypes from "prop-types";

// Komponent InfoCard
const InfoCard = ({
  title,
  description,
  IconComponent,
  reverse,
}: {
  title: string;
  description: string;
  IconComponent: React.ComponentType<{ className?: string }>;
  reverse?: boolean;
}) => {
  return (
    <div
      className={`px-24 flex gap-5 items-center ${
        reverse ? "flex-row-reverse" : ""
      }`}
    >
      <IconComponent className="w-1/3 h-auto" />
      <div className="p-6 w-2/3">
        <h2 className="text-3xl pb-[30px]">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
};

InfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  IconComponent: PropTypes.elementType.isRequired,
  reverse: PropTypes.bool,
};

// Tablica z treściami dla kart
const infoCardsData = [
  {
    title: "Scan Your Job Listing and Let AI Do the Work",
    description:
      "Upload or paste your job offer, and our AI instantly analyzes the key requirements. It scans for skills, qualifications, and keywords, making sure you know exactly what the employer is looking for.",
    IconComponent: InfoCards1,
    reverse: false,
  },
  {
    title: "Tailor Your CV in Just a Few Clicks",
    description:
      "Based on the job description, the AI suggests personalized changes to your resume. From optimizing bullet points to highlighting the most relevant experience, you can tweak and perfect your CV effortlessly.",
    IconComponent: InfoCards2,
    reverse: true,
  },
  {
    title: "Download and Apply with Confidence",
    description:
      "Once your CV is optimized, simply download the final version. With the right keywords and structure, you can be sure it’s ready to impress recruiters and get you through the application filters.",
    IconComponent: InfoCards3,
    reverse: false,
  },
];

// Główny komponent
export const InfoCards = () => {
  return (
    <div className="flex text-start flex-col gap-9 items-center p-4 bg-white px-[60px] py-14 w-full">
      {infoCardsData.map((card, index) => (
        <InfoCard
          key={index}
          title={card.title}
          description={card.description}
          IconComponent={card.IconComponent}
          reverse={card.reverse}
        />
      ))}
    </div>
  );
};
