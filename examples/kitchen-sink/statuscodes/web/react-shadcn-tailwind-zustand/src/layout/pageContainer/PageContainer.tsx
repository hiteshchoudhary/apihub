import Header from "../header";

interface PageContainerProps {
  children: React.ReactNode;
  footer?: React.ReactNode;
}
export default function PageContainer(props: PageContainerProps) {
  const { children } = props;
  return (
    <div className="flex flex-col items-center justify-start h-screen">
      <Header />
      <main className="flex max-w-screen-lg px-4 pt-[8%]">{children}</main>
      {props.footer}
    </div>
  );
}
