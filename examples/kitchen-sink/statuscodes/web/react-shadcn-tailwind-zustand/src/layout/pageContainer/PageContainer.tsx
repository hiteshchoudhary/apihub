import { useAppStore } from "@/store/store";
import Header from "../header";

interface PageContainerProps {
  children: React.ReactNode;
  mainClassNames?: string;
  footer?: React.ReactNode;
}
export default function PageContainer(props: PageContainerProps) {
  const { children, mainClassNames = "" } = props;
  const { loading } = useAppStore();
  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-neutral-950 text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
      <Header />
      <main
        className={`flex flex-col max-w-screen-lg py-8 px-4 w-full flex-1 ${mainClassNames}`}
      >
        {loading > 0 ? <div className="p-8 text-center text-slate-400 animate-pulse">Loading...</div> : children}
      </main>
      {props.footer}
    </div>
  );
}
