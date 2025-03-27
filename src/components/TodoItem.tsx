import { memo } from 'react';
import { TodoWithID } from '../libs/types';

interface TodoItemProps {
  todo: TodoWithID;
  onCheck(id: number, checked: boolean): void;
  onDelete(id: number): void;
  onEdit(id: number): void;
}

function formatDate(date: Date): string {
  const today = new Date();

  // 출력 날짜가 오늘과 년월일이 같으면 시간만 출력
  // 출력 날짜가 오늘과 년도가 같으면 월일만 출력
  // 그 외에는 년월일 모두 출력
  if (date.toLocaleDateString() === today.toLocaleDateString()) {
    return `${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
  } else if (date.getFullYear() === today.getFullYear()) {
    return `${date.getMonth() + 1}.${date.getDate()}.`;
  } else {
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}.`;
  }
}

const TodoItem = memo(({ todo, onCheck, onDelete, onEdit }: TodoItemProps) => {
  const isOverdue = todo.dueDate.valueOf() < Date.now();

  return (
    <li
      className={`flex justify-between items-center px-2 hover:bg-blue-100 dark:hover:bg-blue-950 hover:rounded-sm py-1 ${
        isOverdue ? 'text-red-700' : ''
      } ${todo.completed ? 'text-neutral-600 line-through' : ''}`}
    >
      <label className="flex gap-2 cursor-pointer grow">
        <input
          type="checkbox"
          name="completed"
          id="completed"
          checked={todo.completed}
          onChange={(e) => onCheck(todo.id, e.target.checked)}
        />
        <p className="grow" title={todo.content}>
          {todo.content}
        </p>
      </label>
      <div className="flex gap-1">
        <div className="w-10 text-center">{formatDate(todo.createdDate)}</div>
        <div className="w-10 text-center">{formatDate(todo.dueDate)}</div>
        <button className="button-primary rounded-sm cursor-pointer" onClick={() => onEdit(todo.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff">
            <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
          </svg>
        </button>
        <button className="button-reject rounded-sm cursor-pointer" onClick={() => onDelete(todo.id)}>
          <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff">
            <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
          </svg>
        </button>
      </div>
    </li>
  );
});

export default TodoItem;
