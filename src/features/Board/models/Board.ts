export interface Board {
  id: string;

  title: string;
  description?: string;

  createdBy: string;

  isPublic: boolean;

  createdAt: string;
  updatedAt?: string;
}
