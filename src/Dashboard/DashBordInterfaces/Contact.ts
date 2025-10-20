export interface IContact {
  _id: string;
  fullName: string;
  email: string;
  message: string;
  reply?: string | null;
  repliedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IReplyContact {
  _id: string;
  fullName: string;
  email: string;
  message: string;
  reply: string;
  repliedAt: string;
}
