import { PageContainer } from "@/layout";
import { hero_illustrator, wave_vector } from "./assets";
import { Button } from "@/components/ui/button";
import "./home.css";
import { Link } from "react-router-dom";
export default function Home() {
  return (
    <PageContainer
      mainClassNames="pt-[8%]"
      footer={
        <img
          src={wave_vector}
          alt="wave_vector"
          className="w-full wave -left-4 right-0 z-[-1] min-w-[105vw] absolute bottom-0 sm:hidden md:block"
        />
      }
    >
      <div className="flex w-full h-full">
        <div className="flex flex-col h-full">
          <h2 className="text-6xl font-bold leading-[102px]">
            Decoding HTTP with Status Code Insight
          </h2>
          <p className="mt-4 text-lg max-w-[517px]">
            StatusCode Insight is your ultimate guide to understanding HTTP
            status codes, offering a detailed, user-friendly interface for both
            beginners and seasoned professionals in web development.
          </p>
          <div className="flex items-center w-full mt-8 space-x-8">
            <Link to="/codes-list">
              <Button className="text-black bg-white hover:bg-blue-500 hover:text-white">
                Check Codes
              </Button>
            </Link>
            <Link to="/quiz">
              <Button className="text-black bg-white hover:bg-blue-500 hover:text-white">
                Quiz
              </Button>
            </Link>
          </div>
        </div>
        <div className="hidden lg:flex lg:items-center">
          <img
            src={hero_illustrator}
            alt="hero_illustrator"
            className="w-full h-full"
          />
        </div>
      </div>
    </PageContainer>
  );
}
