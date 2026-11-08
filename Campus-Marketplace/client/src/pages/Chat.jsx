import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { 
  Send, 
  Search, 
  ShoppingBag, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  ExternalLink,
  Sparkles,
  MessageSquare
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

const QUICK_PROMPTS = [
  "Hi, is this item still available?",
  "Can we meet at the Central Canteen?",
  "Are you free around 4:30 PM today?",
  "Would you consider ₹50 less if I pickup today?",
  "Is the condition exactly as in the photo?"
];

const Chat = () => {
  const { chats, sendMessage, markChatAsRead, loadChats } = useMarketplace();
  const location = useLocation();

  const initialChatId = location.state?.activeChatId || chats[0]?.id;
  const [activeChatId, setActiveChatId] = useState(initialChatId);
  const [inputText, setInputText] = useState('');
  const [chatSearch, setChatSearch] = useState('');

  const messagesEndRef = useRef(null);

  const activeChat = chats.find(c => c.id === activeChatId) || chats[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages]);

  useEffect(() => {
    if (!location.state?.activeChatId && chats.length && !chats.some((chat) => chat.id === activeChatId)) {
      setActiveChatId(chats[0].id);
    }
  }, [activeChatId, chats, location.state?.activeChatId]);

  useEffect(() => {
    const intervalId = window.setInterval(loadChats, 5000);
    return () => window.clearInterval(intervalId);
  }, [loadChats]);

  useEffect(() => {
    if (activeChat?.id && activeChat.unread) {
      markChatAsRead(activeChat.id);
    }
  }, [activeChat?.id, activeChat?.unread, markChatAsRead]);

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim() || !activeChat) return;

    sendMessage(activeChat.id, text);
    setInputText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const filteredChats = chats.filter(c => {
    if (!chatSearch.trim()) return true;
    const q = chatSearch.toLowerCase();
    return (
      c.participant?.name?.toLowerCase().includes(q) ||
      c.productTitle?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-100 py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden flex-1 grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
        
        {/* Left Sidebar: Conversations List */}
        <div className="md:col-span-5 lg:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <h1 className="text-base font-black text-slate-900 tracking-tight">Messages</h1>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                {chats.length} active
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Search student or item..."
                value={chatSearch}
                onChange={(e) => setChatSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Conversations Scroll Area */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredChats.map((chat) => {
              const lastMsg = chat.messages?.[chat.messages.length - 1];
              const isSelected = chat.id === activeChat?.id;

              return (
                <div
                  key={chat.id}
                  onClick={() => setActiveChatId(chat.id)}
                  className={`p-4 cursor-pointer transition-colors flex items-start space-x-3 ${
                    isSelected ? 'bg-indigo-50/70 border-r-4 border-indigo-600' : 'hover:bg-slate-100/70'
                  }`}
                >
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.participant?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={chat.participant?.name}
                      className="w-11 h-11 rounded-2xl object-cover border border-slate-200"
                    />
                    {chat.unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                        {chat.unread}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {chat.participant?.name}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {lastMsg?.time || 'Today'}
                      </span>
                    </div>

                    <p className="text-[11px] font-semibold text-indigo-700 truncate mt-0.5">
                      {chat.productTitle}
                    </p>

                    <p className="text-xs text-slate-500 truncate mt-1">
                      {lastMsg?.isSelf && <span className="text-slate-400">You: </span>}
                      {lastMsg?.text || 'No messages yet'}
                    </p>
                  </div>
                </div>
              );
            })}

            {filteredChats.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No matching conversations.
              </div>
            )}
          </div>
        </div>

        {/* Right Main Chat Area */}
        {activeChat ? (
          <div className="md:col-span-7 lg:col-span-8 flex flex-col h-full bg-white">
            
            {/* Active Chat Header */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white/95 backdrop-blur-md">
              <div className="flex items-center space-x-3">
                <img
                  src={activeChat.participant?.avatar}
                  alt={activeChat.participant?.name}
                  className="w-10 h-10 rounded-2xl object-cover border border-slate-200"
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <h3 className="text-sm font-bold text-slate-900">
                      {activeChat.participant?.name}
                    </h3>
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {activeChat.participant?.department}
                  </span>
                </div>
              </div>

              {/* Product mini badge */}
              <Link
                to={`/product/${activeChat.productId}`}
                className="flex items-center space-x-2.5 p-1.5 pr-3 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                <img
                  src={activeChat.productImage}
                  alt={activeChat.productTitle}
                  className="w-8 h-8 rounded-xl object-cover"
                />
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-bold text-slate-800 line-clamp-1 max-w-[140px]">
                    {activeChat.productTitle}
                  </p>
                  <span className="text-xs font-black text-indigo-600">
                    ₹{activeChat.productPrice?.toLocaleString('en-IN')}
                  </span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              </Link>
            </div>

            {/* Chat Messages List */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
              
              {/* Campus Meet Safety Reminder Pill */}
              <div className="text-center my-2">
                <span className="inline-flex items-center space-x-1.5 text-[11px] font-medium text-indigo-700 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full shadow-xs">
                  <Sparkles className="w-3 h-3 text-indigo-600" />
                  <span>College Safe Trade: Meet at ABES Central Cafeteria or Main Gate</span>
                </span>
              </div>

              {activeChat.messages?.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                      msg.isSelf
                        ? 'bg-indigo-600 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1 px-1">
                    {msg.time}
                  </span>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Negotiation Prompts Bar */}
            <div className="px-4 py-2 bg-slate-50 border-t border-slate-200/80 overflow-x-auto flex items-center space-x-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex-shrink-0">
                Quick Deal:
              </span>
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 border border-slate-200 transition-colors whitespace-nowrap shadow-xs"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form Bar */}
            <div className="p-4 bg-white border-t border-slate-200">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center space-x-2"
              >
                <input
                  type="text"
                  placeholder="Type your message to seller or propose a meeting spot..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white outline-none focus:border-indigo-500 text-slate-800 transition-colors"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>
        ) : (
          <div className="md:col-span-7 lg:col-span-8 flex flex-col items-center justify-center p-8 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-2 text-slate-300" />
            <p className="text-sm font-bold text-slate-700">No conversation selected</p>
            <p className="text-xs text-slate-400 mt-1">Pick a chat from the sidebar or click "Contact Seller" on a product.</p>
          </div>
        )}

      </div>
    </div>
  );
};

export default Chat;
