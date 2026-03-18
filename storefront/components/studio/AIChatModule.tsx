import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Send, X, Bot, User, Sparkles } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIChatModuleProps {
  isOpen: boolean;
  position: { x: number; y: number };
  elementContent: string;
  elementType: 'heading' | 'body';
  onClose: () => void;
  onApplyText: (newText: string) => void;
}

export function AIChatModule({
  isOpen,
  position,
  elementContent,
  elementType,
  onClose,
  onApplyText
}: AIChatModuleProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Initialize chat with context message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const initialMessage: Message = {
        id: '1',
        text: `Hi! I'm your AI writing assistant. I can help you improve, rewrite, or expand the ${elementType} text: "${elementContent}". What would you like me to help you with?`,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages([initialMessage]);
      
      // Focus input when opened
      setTimeout(() => {
        const input = document.querySelector('.ai-chat-input') as HTMLInputElement;
        if (input) {
          input.focus();
        }
      }, 100);
    }
  }, [isOpen, elementContent, elementType, messages.length]);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscapeKey);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Handle menu positioning
  const getModuleStyle = () => {
    if (!isOpen) return { display: 'none' };

    const moduleWidth = 320;
    const moduleHeight = 400;
    const padding = 10;

    let x = position.x;
    let y = position.y;

    // Adjust horizontal position if module would go off-screen
    if (x + moduleWidth > window.innerWidth - padding) {
      x = window.innerWidth - moduleWidth - padding;
    }
    if (x < padding) {
      x = padding;
    }

    // Adjust vertical position if module would go off-screen
    if (y + moduleHeight > window.innerHeight - padding) {
      y = window.innerHeight - moduleHeight - padding;
    }
    if (y < padding) {
      y = padding;
    }

    return {
      position: 'fixed' as const,
      left: `${x}px`,
      top: `${y}px`,
      zIndex: 1000,
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Simulate AI response (in real implementation, this would call an AI API)
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputText, elementContent);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1000 + Math.random() * 1000);
  };

  const generateAIResponse = (userInput: string, originalText: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('improve') || input.includes('better')) {
      return `Here's an improved version of your ${elementType}:\n\n"${enhanceText(originalText)}"\n\nWould you like me to apply this to your element?`;
    } else if (input.includes('shorter') || input.includes('brief')) {
      return `Here's a more concise version:\n\n"${shortenText(originalText)}"\n\nShall I update your text with this version?`;
    } else if (input.includes('longer') || input.includes('expand')) {
      return `Here's an expanded version:\n\n"${expandText(originalText)}"\n\nWould you like to use this expanded version?`;
    } else if (input.includes('formal')) {
      return `Here's a more formal version:\n\n"${formalizeText(originalText)}"\n\nShould I apply this formal tone?`;
    } else if (input.includes('casual')) {
      return `Here's a more casual version:\n\n"${casualizeText(originalText)}"\n\nWould you like to use this casual tone?`;
    } else {
      return `I can help you with various text improvements:\n\n• **Improve clarity** - Make your text clearer and more engaging\n• **Adjust length** - Make it shorter or longer as needed\n• **Change tone** - Formal, casual, professional, friendly\n• **Fix grammar** - Correct any grammatical issues\n• **Enhance style** - Improve readability and flow\n\nWhat specific help do you need with: "${originalText}"?`;
    }
  };

  const enhanceText = (text: string): string => {
    // Simple text enhancement logic (in real app, this would use AI)
    return text.replace(/\.$/, ' - enhanced for clarity and impact.');
  };

  const shortenText = (text: string): string => {
    return text.split(' ').slice(0, Math.max(3, Math.floor(text.split(' ').length * 0.7))).join(' ') + '.';
  };

  const expandText = (text: string): string => {
    return text + ' This provides additional context and depth to better engage your audience.';
  };

  const formalizeText = (text: string): string => {
    return text.replace(/\b(can't|won't|don't|isn't)\b/g, (match) => {
      const formal = { "can't": "cannot", "won't": "will not", "don't": "do not", "isn't": "is not" };
      return formal[match as keyof typeof formal] || match;
    });
  };

  const casualizeText = (text: string): string => {
    return text.replace(/\b(cannot|will not|do not|is not)\b/g, (match) => {
      const casual = { "cannot": "can't", "will not": "won't", "do not": "don't", "is not": "isn't" };
      return casual[match as keyof typeof casual] || match;
    });
  };

  const handleApplyText = (text: string) => {
    // Extract quoted text from AI response
    const quotedMatch = text.match(/[""]([^"""]+)[""]?/);
    if (quotedMatch) {
      onApplyText(quotedMatch[1]);
      onClose();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={chatRef}
      className="bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden w-80 animate-in fade-in-0 zoom-in-95 duration-200"
      style={getModuleStyle()}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-gradient-to-r from-purple-50 to-blue-50 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-800">AI Writing Assistant</h3>
            <p className="text-xs text-gray-600">Help with your {elementType} text</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-purple-100"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* Chat Messages */}
      <div 
        ref={messagesContainerRef}
        className="h-64 p-4 overflow-y-auto"
        style={{ scrollBehavior: 'smooth' }}
      >
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-3 h-3 text-white" />
                </div>
              )}
              <div
                className={`max-w-[200px] px-3 py-2 rounded-lg text-sm ${
                  message.sender === 'user'
                    ? 'bg-blue-500 text-white ml-8'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.text}</div>
                {message.sender === 'ai' && message.text.includes('"') && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 h-6 text-xs bg-white hover:bg-gray-50"
                    onClick={() => handleApplyText(message.text)}
                  >
                    Apply Text
                  </Button>
                )}
              </div>
              {message.sender === 'user' && (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-2 justify-start">
              <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                <Bot className="w-3 h-3 text-white" />
              </div>
              <div className="bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-600">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Separator />

      {/* Input Area */}
      <div className="p-3">
        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me to improve your text..."
            className="flex-1 text-sm ai-chat-input"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            size="sm"
            disabled={!inputText.trim() || isLoading}
            className="px-3"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Try: &quot;make it shorter&quot;, &quot;improve clarity&quot;, or &quot;make it more formal&quot;
        </p>
      </div>
    </div>
  );
}