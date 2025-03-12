export interface Todo {
  content: string;
  createdDate: Date;
  dueDate: Date;
  completed: boolean;
}

export interface TodoWithID extends Todo {
  id: number;
}
