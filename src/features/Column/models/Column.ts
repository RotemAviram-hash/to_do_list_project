export type ColumnTheme =
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "gray"
  | "cyan"
  | "pink"
  | "orange"
  | "indigo"
  | "teal";

export interface Column {
  id: string;

  boardId: string;

  title: string;

  theme: ColumnTheme;

  order: number;

  createdBy: string;

  createdAt: string;
  updatedAt?: string;
}
