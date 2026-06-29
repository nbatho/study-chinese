import AITutorContent from "./components/AITutorContent";

interface AITutorProps {
  onClose?: () => void;
}

export default function AITutor({ onClose }: AITutorProps) {
  return <AITutorContent onClose={onClose} />;
}
