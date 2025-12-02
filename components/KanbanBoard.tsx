import React, { useState } from 'react';
import { ServiceOrder, OSStatus, OSPriority } from '../types';
import { MoreHorizontal, Calendar, User as UserIcon } from 'lucide-react';
import { MOCK_USERS } from '../constants';

interface KanbanBoardProps {
  orders: ServiceOrder[];
  onStatusChange: (osId: string, newStatus: OSStatus) => void;
  onOpenOrder: (os: ServiceOrder) => void;
}

const STATUS_COLUMNS = [
  { id: OSStatus.TODO, label: 'Não Iniciado', color: 'bg-slate-100 border-slate-200' },
  { id: OSStatus.IN_PROGRESS, label: 'Em Andamento', color: 'bg-blue-50 border-blue-100' },
  { id: OSStatus.DONE, label: 'Finalizado', color: 'bg-green-50 border-green-100' },
];

export const KanbanBoard: React.FC<KanbanBoardProps> = ({ orders, onStatusChange, onOpenOrder }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedId(id);
    e.dataTransfer.setData('text/plain', id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, status: OSStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain');
    if (id) {
      onStatusChange(id, status);
    }
    setDraggedId(null);
  };

  const getPriorityColor = (p: OSPriority) => {
    switch (p) {
      case OSPriority.HIGH: return 'text-red-600 bg-red-100';
      case OSPriority.MEDIUM: return 'text-orange-600 bg-orange-100';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  const getAssigneeAvatar = (id?: string) => {
    const user = MOCK_USERS.find(u => u.id === id);
    return user ? user.avatar : 'https://via.placeholder.com/30';
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 h-full overflow-x-auto pb-4">
      {STATUS_COLUMNS.map((col) => {
        const columnOrders = orders.filter(o => o.status === col.id);
        
        return (
          <div 
            key={col.id}
            className={`flex-1 min-w-[300px] rounded-xl border ${col.color} flex flex-col`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, col.id)}
          >
            <div className="p-4 border-b border-black/5 flex justify-between items-center">
              <h3 className="font-semibold text-slate-700">{col.label}</h3>
              <span className="bg-white/50 px-2 py-0.5 rounded-full text-xs font-bold text-slate-600">
                {columnOrders.length}
              </span>
            </div>
            
            <div className="p-3 space-y-3 flex-1 overflow-y-auto max-h-[calc(100vh-250px)]">
              {columnOrders.map(os => (
                <div
                  key={os.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, os.id)}
                  onClick={() => onOpenOrder(os)}
                  className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 cursor-grab active:cursor-grabbing hover:shadow-md transition-all ${draggedId === os.id ? 'opacity-50' : ''}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wide ${getPriorityColor(os.priority)}`}>
                      {os.priority}
                    </span>
                    <button className="text-slate-400 hover:text-slate-600">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                  
                  <h4 className="font-semibold text-slate-800 mb-1 line-clamp-2">{os.title}</h4>
                  <p className="text-xs text-slate-500 mb-3">{os.client}</p>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                    <div className="flex items-center text-slate-400 text-xs gap-1">
                      <Calendar size={12} />
                      <span>{new Date(os.deadline).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {os.assignedToId ? (
                        <img 
                          src={getAssigneeAvatar(os.assignedToId)} 
                          alt="Dev" 
                          className="w-6 h-6 rounded-full border border-white"
                          title="Responsável"
                        />
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center">
                           <UserIcon size={12} className="text-slate-400" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {columnOrders.length === 0 && (
                <div className="h-24 border-2 border-dashed border-slate-300/50 rounded-lg flex items-center justify-center text-slate-400 text-sm">
                  Arraste OS aqui
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};