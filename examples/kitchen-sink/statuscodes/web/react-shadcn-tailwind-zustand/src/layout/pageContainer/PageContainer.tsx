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
    <div className="flex flex-col items-center justify-start w-full h-screen">
      <Header />
      <main
        className={`flex max-w-screen-lg py-10 px-4 w-full mt-[56px] ${mainClassNames}`}
      >
        {loading > 0 ? <div>loading...</div> : children}
      </main>
      {props.footer}
    </div>
  );
}
