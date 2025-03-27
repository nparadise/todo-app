import { useCallback, useEffect, useState } from 'react';
import * as db from '../libs/indexedDB';
import { Todo, TodoWithID } from '../libs/types';

const useTodos = () => {
  const [todoList, setTodoList] = useState<TodoWithID[]>([]);

  useEffect(() => {
    db.getTodos().then((todos) => {
      setTodoList(todos);
    });
  }, []);

  const addTodo = useCallback((todo: Todo) => {
    db.addTodo(todo).then((id) => {
      setTodoList((prev) => [...prev, { ...todo, id }]);
    });
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
  }, []);

  const deleteTodo = useCallback((id: number) => {
    db.deleteTodo(id).then(() => {
      setTodoList((prev) => prev.filter((todo) => todo.id !== id));
    });
  }, []);

  const checkTodo = useCallback((id: number, completed: boolean) => {
    db.updateTodoComplete(completed, id).then(() => {
      setTodoList((prev) =>
        prev.map((todo) => {
          if (todo.id === id) {
            return { ...todo, completed };
          }
          return todo;
        })
      );
    });
  }, []);

  return { todoList, addTodo, editTodo, deleteTodo, checkTodo, setTodoList };
};

export default useTodos;
