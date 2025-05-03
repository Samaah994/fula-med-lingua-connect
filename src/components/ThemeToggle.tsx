
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          aria-label="Toggle theme"
          className="relative overflow-hidden rounded-full"
        >
          <motion.div
            key={theme}
            initial={{ rotateY: theme === "light" ? -90 : 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: theme === "light" ? 90 : -90, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ 
              perspective: "600px",
              transformStyle: "preserve-3d"
            }}
            className="flex items-center justify-center"
          >
            {theme === "light" ? (
              <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
            ) : (
              <Moon className="h-[1.2rem] w-[1.2rem] text-slate-300" />
            )}
          </motion.div>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{theme === "light" ? "Switch to dark mode" : "Switch to light mode"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
