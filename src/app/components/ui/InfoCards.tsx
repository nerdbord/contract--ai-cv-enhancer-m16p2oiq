import heroimg from "@/assets/mockimg.png";
import Image from "next/image";

export const InfoCards = () => {
  return (
    <div className="flex flex-col gap-9 items-center p-4 bg-white px-60 py-14">
      <div className="flex gap-5 items-center">
        <Image src={heroimg} alt="card img" className="w-auto h-[200px]" />
        <div className="p-6 ">
          <h2 className="text-3xl font-bold">
            Nail the keywords,
            <br /> beat the ATS
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            <br /> Sapiente libero repudiandae error dicta consequuntur
          </p>
        </div>
      </div>
      <div className="flex gap-5 items-center">
        <div className="p-6 ">
          <h2 className="text-3xl font-bold">
            Nail the keywords,
            <br /> beat the ATS
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            <br /> Sapiente libero repudiandae error dicta consequuntur
          </p>
        </div>
        <Image src={heroimg} alt="card img" className="w-auto h-[200px]" />
      </div>
      <div className="flex gap-5 items-center">
        <Image src={heroimg} alt="card img" className="w-auto h-[200px]" />
        <div className="p-6 ">
          <h2 className="text-3xl font-bold">
            Nail the keywords,
            <br /> beat the ATS
          </h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            <br /> Sapiente libero repudiandae error dicta consequuntur
          </p>
        </div>
      </div>
    </div>
  );
};
