const RectangleIcon = (props: {className: string, rectClassName: string}) => {
    const {className, rectClassName} =props
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 20 40"
      fill="none"
    >
      <rect className={rectClassName} rx="4" fill="currentColor" />
    </svg>
  );
};

export default RectangleIcon;
