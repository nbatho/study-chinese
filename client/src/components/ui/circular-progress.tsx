import * as React from "react";
import { cn } from "../../utils/cn";

type CircularProgressProps = React.ComponentProps<"div"> & {
  progress: number;
  size?: number;
  strokeWidth?: number;
  trackClassName?: string;
  indicatorClassName?: string;
};

function CircularProgress({
  progress,
  size = 44,
  strokeWidth = 4,
  className,
  trackClassName,
  indicatorClassName,
  children,
  style,
  ...props
}: CircularProgressProps) {
  const value = Math.max(0, Math.min(100, progress));
  const center = size / 2;
  const radius = Math.max(0, (size - strokeWidth) / 2);
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div
      data-slot="circular-progress"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      className={cn("relative inline-grid shrink-0 place-items-center", className)}
      style={{ width: size, height: size, ...style }}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="absolute inset-0 -rotate-90"
        aria-hidden="true"
      >
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={cn("stroke-secondary", trackClassName)}
        />
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeLinecap="round"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            "stroke-primary transition-[stroke-dashoffset] duration-500 ease-out",
            indicatorClassName,
          )}
        />
      </svg>
      <span className="relative text-[0.68rem] font-extrabold leading-none text-foreground">
        {children ?? `${value}%`}
      </span>
    </div>
  );
}

export { CircularProgress };
