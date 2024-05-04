import { useAppSelector } from "../../store";

interface TextProps {
  className?: string;
  children: string;
}
const Text = (props: TextProps) => {
  const { className, children } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);

  return (
    <span className={`${className}`} dir={isRTL ? "rtl" : "ltr"}>
      {children}
    </span>
  );
};

export default Text;
