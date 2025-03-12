import { useCallback, useEffect, useMemo, useState } from 'react';

import * as db from '../libs/indexedDB';
import type { Todo, TodoWithID } from '../libs/types';

import ExportTodos from './ExportTodos';
import Filter from './Filter';
import ImportTodos from './ImportTodos';
import TodoEditor from './TodoEditor';
import TodoItem from './TodoItem';

enum PageState {
  'idle',
  'add',
  'edit',
  'export',
  'import',
}

const TodoList = () => {
  const [todoList, setTodoList] = useState<TodoWithID[]>([]);
  const [filterValue, setFilterValue] = useState<string>('all');
  const [pageState, setPageState] = useState<PageState>(PageState.idle);
  const [todoIdToUpdate, setTodoIdToUpdate] = useState<number>(-1);

  const filteredTodoList = useMemo(
    () =>
      todoList
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
    [filterValue, todoList]
  );

  useEffect(() => {
    db.getTodos().then((todos) => {
      setTodoList(todos);
    });
  }, []);

  const handleCheck = useCallback((id: number, completed: boolean) => {
    db.updateTodoComplete(completed, id).then(() => {
      setTodoList((prev) =>
        prev.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed: completed };
          }
          return todo;
        })
      );
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setPageState(PageState.idle);
  }, []);

  const handleExitImport = () => {
    setPageState(PageState.idle);
    db.getTodos().then((todos) => {
      setTodoList(todos);
    });
  };

  const handleClickEdit = useCallback((id: number) => {
    setTodoIdToUpdate(id);
    setPageState(PageState.edit);
  }, []);

  const addTodo = useCallback((todo: Todo) => {
    db.addTodo(todo).then((id) => {
      setTodoList((prev) => [...prev, { ...todo, id }]);
    });
    setPageState(PageState.idle);
  }, []);

  const editTodo = useCallback((id: number, updatedTodo: Todo) => {
    db.updateTodo(updatedTodo, id).then(() => {
      setTodoList((prev) =>
        prev.map((todo) => {
          if (todo.id === id) {
            return { ...updatedTodo, id };
          }
          return todo;
        })
      );
    });
    setPageState(PageState.idle);
    setTodoIdToUpdate(-1);
  }, []);

  const handleClickDelete = useCallback((id: number) => {
    db.deleteTodo(id).then(() => {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    });
  }, []);

  return (
    <>
      <main className="mt-4 mx-4 sm:mx-auto max-w-xl space-y-2">
        <Filter filterValue={filterValue} setFilterValue={setFilterValue} />
        <div>
          <button className="button button-primary" onClick={() => setPageState(PageState.add)}>
            Add Todo
          </button>
        </div>
        <ul className="px-2 py-4 rounded-md space-y-2 dark:bg-neutral-800 shadow-lg">
          {filteredTodoList.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onCheck={handleCheck}
              onDelete={handleClickDelete}
              onEdit={handleClickEdit}
            />
          ))}
        </ul>
        <div className="space-x-2 text-right">
          <button type="button" className="button button-primary" onClick={() => setPageState(PageState.export)}>
            Export Todos
          </button>
          <button type="button" className="button button-primary" onClick={() => setPageState(PageState.import)}>
            Import Todos
          </button>
        </div>
      </main>
      {pageState === PageState.add ? (
        <TodoEditor onSubmit={addTodo} onCancel={() => setPageState(PageState.idle)} />
      ) : null}
      {pageState === PageState.edit ? (
        <TodoEditor
          onSubmit={editTodo.bind(null, todoIdToUpdate)}
          onCancel={handleCloseModal}
          editTodo={todoList.find((v) => v.id === todoIdToUpdate)}
        />
      ) : null}
      {pageState === PageState.export ? <ExportTodos onCancel={handleCloseModal} /> : null}
      {pageState === PageState.import ? <ImportTodos onCancel={handleExitImport} /> : null}
    </>
  );
};

export default TodoList;
