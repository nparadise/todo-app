interface SortProps {
  sortValue: string;
  setSortValue: React.Dispatch<React.SetStateAction<string>>;
}

const Sort = ({ sortValue, setSortValue }: SortProps) => {
  return (
    <div className="space-x-1 text-right">
      <label className="px-2 py-1 shadow-md rounded-sm">
        Date <input type="checkbox" name="" id="" />
      </label>
    </div>
  );
};

export default Sort;
