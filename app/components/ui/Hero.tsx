// eslint-disable-next-line import/no-unresolved
import mockimg from "/mockimg.png";
import { FaStar } from "react-icons/fa";

export const Hero = () => {
  return (
    <div className="hero bg-base-200  flex flex-col gap-8 text-white p-16">
      <div className="hero-content flex-col lg:flex-row-reverse w-full lg:w-full lg:items-center">
        <img
          src={mockimg}
          className="w-full lg:w-1/2 rounded-lg shadow-2xl"
          alt="hero"
        />
        <div className="text-content w-full lg:w-1/2">
          <h1 className="text-5xl font-bold">Improve your resume with AI</h1>
          <p className="py-6">
            Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
            excepturi exercitationem quasi. In deleniti eaque aut repudiandae et
            a id nisi.
          </p>
          <button className="btn btn-primary">Get Started</button>
          <div className="flex gap-6 items-center">
            <div className="flex gap-1 items-center">
              <FaStar className="text-pink-500 h-6 w-6" />
              <FaStar className="text-pink-500 h-6 w-6" />
              <FaStar className="text-pink-500 h-6 w-6" />
              <FaStar className="text-pink-500 h-6 w-6" />
              <FaStar className=" h-6 w-6" />
            </div>{" "}
            3,908 happy customers shared their experience.
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <h2 className="text-3xl font-bold text-center">Heading</h2>
        <div className="flex justify-center">
          <div className="flex flex-wrap justify-center">
            <div className="text-start flex gap-2">
              <div className="w-16 h-16 rounded-full bg-teal-400 text-black flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <div className="px-4 ">
                <h3 className="text-white font-bold mb-4">Lorem ipsum dolor</h3>
                <p className="">
                  Lorem ipsum dolor sit <br /> amet consectetur.
                </p>
              </div>
            </div>
            <div className="text-start flex gap-2">
              <div className="w-16 h-16 rounded-full bg-teal-400 text-black flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <div className="px-4 ">
                <h3 className="text-white font-bold mb-4">Lorem ipsum dolor</h3>
                <p className="">
                  Lorem ipsum dolor sit <br /> amet consectetur.
                </p>
              </div>
            </div>
            <div className="text-start flex gap-2">
              <div className="w-16 h-16 rounded-full bg-teal-400 text-black flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <div className="px-4 ">
                <h3 className="text-white font-bold mb-4">Lorem ipsum dolor</h3>
                <p className="">
                  Lorem ipsum dolor sit <br /> amet consectetur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
