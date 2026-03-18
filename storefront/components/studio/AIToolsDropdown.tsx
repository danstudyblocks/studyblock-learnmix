import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { X, Send, Bot, Sparkles, BookOpen, Edit3, Hash, Expand, Users, GraduationCap, Plus, Minus } from "lucide-react";

interface AIToolsDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile?: boolean;
  screenSize?: 'mobile' | 'tablet' | 'desktop';
}

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const educationalPrompts = [
  {
    id: 'differentiate-easier',
    label: 'Make it easier',
    icon: <Minus className="w-4 h-4" />,
    prompt: 'Differentiate this text to make it easier to understand',
    color: 'bg-green-100 text-green-700 hover:bg-green-200'
  },
  {
    id: 'differentiate-harder',
    label: 'Make it harder',
    icon: <Plus className="w-4 h-4" />,
    prompt: 'Differentiate this text to make it more challenging',
    color: 'bg-red-100 text-red-700 hover:bg-red-200'
  },
  {
    id: 'rewrite',
    label: 'Rewrite this',
    icon: <Edit3 className="w-4 h-4" />,
    prompt: 'Rewrite this text with different wording but same meaning',
    color: 'bg-blue-100 text-blue-700 hover:bg-blue-200'
  },
  {
    id: 'keywords',
    label: 'Create keywords',
    icon: <Hash className="w-4 h-4" />,
    prompt: 'Generate relevant keywords for this content',
    color: 'bg-purple-100 text-purple-700 hover:bg-purple-200'
  },
  {
    id: 'expand',
    label: 'Expand upon this',
    icon: <Expand className="w-4 h-4" />,
    prompt: 'Expand upon this text with more details and examples',
    color: 'bg-orange-100 text-orange-700 hover:bg-orange-200'
  },
  {
    id: 'friendly',
    label: 'More friendly',
    icon: <Users className="w-4 h-4" />,
    prompt: 'Rewrite this text to be more friendly and conversational',
    color: 'bg-pink-100 text-pink-700 hover:bg-pink-200'
  },
  {
    id: 'academic',
    label: 'More academic',
    icon: <GraduationCap className="w-4 h-4" />,
    prompt: 'Rewrite this text in a more academic and formal tone',
    color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
  },
  {
    id: 'longer',
    label: 'Make it longer',
    icon: <BookOpen className="w-4 h-4" />,
    prompt: 'Make this text longer with additional context and details',
    color: 'bg-teal-100 text-teal-700 hover:bg-teal-200'
  },
  {
    id: 'shorter',
    label: 'Make it shorter',
    icon: <Minus className="w-4 h-4" />,
    prompt: 'Make this text shorter and more concise',
    color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
  }
];

export function AIToolsDropdown({ isOpen, onClose }: AIToolsDropdownProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I\'m here to help you with your design content. You can ask me to modify text, generate ideas, or use the quick prompts on the right.',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `I understand you want me to help with: "${inputValue}". Here's my response to your request. This would be where the AI-generated content appears based on your input.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handlePromptClick = (prompt: string) => {
    setInputValue(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-border shadow-lg z-50" style={{ height: '33vh' }}>
      <div className="h-full flex">
        {/* Chat Section */}
        <div className="flex-1 flex flex-col border-r border-border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-medium text-gray-900">AI Assistant</h3>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                    <span className="text-sm">AI is thinking...</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Textarea
                placeholder="Ask me to help with your content..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 min-h-[80px] resize-none"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isLoading}
                className="px-4"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Prompts Section */}
        <div className="w-80 flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              <h4 className="font-medium text-gray-900">Quick Prompts</h4>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-1 gap-2">
              {educationalPrompts.map((prompt) => (
                <Button
                  key={prompt.id}
                  variant="ghost"
                  className={`h-auto p-3 justify-start text-left ${prompt.color}`}
                  onClick={() => handlePromptClick(prompt.prompt)}
                >
                  <div className="flex items-center gap-3">
                    {prompt.icon}
                    <span className="text-sm font-medium">{prompt.label}</span>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}