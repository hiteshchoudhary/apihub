const TickIcon = (props: {
  className: string;
  circleProps?: { cx: number; cy: number; r: number; className: string };
}) => {
  const {
    className,
    circleProps = { className: "fill-zinc-50", cx: 25, cy: 25, r: 25 },
  } = props;
  return (
    <svg className={className} viewBox="0 0 50 50" xmlSpace="preserve">
      <circle {...circleProps} />
      <polyline
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit={10}
        points="38,15 22,33 12,25"
      />
    </svg>
  );
};

export default TickIcon;
