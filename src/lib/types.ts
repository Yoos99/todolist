export type Item = {
  id: string;
  tenantId: string;
  name: string;
  memo?: string | null;
  imageUrl?: string | null;
  isCompleted: boolean;
};
