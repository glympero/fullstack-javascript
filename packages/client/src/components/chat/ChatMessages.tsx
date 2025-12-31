import { useEffect, useRef } from 'react';
import ReactMarkDown from 'react-markdown';

export interface Message {
  content: string;
  role: 'user' | 'bot';
}

interface Props {
  messages: Message[];
}

const ChatMessages = ({ messages }: Props) => {
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const onCopyMessage = (e: React.ClipboardEvent) => {
    const selection = window.getSelection()?.toString().trim();
    if (selection) {
      e.preventDefault();
      e.clipboardData.setData('text/plain', selection);
    }
  };
  return (
    <>
      {messages.map((message, index) => (
        <div
          key={index}
          onCopy={onCopyMessage}
          ref={index === messages.length - 1 ? lastMessageRef : null}
          className={`px-3 max-w-md py-1 ${message.role === 'bot' ? 'bg-gray-100 self-start text-black' : 'bg-blue-600 text-white self-end'} rounded-xl`}
        >
          <ReactMarkDown>{message.content}</ReactMarkDown>
        </div>
      ))}
    </>
  );
};

export default ChatMessages;
