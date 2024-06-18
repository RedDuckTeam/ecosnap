type Props = {
  label: string;
  value: string | JSX.Element;
};

export const PointsItem = ({ label, value }: Props) => {
  return (
    <div className="rounded-[16px] flex-1 items-center py-3 px-4 flex flex-col gap-1.5 bg-gray-blue">
      <p className="text-[12px] font-medium text-gray">{label}</p>
      <div className="text-[16px] font-semibold">{value}</div>
    </div>
  );
};
