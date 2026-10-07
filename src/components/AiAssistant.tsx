import React, { useState, useRef, useEffect } from 'react';
import { OutfitState, EventModel, ClothingItem, ChatMessage, CulturalWarning, ColorHarmonyResult } from '../types';
import { generateStylistResponse } from '../utils/aiStylist';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  Lightbulb, 
  ArrowRight,
  RotateCcw
} from 'lucide-react';

interface AiAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  outfit: OutfitState;
  currentEvent: EventModel;
  itemsMap: Record<string, ClothingItem>;
  warnings: CulturalWarning[];
  harmony: ColorHarmonyResult;
  onApplyOutfitAction: (payload: any) => void;
  onFixWarning: () => void;
  onShowTab: (tab: string) => void;
}

export const AiAssistant: React.FC<AiAssistantProps> = ({
  isOpen,
  onClose,
  outfit,
  currentEvent,
  itemsMap,
  warnings,
  harmony,
  onApplyOutfitAction,
  onFixWarning,
  onShowTab,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: `Xin chào! Mình là **An - AI Cố Vấn Việt Phục Remix**. ✨\n\nMình được huấn luyện để giải đáp mọi câu hỏi về: lịch sử triều đại, biểu tượng cúc áo, quy tắc vạt hữu, hòa sắc Ngũ Hành và các mẹo remix streetwear cực chất.\n\nHiện tại bạn đang chuẩn bị đồ cho sự kiện **"${currentEvent.name}"**. Bạn cần mình gợi ý set đồ gì nào?`,
      timestamp: 'Vừa xong',
      suggestedActions: [
        { label: 'Gợi ý set chuẩn sự kiện này', actionType: 'applyOutfit', payload: { applyEventPresets: true } },
        { label: 'Quy tắc cài cúc Áo Ngũ Thân', actionType: 'viewItem' },
        { label: 'Kiểm tra hòa sắc Ngũ Hành', actionType: 'showTab', payload: 'harmony' }
      ]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickPrompts = [
    'Gợi ý set chuẩn sự kiện này',
    'Quy tắc cài cúc Áo Ngũ Thân?',
    'Phối Áo Tấc với giày gì cho ngầu?',
    'Nón Quai Thao đi với áo gì chuẩn nhất?',
    'Màu sắc nào kiêng kỵ khi đi đám cưới?'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputValue;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Vừa xong'
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateStylistResponse(text, {
        outfit,
        currentEvent,
        itemsMap,
        warnings,
        harmony
      });

      const assistantMsg: ChatMessage = {
        id: `assistant_${Date.now()}`,
        sender: 'assistant',
        text: response.text,
        timestamp: 'Vừa xong',
        suggestedActions: response.suggestedActions
      };

      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleActionClick = (action: NonNullable<ChatMessage['suggestedActions']>[0]) => {
    if (action.actionType === 'applyOutfit') {
      onApplyOutfitAction(action.payload);
    } else if (action.actionType === 'fixWarning') {
      onFixWarning();
    } else if (action.actionType === 'showTab') {
      onShowTab(action.payload);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[420px] bg-[#141418] border-l border-white/10 shadow-2xl flex flex-col animate-slideLeft">
      {/* Drawer Header */}
      <div className="p-4 border-b border-white/10 bg-[#1a1a20] flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#c93b2b] flex items-center justify-center text-white shadow-md">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold text-white flex items-center gap-1.5">
              <span>An · AI Stylist Việt Phục</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </h3>
            <p className="text-[10px] text-zinc-400">
              Trợ lý văn hóa & thời trang Gen Z trực tuyến
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs scrollbar-thin">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-[#c93b2b] text-white rounded-tr-sm shadow-md'
                  : 'bg-white/5 border border-white/10 text-zinc-200 rounded-tl-sm'
              }`}
            >
              {msg.text}
            </div>

            {/* Suggested Interactive Action Buttons */}
            {msg.suggestedActions && msg.suggestedActions.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap mt-2 pl-1">
                {msg.suggestedActions.map((act, i) => (
                  <button
                    key={i}
                    onClick={() => handleActionClick(act)}
                    className="px-2.5 py-1 bg-[#c93b2b]/20 hover:bg-[#c93b2b] text-[#ff7566] hover:text-white border border-[#c93b2b]/30 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <span>{act.label}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-1.5 text-zinc-500 text-[11px] pl-2">
            <Sparkles className="w-3.5 h-3.5 text-[#c93b2b] animate-spin" />
            <span>An đang suy nghĩ & tra cứu tư liệu...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Ribbon */}
      <div className="p-2 border-t border-white/5 bg-[#121216] overflow-x-auto scrollbar-none flex items-center gap-1.5">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-full text-[10px] whitespace-nowrap transition-colors border border-white/5 cursor-pointer"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-white/10 bg-[#16161c] flex items-center gap-2"
      >
        <input
          type="text"
          placeholder="Hỏi về lịch sử, cách phối đồ, kiêng kỵ..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          className="flex-1 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#c93b2b]"
        />
        <button
          type="submit"
          className="p-2 bg-[#c93b2b] hover:bg-[#b02f20] text-white rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
