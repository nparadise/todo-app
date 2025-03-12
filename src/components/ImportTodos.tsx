import { useState } from 'react';
import { importTodos } from '../libs/indexedDB';

interface ImportedTodo {
  id: number;
  content: string;
  createdDate: string;
  dueDate: string;
  completed: boolean;
}

interface ImportTodosProps {
  onCancel(): void;
}

const ImportTodos = ({ onCancel }: ImportTodosProps) => {
  const [encodedTodos, setEncodedTodos] = useState<string>('');
  const [showImportAlert, setShowImportAlert] = useState<boolean>(false);

  const handleClickImport = () => {
    if (encodedTodos === '') return;

    const binString = atob(encodedTodos);
    const bytes = Uint8Array.from(binString, (m) => m.codePointAt(0)!);
    const todosString = new TextDecoder().decode(bytes);
    const importedTodos: ImportedTodo[] = JSON.parse(todosString);
    importTodos(
      importedTodos.map(({ id, content, createdDate, dueDate, completed }) => ({
        id,
        content,
        createdDate: new Date(createdDate),
        dueDate: new Date(dueDate),
        completed,
      }))
    )
      .then(() => {
        setShowImportAlert(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="wrapper">
      <div className="w-[calc(100%-2rem)] sm:max-w-xl m-8 sm:mx-auto p-4 rounded-sm space-y-2 bg-white dark:bg-neutral-800 break-words text-center">
        <h3 className="text-xl">가져오기</h3>
        <textarea
          className="ps-1 w-9/10 border-2 dark:border-0 border-neutral-300 rounded-sm bg-white dark:bg-neutral-600"
          rows={5}
          placeholder="내보내기를 통해 받은 정보를 입력하세요"
          value={encodedTodos}
          onChange={(e) => setEncodedTodos(e.target.value)}
        />
        <div className="space-x-2 text-center">
          <button className="button button-primary" onClick={onCancel}>
            취소
          </button>
          <button className="button button-primary" onClick={handleClickImport}>
            가져오기
          </button>
        </div>
        {showImportAlert && <p className="text-red-400 text-center">Import done</p>}
      </div>
    </div>
  );
};

export default ImportTodos;
