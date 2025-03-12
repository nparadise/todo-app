import { openDB, type DBSchema } from 'idb';
import { Todo, TodoWithID } from './types';

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
  return new Promise<TodoWithID[]>((resolve, reject) => {
    if (keys.length !== todos.length) {
      reject();
      return;
    }
    resolve(
      todos.map((todo, i) => ({
        ...todo,
        id: keys[i],
      }))
    );
  });
};

export const updateTodo = async (todo: Todo, id: number) => {
  const db = await dbPromise;
  console.log(todo, id);
  return db.put(STORE_NAME, todo, id);
};

export const updateTodoComplete = async (completed: boolean, id: number): Promise<number> => {
  const tx = (await dbPromise).transaction(STORE_NAME, 'readwrite');
  const data = await tx.store.get(id);
  if (!data) {
    throw new Error('No todo with corresponding id: ' + id);
  }
  data.completed = completed;

  const [ret] = await Promise.all([tx.store.put(data, id), tx.done]);

  return new Promise((resolve) => {
    resolve(ret);
  });
};

export const deleteTodo = async (id: number) => {
  const db = await dbPromise;
  return db.delete(STORE_NAME, id);
};

export const importTodos = async (todos: Todo[]) => {
  const tx = (await dbPromise).transaction(STORE_NAME, 'readwrite');
  const promises: Promise<unknown>[] = [];

  tx.store.clear();

  for (const todo of todos) {
    promises.push(tx.store.add(todo));
  }
  promises.push(tx.done);

  return await Promise.all(promises);
};
