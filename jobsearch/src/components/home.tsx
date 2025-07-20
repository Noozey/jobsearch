import ThemeToggle from "./ThemeToggle";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

const Home = () => {
  return (
    <div>
      <nav className="w-screen flex justify-center p-4 border-b border-b-border">
        <ul className="flex gap-4 text-lg">
          <li>Home</li>

          <li>About</li>
          <li>Contact</li>
        </ul>
      </nav>
      <div className="grid grid-cols-4">
        <section className="col-start-1 h-screen p-4 flex justify-end">
          <LeftBlock />
        </section>
        <section className="col-start-2 col-span-2 h-screen p-4">
          <CenterBlock />
        </section>
        <section className="col-start-4 h-screen p-4 flex justify-start">
          <RightBlock />
        </section>
      </div>

      <ThemeToggle />
    </div>
  );
};

const CenterBlock = () => {
  return (
    <span className="flex items-center gap-2">
      <Input></Input>
      <Button variant={"outline"}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m21 21-4.34-4.34" />
          <circle cx="11" cy="11" r="8" />
        </svg>
      </Button>
    </span>
  );
};

const LeftBlock = () => {
  return (
    <div>
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Left Block</h2>
          <p>This is the left block content.</p>
        </div>
      </Card>
    </div>
  );
};
const RightBlock = () => {
  return (
    <div>
      <Card>
        <div className="p-4">
          <h2 className="text-lg font-semibold">Left Block</h2>
          <p>This is the left block content.</p>
        </div>
      </Card>
    </div>
  );
};
export default Home;
