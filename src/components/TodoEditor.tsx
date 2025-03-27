import { useState } from 'react';
import { Todo } from '../libs/types';
import DatePicker, { registerLocale } from 'react-datepicker';
import { ko } from 'date-fns/locale';

import 'react-datepicker/dist/react-datepicker.css';

registerLocale('ko', ko);

interface TodoAdderProps {
  onSubmit(todo: Todo): void;
  onCancel(): void;
  editTodo?: Todo;
}

const TodoEditor = ({ onSubmit, onCancel, editTodo }: TodoAdderProps) => {
  const [content, setContent] = useState(editTodo?.content ?? '');
  const [dueDate, setDueDate] = useState(editTodo?.dueDate ?? new Date());

  const handleSubmit = () => {
    onSubmit({
      content,
      createdDate: editTodo?.createdDate ?? new Date(),
      dueDate: new Date(dueDate),
      completed: editTodo?.completed ?? false,
    });
  };

  return (
    <div className="wrapper">
      <form className="p-4 space-y-1 rounded-md bg-white dark:bg-black">
        <div className="text-black dark:text-white">
          Content:
          <input
            className="ms-2 px-1 dark:bg-neutral-700 rounded-xs"
            type="text"
            placeholder="type todo..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div className="text-black dark:text-white">
          Due:
          <DatePicker
            showTimeSelect
            selected={dueDate}
            onChange={(date) => (date ? setDueDate(date) : null)}
            timeIntervals={10}
            dateFormat="Pp"
            timeFormat="p"
            locale="ko"
            className="ms-2 px-1 dark:bg-neutral-700 rounded-xs"
          />
        </div>
        <div className="space-x-1 text-center">
          <button type="button" className="px-2 py-1 rounded-sm bg-red-700 text-white" onClick={onCancel}>
            취소
          </button>
          <button
            type="button"
            className="px-2 py-1 rounded-sm bg-blue-700 text-white disabled:bg-neutral-500"
            onClick={handleSubmit}
            disabled={content === ''}
          >
            {editTodo ? '수정' : '추가'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TodoEditor;
