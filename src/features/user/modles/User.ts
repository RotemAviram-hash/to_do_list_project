// features/user/models/User.ts

export interface User {
  id: string;

  fullName: string;
  email: string;

  photoUrl?: string;

  createdAt: string;
  updatedAt?: string;
}
