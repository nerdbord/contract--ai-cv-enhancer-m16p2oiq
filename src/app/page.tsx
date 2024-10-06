import { Landing } from "@/components/ui/Landing";
import { checkUserInDatabase } from "../../actions/user";

export default function Home() {
  checkUserInDatabase();

  return (
    <main>
      <Landing />
    </main>
  );
}
