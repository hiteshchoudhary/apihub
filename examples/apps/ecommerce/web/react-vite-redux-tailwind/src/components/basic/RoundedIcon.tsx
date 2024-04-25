interface RoundedIconProps {
  icon: React.ReactElement;
}
const RoundedIcon = (props: RoundedIconProps) => {
  const { icon } = props;
  return (
    <div className="rounded-full bg-grey p-2">
      <div className="rounded-full bg-black p-2">{icon}</div>
    </div>
  );
};

export default RoundedIcon;
