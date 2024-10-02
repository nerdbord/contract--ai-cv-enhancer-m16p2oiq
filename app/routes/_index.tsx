import { MetaFunction, LoaderFunction } from "@remix-run/node";
import { getAuth } from "@clerk/remix/ssr.server";
import { createUserFromClerk } from "actions/user";
import { Landing } from "~/components/ui/Landing";
import DashboardRoute from "./dashboard";
import { useLoaderData } from "@remix-run/react";
import { MainNavigation } from "~/components/ui/MainNavigation";

export const meta: MetaFunction = () => {
  return [
    { title: "AI CV Enhancer" },
    {
      name: "description",
      content:
        "AI CV Enhancer is a tool that improves and optimizes your CV using artificial intelligence.",
    },
    {
      name: "keywords",
      content:
        "AI CV Enhancer, CV optimization, resume improvement, artificial intelligence, job application, CV builder",
    },
    { name: "author", content: "PA DreamTeam" },
  ];
};

export const loader: LoaderFunction = async (args) => {
  const { userId } = await getAuth(args);
  if (userId) {
    await createUserFromClerk(userId);
  }

  return { data: { userId } };
};

export default function Index() {
  const {
    data: { userId },
  } = useLoaderData<{ data: { userId: string | null } }>();
  return (
    <main className="flex flex-col items-center justify-start w-full flex-grow pt-20">
      <MainNavigation />
      <div className="flex flex-grow w-full">
        {userId ? <DashboardRoute /> : <Landing />}
      </div>
    </main>
  );
}
