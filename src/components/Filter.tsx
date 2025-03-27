import { TodoFilter } from '../hooks/useFilteredTodos';

interface FilterProps {
  filterValue: string;
  setFilterValue: React.Dispatch<React.SetStateAction<TodoFilter>>;
}

const Filter = ({ filterValue, setFilterValue }: FilterProps) => {
  return (
    <div className="space-x-1">
      <label
        className={`px-2 py-1 shadow-md rounded-sm ${filterValue === 'all' ? 'button-primary' : 'button-disabled'}`}
        htmlFor="filter-all"
      >
        All
        <input
          type="radio"
          name="filter"
          id="filter-all"
          value="all"
          onChange={(e) => setFilterValue(e.target.value as TodoFilter)}
          className="hidden"
        />
      </label>
      <label
        className={`px-2 py-1 shadow-md rounded-sm ${filterValue === 'ongoing' ? 'button-primary' : 'button-disabled'}`}
        htmlFor="filter-ongoing"
      >
        Ongoing
        <input
          type="radio"
          name="filter"
          id="filter-ongoing"
          value="ongoing"
          onChange={(e) => setFilterValue(e.target.value as TodoFilter)}
          className="hidden"
        />
      </label>
      <label
        className={`px-2 py-1 shadow-md rounded-sm ${filterValue === 'overdue' ? 'button-primary' : 'button-disabled'}`}
        htmlFor="filter-overdue"
      >
        Overdue
        <input
          type="radio"
          name="filter"
          id="filter-overdue"
          value="overdue"
          onChange={(e) => setFilterValue(e.target.value as TodoFilter)}
          className="hidden"
        />
      </label>
      <label
        className={`px-2 py-1 shadow-md rounded-sm ${
          filterValue === 'completed' ? 'button-primary' : 'button-disabled'
        }`}
        htmlFor="filter-completed"
      >
        Completed
        <input
          type="radio"
          name="filter"
          id="filter-completed"
          value="completed"
          onChange={(e) => setFilterValue(e.target.value as TodoFilter)}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default Filter;
