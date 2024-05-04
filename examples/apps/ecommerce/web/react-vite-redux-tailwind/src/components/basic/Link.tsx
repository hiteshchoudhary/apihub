import { useMemo } from "react";
import { LinkTypes } from "../../constants";
import { useAppSelector } from "../../store";

interface LinkProps {
  onClick?(): void;
  text: string;
  className?: string;
  linkType?: LinkTypes;
}

const Link = (props: LinkProps) => {
  const { onClick, text, linkType = LinkTypes.default, className = "" } = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);

  const linkTypeStyles = useMemo(() => {
    switch (linkType) {
      case LinkTypes.red:
        return "text-darkRed hover:underline";
      default:
        return "";
    }
  }, [linkType]);

  return (
    <span
      className={`cursor-pointer ${linkTypeStyles} ${className}`}
      onClick={onClick}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {text}
    </span>
  );
};

export default Link;
