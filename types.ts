export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  DEV = 'DEV',
}

export enum OSStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export enum OSPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
  type: 'text' | 'file';
  fileUrl?: string;
}

export interface ServiceOrder {
  id: string;
  title: string;
  client: string;
  description: string;
  priority: OSPriority;
  status: OSStatus;
  type: string; // e.g., 'Website', 'LP', 'System'
  createdAt: number;
  deadline: number;
  assignedToId?: string; // Developer ID
  createdBy: string; // Manager/Admin ID
  messages: Message[];
  price?: number; // Financial module
}

export interface Log {
  id: string;
  osId: string;
  userId: string;
  action: string;
  timestamp: number;
}