import "./tailwind.css";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import type { LinksFunction } from "@remix-run/node";
import { Header } from "./components/ui/Header";
import { Footer } from "./components/ui/Footer";
import { ClerkApp } from "@clerk/remix";
import { rootAuthLoader } from "@clerk/remix/ssr.server";

export const links: LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Roboto:wght@100..900&display=swap",
  },
];

export const meta: MetaFunction = () => [
  {
    charset: "utf-8",
    title: "Lumifile | AI-Powered CV Enhancer",
    description:
      "AI-powered CV enhancer that boosts your chances with tailored, keyword-optimized resumes designed to pass ATS filters and impress recruiters.",
    viewport: "width=device-width,initial-scale=1",
  },
];

export const loader: LoaderFunction = (args) => rootAuthLoader(args);
/* export const loader: LoaderFunction = (args) => {
  return rootAuthLoader(args, ({ request }) => {
    const { sessionId, userId, getToken } = request.auth;
    // Add logic to fetch data
    //console.log({ sessionId, userId, getToken });
    return { yourData: "here" };
  });
};
 */
export function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="flex min-h-screen w-full flex-col justify-between items-center align-center text-center">
        <Header />
        <div className="flex-grow w-full max-w-screen-xl">
          <Outlet />
        </div>
        <Footer />
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default ClerkApp(App);
