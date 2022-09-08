export interface IAccountTransaction {
  id: string;
  from: string;
  to: number;
  fee: string;
  date: number;
  status: string;
  type: string;
  block: number;
  value: string;
  nonce: number;
  description: string;
}
