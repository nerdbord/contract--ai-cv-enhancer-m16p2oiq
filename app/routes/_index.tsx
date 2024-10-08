/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { FAQ } from "~/components/ui/FAQ";
import { Hero } from "~/components/ui/Hero";
import { InfoCards } from "~/components/ui/InfoCards";
import { Testimony } from "~/components/ui/Testimony";
import { getAuth } from "@clerk/remix/ssr.server";
import { createUserFromClerk } from "../../actions/user";

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (!userId) {
    return { userDBId: null };
  }

  const user = await createUserFromClerk(userId);
  const userDBId = user?.id;
  return { userDBId };
};

export default function Index() {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center max-w-screen-xl">
      <Hero />
      <InfoCards />
      <Testimony />
      <FAQ />
    </div>
  );
}

/* const resources = [
  {
    href: "https://remix.run/start/quickstart",
    text: "Quick Start (5 min)",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className="stroke-gray-600 group-hover:stroke-current dark:stroke-gray-300"
      >
        <path
          d="M8.51851 12.0741L7.92592 18L15.6296 9.7037L11.4815 7.33333L12.0741 2L4.37036 10.2963L8.51851 12.0741Z"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
]; */
