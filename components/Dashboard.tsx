import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { ServiceOrder, OSStatus, Role, User, OSPriority } from '../types';
import { DollarSign, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface DashboardProps {
  orders: ServiceOrder[];
  user: User;
}

const COLORS = ['#94a3b8', '#3b82f6', '#22c55e']; // Todo, In Progress, Done

export const Dashboard: React.FC<DashboardProps> = ({ orders, user }) => {
  
  const stats = useMemo(() => {
    const total = orders.length;
    const completed = orders.filter(o => o.status === OSStatus.DONE).length;
    const inProgress = orders.filter(o => o.status === OSStatus.IN_PROGRESS).length;
    const pending = orders.filter(o => o.status === OSStatus.TODO).length;
    const delayed = orders.filter(o => o.status !== OSStatus.DONE && o.deadline < Date.now()).length;
    const revenue = orders.reduce((acc, curr) => acc + (curr.price || 0), 0);
    
    return { total, completed, inProgress, pending, delayed, revenue };
  }, [orders]);

  const statusData = [
    { name: 'Não Iniciado', value: stats.pending },
    { name: 'Em Andamento', value: stats.inProgress },
    { name: 'Finalizado', value: stats.completed },
  ];

  const revenueData = useMemo(() => {
    // Simple mock projection for chart
    return [
      { name: 'Jan', value: 4000 },
      { name: 'Fev', value: 3000 },
      { name: 'Mar', value: stats.revenue }, // Current
    ];
  }, [stats.revenue]);

  const getPriorityLabel = (priority: OSPriority) => {
    switch(priority) {
      case OSPriority.HIGH: return 'ALTA';
      case OSPriority.MEDIUM: return 'MÉDIA';
      case OSPriority.LOW: return 'BAIXA';
      default: return priority;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          Painel {user.role === Role.DEV ? 'de Desenvolvimento' : 'Geral'}
        </h2>
        <span className="text-sm text-slate-500">Atualizado agora</span>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 bg-blue-100 rounded-lg text-blue-600 mr-4">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Em Andamento</p>
            <p className="text-2xl font-bold text-slate-800">{stats.inProgress}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 bg-green-100 rounded-lg text-green-600 mr-4">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Finalizadas</p>
            <p className="text-2xl font-bold text-slate-800">{stats.completed}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
          <div className="p-3 bg-red-100 rounded-lg text-red-600 mr-4">
            <AlertTriangle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Atrasadas</p>
            <p className="text-2xl font-bold text-slate-800">{stats.delayed}</p>
          </div>
        </div>

        {user.role !== Role.DEV && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600 mr-4">
              <DollarSign size={24} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Receita Est.</p>
              <p className="text-2xl font-bold text-slate-800">R$ {stats.revenue.toLocaleString()}</p>
            </div>
          </div>
        )}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
          <h3 className="text-lg font-semibold text-slate-700 mb-4">Status das OS</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {user.role !== Role.DEV && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-700 mb-4">Performance Financeira</h3>
             <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f1f5f9' }} />
                  <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
             </div>
          </div>
        )}
        
        {user.role === Role.DEV && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-semibold text-slate-700 mb-4">Minhas Tarefas Recentes</h3>
             <ul className="space-y-3">
               {orders.slice(0, 5).map(os => (
                 <li key={os.id} className="flex justify-between items-center p-2 hover:bg-slate-50 rounded">
                   <div>
                     <p className="font-medium text-slate-700">{os.title}</p>
                     <p className="text-xs text-slate-500">{os.client}</p>
                   </div>
                   <span className={`px-2 py-1 rounded text-xs font-semibold ${
                     os.priority === 'HIGH' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                   }`}>
                     {getPriorityLabel(os.priority)}
                   </span>
                 </li>
               ))}
             </ul>
          </div>
        )}
      </div>
    </div>
  );
};