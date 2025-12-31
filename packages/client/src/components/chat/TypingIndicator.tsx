const TypingIndicator = () => {
  return (
    <div className="flex gap-1 px-3 py-3 bg-gray-200 rounded-xl self-start">
      <Dot />
      <Dot delay="[animation-delay:0.2s]" />
      <Dot delay="[animation-delay:0.4s]" />
    </div>
  );
};

interface DotProps {
  delay?: string;
}

const Dot = ({ delay }: DotProps) => (
  <div
    className={`w-2 h-2 rounded-full bg-gray-800 animate-pulse ${delay}`}
  ></div>
);

export default TypingIndicator;
