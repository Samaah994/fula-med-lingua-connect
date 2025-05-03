
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";

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
          className="relative overflow-hidden rounded-full border-muted bg-background"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              exit={{ opacity: 0, rotateY: -90 }}
              transition={{ 
                duration: 0.4, 
                ease: "easeOut",
              }}
              className="flex items-center justify-center h-full w-full"
            >
              {theme === "light" ? (
                <Sun className="h-[1.2rem] w-[1.2rem] text-amber-500" />
              ) : (
                <Moon className="h-[1.2rem] w-[1.2rem] text-indigo-200" />
              )}
            </motion.div>
          </AnimatePresence>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{theme === "light" ? "Switch to dark mode" : "Switch to light mode"}</p>
      </TooltipContent>
    </Tooltip>
  );
}
