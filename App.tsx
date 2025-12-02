import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { User, ServiceOrder, OSStatus, Role } from './types';
import { dataService } from './services/dataService';
import { KanbanBoard } from './components/KanbanBoard';
import { Dashboard } from './components/Dashboard';
import { OSModal } from './components/OSModal';
import { Layout, LayoutDashboard, Plus, Search, Bell, LogOut } from 'lucide-react';

// --- Login Component ---
const LoginScreen: React.FC<{ onLogin: (user: User) => void }> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const user = await dataService.login(email);
    setLoading(false);
    if (user) onLogin(user);
    else alert('Usuário não encontrado. Tente: admin@agency.com');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-xl mx-auto flex items-center justify-center mb-4 text-white shadow-lg shadow-blue-500/30">
            <Layout size={32} />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">AgencyFlow</h1>
          <p className="text-slate-500">Entre para gerenciar seus projetos</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="seu@email.com"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-blue-500/30 disabled:opacity-70"
          >
            {loading ? 'Entrando...' : 'Acessar Sistema'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100">
          <p className="text-xs text-center text-slate-400 mb-2">Acesso Rápido (Demo):</p>
          <div className="flex gap-2 justify-center flex-wrap">
            <button onClick={() => setEmail('admin@agency.com')} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Admin</button>
            <button onClick={() => setEmail('manager@agency.com')} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Gestor</button>
            <button onClick={() => setEmail('dev@agency.com')} className="text-xs bg-slate-100 px-2 py-1 rounded hover:bg-slate-200">Dev</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- App Shell ---
const AppLayout: React.FC<{ user: User; onLogout: () => void; children: React.ReactNode }> = ({ user, onLogout, children }) => {
  const location = useLocation();
  
  const navItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Painel', path: '/' },
    { icon: <Layout size={20} />, label: 'Pipeline / OS', path: '/kanban' },
  ];

  const roleTranslation: Record<Role, string> = {
    [Role.ADMIN]: 'Administrador',
    [Role.MANAGER]: 'Gestor Comercial',
    [Role.DEV]: 'Desenvolvedor'
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white hidden md:flex flex-col">
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <Layout size={18} />
          </div>
          <span className="font-bold text-lg">AgencyFlow</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={`#${item.path}`}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                location.pathname === item.path ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full bg-slate-700" />
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <p className="text-xs text-slate-500">{roleTranslation[user.role]}</p>
            </div>
          </div>
          <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:text-white text-sm py-2">
            <LogOut size={16} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-4 text-slate-400">
            <Search size={20} />
            <input type="text" placeholder="Buscar OS, cliente..." className="bg-transparent outline-none text-slate-700 w-64 text-sm" />
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-slate-600">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            {user.role !== Role.DEV && (
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30">
                <Plus size={18} /> Nova OS
              </button>
            )}
          </div>
        </header>
        <div className="flex-1 overflow-auto p-6 relative">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [selectedOS, setSelectedOS] = useState<ServiceOrder | null>(null);

  useEffect(() => {
    if (user) {
      loadOrders();
      // Simulation of real-time polling
      const interval = setInterval(loadOrders, 5000); 
      return () => clearInterval(interval);
    }
  }, [user]);

  const loadOrders = () => {
    if (user) {
      const data = dataService.getOrders(user);
      setOrders(data);
    }
  };

  const handleStatusChange = (id: string, newStatus: OSStatus) => {
    if (!user) return;
    try {
      dataService.updateOrderStatus(id, newStatus, user.id);
      loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  return (
    <HashRouter>
      <AppLayout user={user} onLogout={() => setUser(null)}>
        <Routes>
          <Route path="/" element={<Dashboard orders={orders} user={user} />} />
          <Route 
            path="/kanban" 
            element={
              <KanbanBoard 
                orders={orders} 
                onStatusChange={handleStatusChange} 
                onOpenOrder={setSelectedOS}
              />
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {selectedOS && (
          <OSModal 
            os={selectedOS} 
            currentUser={user} 
            onClose={() => { setSelectedOS(null); loadOrders(); }}
            onUpdate={loadOrders}
          />
        )}
      </AppLayout>
    </HashRouter>
  );
};

export default App;