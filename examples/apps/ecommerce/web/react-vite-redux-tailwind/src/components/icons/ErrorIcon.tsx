const ErrorIcon = (props: { className: string }) => {
  const { className } = props;
  return (
    <svg viewBox="0 0 32 32" className={className} xmlSpace="preserve">
      <g>
        <g>
          <g>
            <circle cx="16" cy="16" id="BG" r="16" fill="currentColor" />
            <path
              d="M14.5,25h3v-3h-3V25z M14.5,6v13h3V6H14.5z"
              id="Exclamatory_x5F_Sign"
              fill="#E6E6E6"
            />
          </g>
        </g>
      </g>
    </svg>
  );
};
export default ErrorIcon;
