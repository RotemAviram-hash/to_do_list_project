export interface TaskComment {
  id: string; // מזהה ייחודי להערה
  userId: string; // מי כתב את ההערה
  userName?: string; // שם המשתמש (אופציונלי, לתצוגה מהירה)
  userAvatar?: string; // תמונת פרופיל (אופציונלי)
  content: string; // תוכן ההערה
  createdAt: string; // תאריך ושעת יצירה (ISO string)
}

export interface Task {
  id: string;
  columnId: string;
  boardId: string;

  title: string;
  description: string;

  createdBy: string;
  assigneeId: string;

  savedBy: string[];
  comments?: TaskComment[]; // <--- המערך החדש של ההערות!

  createdAt: string;
  dueDate: string;

  order: number;
}
