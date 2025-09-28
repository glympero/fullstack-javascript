import axios from 'axios';
import ReactMarkDown from 'react-markdown';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { FaArrowUp } from 'react-icons/fa';

type FormData = {
  prompt: string;
};

type ChatResponse = {
  message: string;
};

type Message = {
  content: string;
  role: 'user' | 'bot';
};

const ChatBot = () => {
  const conversationId = useRef(crypto.randomUUID());
  const lastMessageRef = useRef<HTMLDivElement | null>(null);
  const { register, handleSubmit, reset, formState } = useForm<FormData>();

  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onSubmit = async ({ prompt }: FormData) => {
    try {
      setError('');
      setMessages((prev) => [
        ...prev,
        {
          content: prompt,
          role: 'user',
        },
      ]);
      setIsBotTyping(true);
      reset({ prompt: '' });
      const { data } = await axios.post<ChatResponse>('/api/chat', {
        prompt,
        conversationId: conversationId.current,
      });

      setMessages((prev) => [...prev, { content: data.message, role: 'bot' }]);
      setIsBotTyping(false);
    } catch (error) {
      setError('Something went wrong. Please try again.');
      console.error(error);
    } finally {
      setIsBotTyping(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(onSubmit)();
    }
  };

  const onCopyMessage = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 gap-3 mb-10 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            onCopy={onCopyMessage}
            ref={index === messages.length - 1 ? lastMessageRef : null}
            className={`px-3 py-1 ${message.role === 'bot' ? 'bg-gray-100 self-start text-black' : 'bg-blue-600 text-white self-end'} rounded-xl`}
          >
            <ReactMarkDown>{message.content}</ReactMarkDown>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex gap-1 px-3 py-3 bg-gray-200 rounded-xl self-start">
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-gray-800 animate-pulse [animation-delay:0.4s]"></div>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={onKeyDown}
        className="flex flex-col gap-2 items-end border-2 p-4 rounded-3xl"
      >
        <textarea
          {...register('prompt', {
            required: true,
            validate: (v) => v.trim().length > 0,
          })}
          autoFocus
          className="w-full border-0 focus:outline-0 resize-none"
          placeholder="Ask anything"
          maxLength={1000}
        />
        <Button disabled={!formState.isValid} className="rounded-full w-9 h-9">
          <FaArrowUp />
        </Button>
      </form>
    </div>
  );
};

export default ChatBot;
