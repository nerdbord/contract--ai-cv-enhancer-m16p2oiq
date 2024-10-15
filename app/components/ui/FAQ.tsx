import { Link } from "@remix-run/react";
import PropTypes from "prop-types";

// Komponent Collapse
const Collapse = ({ title, content }: { title: string; content: string }) => {
  return (
    <div className="collapse collapse-plus bg-indigo-50">
      <input type="radio" name="my-accordion-3" />
      <div className="collapse-title text-xl font-medium">{title}</div>
      <div className="collapse-content">
        <p>{content}</p>
      </div>
    </div>
  );
};

Collapse.propTypes = {
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  isChecked: PropTypes.bool,
};

const faqItems = [
  {
    title: "How does the AI customize my resume?",
    content:
      "Our AI analyzes both your uploaded resume and the job description to create a tailored CV that fits the specific requirements of your target job.",
  },
  {
    title: "How fast can I get my enhanced resume?",
    content:
      "Once you upload your resume, the AI generates suggestions within minutes. You can make edits and download your new resume immediately.",
  },
  {
    title: "How accurate is the AI in matching my skills to job requirements?",
    content:
      "Our AI is designed to carefully analyze your skills and match them to the job requirements, ensuring your resume is tailored to the position you're applying for. You can still make manual adjustments if needed.",
  },
  {
    title: "Is this service suitable for all industries?",
    content:
      "Yes! Our AI is versatile and works across a variety of industries, from tech to marketing, finance, and more.",
  },
  {
    title: "How much does it cost to use AI Resume Enhancer?",
    content:
      "At the moment, you can try AI Resume Enhancer for free! Explore its features and see how it can transform your resume without any cost.",
  },
];

// Główny komponent
export const FAQ = () => {
  return (
    <div className="flex  bg-indigo-100 py-16 px-[60px] w-full text-start">
      {/* Section for Title and Subtitle */}
      <div className="flex flex-col items-start w-1/3 pr-10">
        <h2 className="text-5xl not-italic font-normal">FAQ</h2>
        <p className="text-lg not-italic font-normal mt-4">
          If you have any questions about our Enhancer AI, read on to get
          answers to some of our most frequently asked questions.
        </p>
        <Link to="/cv" className="btn btn-primary text-white mt-6">
          Enhance My Resume
        </Link>
      </div>

      {/* Section for Accordion */}
      <div className="w-2/3 flex flex-col items-start gap-4 px-24">
        {faqItems.map((item, index) => (
          <Collapse key={index} title={item.title} content={item.content} />
        ))}
        <Link to="/cv" className="btn btn-primary text-white mt-6">
          Enhance My Resume
        </Link>
      </div>
    </div>
  );
};
