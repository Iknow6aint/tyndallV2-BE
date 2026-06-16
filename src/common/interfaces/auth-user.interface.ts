export type AuthRole =
  | 'hq_admin'
  | 'branch_admin'
  | 'analyst'
  | 'field_technician';

export interface RequestUser {
  id: string;
  name: string;
  email: string;
  role: AuthRole;
  branchId: string | null;
}
