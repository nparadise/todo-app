import { useMemo, useState } from 'react';
import { TodoWithID } from '../libs/types';

export type TodoFilter = 'all' | 'ongoing' | 'overdue' | 'completed';

const useFilteredTodos = (todos: TodoWithID[]) => {
  const [filterValue, setFilterValue] = useState<TodoFilter>('all');

  const filteredTodoList = useMemo(
    () =>
      todos
        .filter((todo) => {
          switch (filterValue) {
            case 'ongoing':
              return !todo.completed;
            case 'overdue':
              return todo.dueDate.valueOf() < Date.now() && !todo.completed;
            case 'completed':
              return todo.completed;
            case 'all':
              return true;
            default:
              throw new Error('Invalid filter value');
          }
        })
        .sort((a, b) => a.dueDate.valueOf() - b.dueDate.valueOf()),
    [filterValue, todos]
  );

  return { filterValue, setFilterValue, filteredTodoList };
};

export default useFilteredTodos;
