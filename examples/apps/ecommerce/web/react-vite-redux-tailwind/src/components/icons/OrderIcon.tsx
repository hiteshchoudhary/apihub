const OrderIcon = (props: { className: string }) => {
  const { className = '' } = props;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        strokeLinecap="round"
        strokeLinejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <rect x="5" y="4" width="14" height="17" rx="2" stroke="currentColor"></rect>
        <path d="M9 9H15" stroke="currentColor" strokeLinecap="round"></path>
        <path d="M9 13H15" stroke="currentColor" strokeLinecap="round"></path>
        <path d="M9 17H13" stroke="currentColor" strokeLinecap="round"></path>
      </g>
    </svg>
  );
};

export default OrderIcon;
