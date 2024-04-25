import { useAppSelector } from "../../store";

const CartIcon = (props: { className: string; quantity?: number }) => {
  const { className = "", quantity} = props;

  const isRTL = useAppSelector((state) => state.language.isRTL);
  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={`${className} ${isRTL ? 'transform -scale-x-[1]': ''}`}
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M11 27C11.5523 27 12 26.5523 12 26C12 25.4477 11.5523 25 11 25C10.4477 25 10 25.4477 10 26C10 26.5523 10.4477 27 11 27Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M25 27C25.5523 27 26 26.5523 26 26C26 25.4477 25.5523 25 25 25C24.4477 25 24 25.4477 24 26C24 26.5523 24.4477 27 25 27Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3 5H7L10 22H26"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 16.6667H25.59C25.7056 16.6667 25.8177 16.6267 25.9072 16.5535C25.9966 16.4802 26.0579 16.3782 26.0806 16.2648L27.8806 7.26479C27.8951 7.19222 27.8934 7.11733 27.8755 7.04552C27.8575 6.97371 27.8239 6.90678 27.7769 6.84956C27.73 6.79234 27.6709 6.74625 27.604 6.71462C27.5371 6.68299 27.464 6.66661 27.39 6.66666H8"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {quantity ? (
        <div className={`absolute w-4 h-4 p-[10px] bg-darkRed  rounded-full -top-1 ${isRTL ? '-left-1' : '-right-1'} flex justify-center items-center`}>
          <span className="text-zinc-50 text-xs">{quantity}</span>
        </div>
      ) : <></>}
    </div>
  );
};

export default CartIcon;
