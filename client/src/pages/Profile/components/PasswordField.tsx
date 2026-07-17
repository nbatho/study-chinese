import { type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordField({
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  shown,
  onToggleShown,
  toggleAriaLabel,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  placeholder?: string;
  shown: boolean;
  onToggleShown: () => void;
  toggleAriaLabel: string;
  children?: ReactNode;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-[0.8rem] font-bold text-muted-foreground">{label}</label>
      <span className="relative block">
        <input
          type={shown ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className="app-control w-full pr-11 text-foreground"
        />
        <button
          type="button"
          onClick={onToggleShown}
          aria-label={toggleAriaLabel}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          {shown ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </span>
      {children}
    </div>
  );
}
