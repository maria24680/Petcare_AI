'use client';

import { useState } from 'react';
import { apiClient } from '@/lib/api/client';
import { Send, Bot, User, Loader2, Sparkles, RefreshCw } from 'lucide-react';

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

export default function AIAssistantPage() {
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'assistant',
            content: 'Hello! I\'m your PetCare AI assistant. How can I help you with your pet today?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await apiClient.post('/ai/chat', {
                message: input,
                history: messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            const errorMessage: Message = {
                role: 'assistant',
                content: 'Sorry, I\'m having trouble connecting. Please try again.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const regenerateResponse = async () => {
        // Get the last user message
        const lastUserMessage = [...messages].reverse().find(m => m.role === 'user');
        if (!lastUserMessage) return;

        // Remove the last assistant message
        const lastAssistantIndex = [...messages].reverse().findIndex(m => m.role === 'assistant');
        if (lastAssistantIndex === -1) return;

        const newMessages = messages.slice(0, messages.length - 1 - lastAssistantIndex);
        setMessages(newMessages);
        setLoading(true);

        try {
            const response = await apiClient.post('/ai/regenerate', {
                message: lastUserMessage.content,
                history: newMessages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
            });

            const assistantMessage: Message = {
                role: 'assistant',
                content: response.data.data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            alert('Failed to regenerate response');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-8rem)]">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-[#111844]">AI Pet Care Assistant</h1>
                    <p className="text-gray-600 mt-1">Get expert advice for your pet's health and well-being</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-[#4B5694]">
                    <Sparkles className="w-4 h-4" />
                    <span>Powered by Gemini AI</span>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-xl card-shadow flex flex-col overflow-hidden">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`flex items-start gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''
                                }`}
                        >
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${message.role === 'assistant'
                                    ? 'bg-[#4B5694]'
                                    : 'bg-[#111844]'
                                    }`}
                            >
                                {message.role === 'assistant' ? (
                                    <Bot className="w-4 h-4 text-white" />
                                ) : (
                                    <User className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <div
                                className={`max-w-[70%] p-4 rounded-lg ${message.role === 'assistant'
                                    ? 'bg-[#F8F6F2] text-[#111844]'
                                    : 'bg-[#111844] text-white'
                                    }`}
                            >
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                <span className="text-xs opacity-60 mt-2 block">
                                    {message.timestamp.toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    ))}
                    {loading && (
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#4B5694] rounded-full flex items-center justify-center">
                                <Bot className="w-4 h-4 text-white" />
                            </div>
                            <div className="bg-[#F8F6F2] p-4 rounded-lg">
                                <Loader2 className="w-5 h-5 animate-spin text-[#4B5694]" />
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-gray-200">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Ask me anything about pet care..."
                            className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4B5694] focus:border-transparent"
                        />
                        <button
                            onClick={regenerateResponse}
                            disabled={loading || messages.length < 2}
                            className="bg-[#EAE0CF] text-[#111844] px-4 py-2 rounded-lg hover:bg-[#d5c8b5] transition disabled:opacity-50 flex items-center gap-2"
                            title="Regenerate last response"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={loading || !input.trim()}
                            className="bg-[#111844] text-white px-6 py-2 rounded-lg hover:bg-[#4B5694] transition disabled:opacity-50 flex items-center gap-2"
                        >
                            <Send className="w-4 h-4" />
                            Send
                        </button>
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        ⚠️ This is an AI assistant. Always consult a veterinarian for professional advice.
                    </p>
                </div>
            </div>
        </div>
    );
}