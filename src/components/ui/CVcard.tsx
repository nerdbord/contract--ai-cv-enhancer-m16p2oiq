import Link from "next/link";
import mockimg from "@/assets/mockimg.png";
import Image from "next/image";

interface CV {
  id: number;
  name: string;

  extractedCV: {
    bio?: string;
  };
}

interface CVCardProps {
  cv: CV;
  index: number;
}

export const CVCard: React.FC<CVCardProps> = ({ cv, index }) => {
  return (
    <>
      <div className="flex items-start gap-6 p-8 bg-white rounded-lg border">
        {/*    <Link
         to={`/cv/${cv.id}`}
         className="flex items-center justify-center w-1/2 h-[200px] bg-indigo-50 border border-indigo-500 rounded"
       >
         <img src={mockimg} alt="mockimg" className="w-1/2 h-1/2 object-cover" />
       </Link> */}
        <div className="flex items-center justify-center w-1/2 h-[200px] bg-indigo-50 border border-indigo-500 rounded" />

        <Image
          src={mockimg}
          alt="mockimg"
          className="w-1/2 h-1/2 object-cover"
        />
      </div>
      <div className="ml-6 w-1/2">
        <h3 className="text-2xl not-italic font-normal leading-8 text-indigo-500 pb-6">
          {!cv.name ? `Resume #${index + 1}` : cv.name}
        </h3>

        <p className="text-lg not-italic font-normal leading-7">
          Edited 2 days ago
        </p>
      </div>
    </>
  );
};
