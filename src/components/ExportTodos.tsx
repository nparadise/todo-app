import { useEffect, useState } from 'react';
import { getTodos } from '../libs/indexedDB';

interface ExportTodosProps {
  onCancel(): void;
}

const ExportTodos = ({ onCancel }: ExportTodosProps) => {
  const [encodedTodos, setEncodedTodos] = useState<string>('');
  const [showCopyAlert, setShowCopyAlert] = useState<boolean>(false);

  useEffect(() => {
    getTodos().then((todos) => {
      const todosString = JSON.stringify(todos);
      const bytes = new TextEncoder().encode(todosString);
      const binString = Array.from(bytes, (x) => String.fromCodePoint(x)).join('');
      setEncodedTodos(btoa(binString));
    });
  }, []);

  const handleClickCopy = () => {
    navigator.clipboard.writeText(encodedTodos);
    setShowCopyAlert(true);
  };

  return (
    <div className="wrapper">
      <div className="w-[calc(100%-2rem)] sm:max-w-xl m-8 sm:mx-auto p-4 rounded-sm space-y-2 bg-white dark:bg-neutral-800 break-words">
        <h3 className="text-center text-xl">내보내기</h3>
        <p>{encodedTodos}</p>
        <div className="space-x-2 text-center">
          <button className="button button-primary" onClick={onCancel}>
            취소
          </button>
          <button className="button button-primary" onClick={handleClickCopy}>
            복사
          </button>
        </div>
        {showCopyAlert && <p className="text-red-400 text-center">Copy done</p>}
      </div>
    </div>
  );
};

export default ExportTodos;
