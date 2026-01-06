import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Empty component with custom message and icon
interface EmptyProps {
  message?: string;
  icon?: string;
  onClick?: () => void;
}

export function Empty({ 
  message = "暂无内容", 
  icon = "fa-inbox", 
  onClick 
}: EmptyProps) {
  return (
    <div 
      className={cn("flex flex-col items-center justify-center h-full py-12 text-center text-gray-500 dark:text-gray-400")} 
      onClick={onClick || (() => toast(message))}
    >
      <i className={`fas ${icon} text-4xl mb-4 text-gray-300 dark:text-gray-600`}></i>
      <p className="text-lg">{message}</p>
    </div>
  );
}