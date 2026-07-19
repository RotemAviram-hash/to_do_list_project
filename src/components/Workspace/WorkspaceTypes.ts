export type Board = {
  id: string;
  title: string;
  createdBy: string;
  createdAt: number;
  public: boolean;
};

export type Column = {
  id: string;
  boardId: string;
  title: string;
  createdBy: string;
  createdAt: number;
  color: string;
  borderColor: string;
};

export type Task = {
  id: string;
  columnId: string;
  title: string;
  description: string;
  createdBy: string;
  assigneeId: string;
  savedBy: string[];
  createdAt: string;
  duDate: string;
};
