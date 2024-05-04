const AddIcon = (props: { className: string }) => {
  const { className } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        d="M12 20V12M12 12V4M12 12H20M12 12H4"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default AddIcon;
