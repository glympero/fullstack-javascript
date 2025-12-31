import { FaArrowUp } from 'react-icons/fa';
import { Button } from '../ui/button';
import { useForm } from 'react-hook-form';

export type ChatFormData = {
  prompt: string;
};

interface Props {
  onSubmit: (data: ChatFormData) => void;
}

const ChatInput = ({ onSubmit }: Props) => {
  const { register, handleSubmit, reset, formState } = useForm<ChatFormData>();

  const handleFormSubmit = handleSubmit((data) => {
    onSubmit(data);
    reset({ prompt: '' });
  });

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleFormSubmit();
    }
  };
  return (
    <form
      onSubmit={handleFormSubmit}
      onKeyDown={handleKeyDown}
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
  );
};

export default ChatInput;
