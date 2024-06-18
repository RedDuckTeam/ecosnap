type Props = {
  label: string;
  value: string | JSX.Element;
};

export const PointsItem = ({ label, value }: Props) => {
  return (
    <div className="rounded-[16px] flex-1 items-center py-3 px-4 flex flex-col gap-1.5 bg-background">
      <p className="text-[12px] font-medium text-gray">{label}</p>
      <div className="flex items-center gap-1">
        <img src="/images/star.png" alt="star" />
        <p className="text-[16px] font-semibold">{value}</p>
      </div>
    </div>
  );
};
