// src/features/Board/models/Board.ts

export type BoardMemberRole = "owner" | "editor" | "viewer";

export interface BoardMember {
  userId: string;
  role: BoardMemberRole;
  addedAt?: string;
}

export interface Board {
  id: string;
  title: string;
  description?: string;
  createdBy: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt?: string;
  columnCount: number;

  // 👥 ניהול חברים והרשאות בלוח:
  members?: Record<string, BoardMemberRole>; // מפה של userId -> role (מעולה לבדיקת הרשאות מהירה)
  memberIds?: string[]; // מערך של userId (קריטי לשאילתת array-contains ב-Firestore!)
}
