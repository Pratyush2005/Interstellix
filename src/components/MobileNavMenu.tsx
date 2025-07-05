import React, { useState, useRef, useEffect } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavMenuProps {
  onLaunchDiagnosticsClick: () => void;
  onLaunchQuizClick: () => void;
  onToggleFunFacts: () => void;
}

const MobileNavMenu: React.FC<MobileNavMenuProps> = ({
  onLaunchDiagnosticsClick,
  onLaunchQuizClick,
  onToggleFunFacts,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleMenuItemClick = (action: () => void) => {
    action();
    setIsOpen(false); // Close menu after clicking an item
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="group bg-transparent border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 rounded-full p-2 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-cyan-500/30"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-black/80 backdrop-blur-xl border border-cyan-500/20 rounded-lg shadow-lg p-2 animate-fade-in origin-top-right">
          <ul className="flex flex-col space-y-2">
            <li>
              <Button
                onClick={() => handleMenuItemClick(onLaunchDiagnosticsClick)}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                LAUNCH DIAGNOSTICS
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleMenuItemClick(onLaunchQuizClick)}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                LAUNCH QUIZ
              </Button>
            </li>
            <li>
              <Button
                onClick={() => handleMenuItemClick(onToggleFunFacts)}
                variant="ghost"
                className="w-full justify-start text-white hover:bg-cyan-500/10 hover:text-cyan-300"
              >
                FUN FACTS
              </Button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default MobileNavMenu;