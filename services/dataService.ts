import { ServiceOrder, User, Message, Role, OSStatus, Log } from '../types';
import { INITIAL_OS, MOCK_USERS } from '../constants';

const STORAGE_KEY_OS = 'agency_os_data';
const STORAGE_KEY_LOGS = 'agency_logs';

// Simulated latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class DataService {
  private osData: ServiceOrder[];
  private logs: Log[];

  constructor() {
    const storedOS = localStorage.getItem(STORAGE_KEY_OS);
    this.osData = storedOS ? JSON.parse(storedOS) : INITIAL_OS;
    
    const storedLogs = localStorage.getItem(STORAGE_KEY_LOGS);
    this.logs = storedLogs ? JSON.parse(storedLogs) : [];
  }

  private save() {
    localStorage.setItem(STORAGE_KEY_OS, JSON.stringify(this.osData));
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.logs));
  }

  async login(email: string): Promise<User | null> {
    await delay(500);
    const user = MOCK_USERS.find(u => u.email === email);
    return user || null;
  }

  getUsers(): User[] {
    return MOCK_USERS;
  }

  getDevs(): User[] {
    return MOCK_USERS.filter(u => u.role === Role.DEV);
  }

  getOrders(user: User): ServiceOrder[] {
    if (user.role === Role.ADMIN || user.role === Role.MANAGER) {
      return this.osData;
    }
    return this.osData.filter(os => os.assignedToId === user.id);
  }

  updateOrderStatus(osId: string, status: OSStatus, userId: string): ServiceOrder {
    const os = this.osData.find(o => o.id === osId);
    if (os) {
      os.status = status;
      this.logAction(osId, userId, `Alterou status para ${status}`);
      this.save();
      return { ...os };
    }
    throw new Error('OS not found');
  }

  addMessage(osId: string, message: Message): ServiceOrder {
    const os = this.osData.find(o => o.id === osId);
    if (os) {
      os.messages.push(message);
      this.save();
      return { ...os };
    }
    throw new Error('OS not found');
  }

  createOrder(order: ServiceOrder): ServiceOrder {
    this.osData.push(order);
    this.logAction(order.id, order.createdBy, 'Criou a Ordem de Serviço');
    this.save();
    return order;
  }

  private logAction(osId: string, userId: string, action: string) {
    const log: Log = {
      id: Math.random().toString(36).substr(2, 9),
      osId,
      userId,
      action,
      timestamp: Date.now(),
    };
    this.logs.push(log);
  }
}

export const dataService = new DataService();