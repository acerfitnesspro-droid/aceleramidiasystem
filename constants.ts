import { Role, User, OSStatus, OSPriority, ServiceOrder } from './types';

// Mock Users for seamless login
export const MOCK_USERS: User[] = [
  {
    id: 'u1',
    name: 'Carlos Dono',
    email: 'admin@agency.com',
    role: Role.ADMIN,
    avatar: 'https://picsum.photos/seed/admin/100/100',
  },
  {
    id: 'u2',
    name: 'Mariana Gestora',
    email: 'manager@agency.com',
    role: Role.MANAGER,
    avatar: 'https://picsum.photos/seed/manager/100/100',
  },
  {
    id: 'u3',
    name: 'João Dev',
    email: 'dev@agency.com',
    role: Role.DEV,
    avatar: 'https://picsum.photos/seed/dev/100/100',
  },
  {
    id: 'u4',
    name: 'Ana Dev',
    email: 'ana@agency.com',
    role: Role.DEV,
    avatar: 'https://picsum.photos/seed/dev2/100/100',
  },
];

// Initial Service Orders
export const INITIAL_OS: ServiceOrder[] = [
  {
    id: 'OS-1001',
    title: 'E-commerce Redesign',
    client: 'Loja Fashion',
    description: 'Redesign completo da home e checkout.',
    priority: OSPriority.HIGH,
    status: OSStatus.IN_PROGRESS,
    type: 'E-commerce',
    createdAt: Date.now() - 100000000,
    deadline: Date.now() + 500000000,
    assignedToId: 'u3',
    createdBy: 'u2',
    price: 5000,
    messages: [
      {
        id: 'm1',
        senderId: 'u2',
        senderName: 'Mariana Gestora',
        content: 'O cliente precisa disso urgente!',
        timestamp: Date.now() - 500000,
        type: 'text',
      }
    ],
  },
  {
    id: 'OS-1002',
    title: 'Landing Page Evento',
    client: 'Tech Summit',
    description: 'LP para captação de leads.',
    priority: OSPriority.MEDIUM,
    status: OSStatus.TODO,
    type: 'Landing Page',
    createdAt: Date.now() - 20000000,
    deadline: Date.now() + 200000000,
    assignedToId: 'u4',
    createdBy: 'u1',
    price: 1500,
    messages: [],
  },
  {
    id: 'OS-1003',
    title: 'Integração API Pagamento',
    client: 'SaaS App',
    description: 'Integrar Stripe no backend.',
    priority: OSPriority.HIGH,
    status: OSStatus.DONE,
    type: 'Backend',
    createdAt: Date.now() - 600000000,
    deadline: Date.now() - 100000000,
    assignedToId: 'u3',
    createdBy: 'u2',
    price: 3000,
    messages: [],
  },
];