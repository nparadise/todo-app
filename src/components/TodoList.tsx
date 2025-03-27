import { useCallback, useState } from 'react';

import useFilteredTodos from '../hooks/useFilteredTodos';
import useTodos from '../hooks/useTodos';

import * as db from '../libs/indexedDB';
import type { Todo } from '../libs/types';

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
  const { todoList, addTodo, editTodo, deleteTodo, checkTodo, setTodoList } = useTodos();
  const [pageState, setPageState] = useState<PageState>(PageState.idle);
  const [todoIdToUpdate, setTodoIdToUpdate] = useState<number>(-1);

  const { filterValue, setFilterValue, filteredTodoList } = useFilteredTodos(todoList);

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

  const handleSubmitAdd = useCallback(
    (todo: Todo) => {
      addTodo(todo);
      setPageState(PageState.idle);
    },
    [addTodo]
  );

  const handleSubmitEdit = useCallback(
    (id: number, updatedTodo: Todo) => {
      editTodo(id, updatedTodo);
      setPageState(PageState.idle);
      setTodoIdToUpdate(-1);
    },
    [editTodo]
  );

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
              onCheck={checkTodo}
              onDelete={deleteTodo}
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
      {pageState === PageState.add ? <TodoEditor onSubmit={handleSubmitAdd} onCancel={handleCloseModal} /> : null}
      {pageState === PageState.edit ? (
        <TodoEditor
          onSubmit={handleSubmitEdit.bind(null, todoIdToUpdate)}
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
