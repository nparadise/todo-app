import { openDB, type DBSchema } from 'idb';
import { Todo } from './types';

const DB_NAME = 'todo-db';
const STORE_NAME = 'todos';

interface TodoDB extends DBSchema {
  [STORE_NAME]: {
    key: number;
    value: Todo;
    indexes: { 'by-content': string };
  };
}

const dbPromise = openDB<TodoDB>(DB_NAME, 1, {
  upgrade(db) {
    const objectStore = db.createObjectStore(STORE_NAME, {
      autoIncrement: true,
    });
    objectStore.createIndex('by-content', 'content');
  },
});

export const addTodo = async (todo: Todo) => {
  const db = await dbPromise;
  return db.add(STORE_NAME, todo);
};

export const getTodos = async () => {
  const db = await dbPromise;
  const tx = db.transaction(STORE_NAME, 'readonly');

  const [keys, todos] = await Promise.all([tx.store.getAllKeys(), tx.store.getAll(), tx.done]);
  if (keys.length !== todos.length) {
    throw new Error('Mismatch between keys and todos length');
  }
  return todos.map((todo, i) => ({
    ...todo,
    id: keys[i],
  }));
};

export const updateTodo = async (todo: Todo, id: number) => {
  const db = await dbPromise;
  return db.put(STORE_NAME, todo, id);
};

export const updateTodoComplete = async (completed: boolean, id: number): Promise<number> => {
  const tx = (await dbPromise).transaction(STORE_NAME, 'readwrite');
  const data = await tx.store.get(id);
  if (!data) {
    throw new Error(`Todo with id ${id} does not exist in the database.`);
  }
  data.completed = completed;

  await tx.store.put(data, id);
  await tx.done;

  return id;
};

export const deleteTodo = async (id: number) => {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
};

export const importTodos = async (todos: Todo[]) => {
  const tx = (await dbPromise).transaction(STORE_NAME, 'readwrite');

  await tx.store.clear();
  const promises = todos.map((todo) => tx.store.add(todo));

  await Promise.all(promises);
  await tx.done;
};
