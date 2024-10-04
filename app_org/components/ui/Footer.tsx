/* eslint-disable jsx-a11y/anchor-is-valid */
import { CgFacebook } from "react-icons/cg";
import { TfiLinkedin } from "react-icons/tfi";
import { BsTwitterX } from "react-icons/bs";
import { LogoMini } from "~/assets/LogoMini";

export const Footer = () => {
  return (
    <footer className="footer bg-slate-100 text-black p-10 max-w-screen-2xl ">
      <aside className="mr-16 ">
        <LogoMini className="mb-10" />
        <p>
          Social Media
          <br />
          <div className="flex items-center gap-2 mt-2 text-xl">
            <CgFacebook />
            <TfiLinkedin />
            <BsTwitterX />
          </div>
        </p>
      </aside>

      <nav>
        <h6 className="footer-title text-bold">Enhance your resume</h6>
        <a className="link link-hover pt-2">Improve Resume with AI</a>
        <a className="link link-hover">Create a new Resume</a>
        <a className="link link-hover">Learn more</a>
      </nav>
      <nav>
        <h6 className="footer-title text-bold">Resources</h6>
        <a className="link link-hover pt-2">Pricing</a>
        <a className="link link-hover">Support</a>
        <a className="link link-hover">Terms & conditions</a>
      </nav>
      <nav>
        <h6 className="footer-title text-bold ">Company</h6>
        <a className="link link-hover pt-2">About</a>
        <a className="link link-hover">Contact</a>
        <a className="link link-hover">Privacy policy</a>
      </nav>
    </footer>
  );
};
