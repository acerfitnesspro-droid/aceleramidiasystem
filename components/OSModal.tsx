import React, { useState, useRef, useEffect } from 'react';
import { ServiceOrder, Message, User, Role } from '../types';
import { X, Send, Paperclip, CheckCircle, Clock, Calendar, User as UserIcon } from 'lucide-react';
import { dataService } from '../services/dataService';

interface OSModalProps {
  os: ServiceOrder;
  currentUser: User;
  onClose: () => void;
  onUpdate: () => void;
}

export const OSModal: React.FC<OSModalProps> = ({ os, currentUser, onClose, onUpdate }) => {
  const [messages, setMessages] = useState<Message[]>(os.messages);
  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const msg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      senderName: currentUser.name,
      content: newMessage,
      timestamp: Date.now(),
      type: 'text',
    };

    const updatedOs = dataService.addMessage(os.id, msg);
    setMessages(updatedOs.messages);
    setNewMessage('');
    onUpdate();
  };

  const formatDate = (ts: number) => new Date(ts).toLocaleString();

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] flex flex-col md:flex-row shadow-2xl overflow-hidden animate-fade-in">
        
        {/* Left: Details */}
        <div className="md:w-7/12 p-6 overflow-y-auto bg-slate-50 border-r border-slate-200">
          <div className="flex justify-between items-start mb-6">
            <div>
              <span className="text-xs font-mono text-slate-500 bg-slate-200 px-2 py-1 rounded mb-2 inline-block">
                #{os.id}
              </span>
              <h2 className="text-2xl font-bold text-slate-800">{os.title}</h2>
              <p className="text-slate-600 font-medium">{os.client}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors md:hidden">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Prazo</p>
              <div className="flex items-center gap-2 text-slate-800">
                <Calendar size={16} className="text-blue-500" />
                <span className="font-medium">{new Date(os.deadline).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
              <p className="text-xs text-slate-500 uppercase font-bold mb-1">Status</p>
              <div className="flex items-center gap-2">
                {os.status === 'DONE' ? <CheckCircle size={16} className="text-green-500"/> : <Clock size={16} className="text-yellow-500"/>}
                <span className="font-medium text-slate-800">{os.status}</span>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase mb-2">Descrição</h3>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-600 leading-relaxed whitespace-pre-wrap">
              {os.description}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-bold text-slate-700 uppercase mb-2">Equipe</h3>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                    <UserIcon size={20} />
                 </div>
                 <div>
                   <p className="text-xs text-slate-400">Responsável</p>
                   <p className="font-medium text-slate-800">
                     {os.assignedToId ? dataService.getUsers().find(u => u.id === os.assignedToId)?.name : 'Não atribuído'}
                   </p>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Chat */}
        <div className="md:w-5/12 flex flex-col bg-white h-full relative">
           <div className="p-4 border-b border-slate-100 flex justify-between items-center">
             <h3 className="font-bold text-slate-700 flex items-center gap-2">
               Chat da Equipe <span className="text-xs font-normal text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{messages.length}</span>
             </h3>
             <button onClick={onClose} className="hidden md:block p-1 hover:bg-slate-100 rounded-full text-slate-400">
               <X size={20} />
             </button>
           </div>

           <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
             {messages.map((msg) => {
               const isMe = msg.senderId === currentUser.id;
               return (
                 <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-[80%] ${isMe ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none'} rounded-xl p-3 shadow-sm`}>
                     {!isMe && <p className="text-xs font-bold mb-1 opacity-70">{msg.senderName}</p>}
                     <p className="text-sm">{msg.content}</p>
                     <p className={`text-[10px] mt-1 ${isMe ? 'text-blue-200' : 'text-slate-400'} text-right`}>
                       {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                     </p>
                   </div>
                 </div>
               );
             })}
             <div ref={chatEndRef} />
           </div>

           <div className="p-4 bg-white border-t border-slate-100">
             <div className="flex gap-2 items-center">
               <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
                 <Paperclip size={20} />
               </button>
               <input
                 type="text"
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                 placeholder="Digite sua mensagem..."
                 className="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
               />
               <button 
                onClick={handleSendMessage}
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-transform active:scale-95 shadow-lg shadow-blue-500/30"
               >
                 <Send size={18} />
               </button>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
};