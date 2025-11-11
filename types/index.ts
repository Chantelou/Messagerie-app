export interface Message {
  id?: number;
  text: string;
  sender: string;
  time: string;
  recever: string
}

export interface Contact {
  name?: string;
  status?: string;
  color?: string;
  id?: string
}
