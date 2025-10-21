export interface IUser {
  _id: string;
  userName: string;
  email: string;
  mobileNumber: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUseUsers {
  users: IUser[];
  page: number;
  pagesCount: number;
  loading: boolean;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  fetchUsers: (pageNum?: number) => Promise<void>;
}

export interface UserModalProps {
  open: boolean;
  onClose: () => void;
  user: IUser | null;
}

export interface UserTableProps {
  users: IUser[];
  onView: (user: IUser) => void;
  onEdit: (user: IUser) => void;
  onHardDelete: (id: string) => void;
  onSoftDelete: (id: string) => void;
  onBlock: (id: string) => void;
}
