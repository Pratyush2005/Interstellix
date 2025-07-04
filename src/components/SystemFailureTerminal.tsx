import React, { useState, useEffect, useRef } from 'react';

interface SystemFailureTerminalProps {
  onRecoveryComplete: () => void;
  isCrashScenario: boolean; // New prop to determine which logs/effects to show
}

const SystemFailureTerminal: React.FC<SystemFailureTerminalProps> = ({ onRecoveryComplete, isCrashScenario }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [isTypingLog, setIsTypingLog] = useState(true);
  const [isInputActive, setIsInputActive] = useState(false);
  const [showRedBanner, setShowRedBanner] = useState(false);
  const [glitchActive, setGlitchActive] = useState(true);
  const terminalRef = useRef<HTMLDivElement>(null);

  const alarmAudioRef = useRef<HTMLAudioElement>(null);
  const staticAudioRef = useRef<HTMLAudioElement>(null);
  const typewriterAudioRef = useRef<HTMLAudioElement>(null);
  const successAudioRef = useRef<HTMLAudioElement>(null);
  const failAudioRef = useRef<HTMLAudioElement>(null);

  // Define logs based on the isCrashScenario prop
  const bootLogs = isCrashScenario
    ? [
        "BOOTING COSMOS NAV SYSTEM...",
        "CRITICAL ERROR: STARLINK-CORE FAILURE",
        "OXYGEN STABILIZER OFFLINE",
        "NAVIGATION DATA LOST",
        "> Awaiting emergency override... Type 'run system_check' to initiate recovery."
      ]
    : [
        "INITIATING SYSTEM DIAGNOSTICS...",
        "SCANNING ALL MODULES...",
        "NO CRITICAL ANOMALIES DETECTED.",
        "> Type 'exit' or 'close' to return to main view."
      ];

  const recoveryLogs = isCrashScenario
    ? [
        "Analyzing core systems...",
        "Rebooting oxygen stabilizer...",
        "Restoring navigation data...",
        "✅ SYSTEM STABILIZED. COMMUNICATION RESTORED."
      ]
    : [
        "DIAGNOSTICS COMPLETE.",
        "ALL SYSTEMS NOMINAL.",
        "✅ READY FOR OPERATION."
      ];

  useEffect(() => {
    // Play background sounds
    if (staticAudioRef.current) {
      staticAudioRef.current.loop = true;
      staticAudioRef.current.volume = 0.2;
      staticAudioRef.current.play().catch(e => console.log("Static audio play failed:", e));
    }
    // Play alarm only for crash scenario
    if (isCrashScenario && alarmAudioRef.current) {
      alarmAudioRef.current.loop = true;
      alarmAudioRef.current.volume = 0.5;
      alarmAudioRef.current.play().catch(e => console.log("Alarm audio play failed:", e));
    } else if (!isCrashScenario && alarmAudioRef.current) {
      alarmAudioRef.current.pause(); // Ensure alarm is off for simulated scenario
    }
    if (typewriterAudioRef.current) {
      typewriterAudioRef.current.volume = 0.5;
    }
    if (successAudioRef.current) {
      successAudioRef.current.volume = 0.7;
    }
    if (failAudioRef.current) {
      failAudioRef.current.volume = 0.7;
    }

    // Typewriter effect for initial logs
    let i = 0;
    const typeLog = () => {
      if (i < bootLogs.length) {
        const currentLine = bootLogs[i];
        let charIndex = 0;
        const lineInterval = setInterval(() => {
          if (charIndex <= currentLine.length) {
            setLogs(prev => {
              const newLogs = [...prev];
              newLogs[i] = currentLine.substring(0, charIndex);
              return newLogs;
            });
            if (typewriterAudioRef.current) {
                typewriterAudioRef.current.currentTime = 0;
                typewriterAudioRef.current.play();
            }
            charIndex++;
          } else {
            clearInterval(lineInterval);
            i++;
            setTimeout(typeLog, 500); // Delay before next line
          }
        }, 50); // Typing speed
        setLogs(prev => [...prev, '']); // Add empty line for current typing
      } else {
        setIsTypingLog(false);
        setIsInputActive(true);
        setShowRedBanner(isCrashScenario); // Only show red banner for crash scenario
        if (isCrashScenario && alarmAudioRef.current) alarmAudioRef.current.play();
      }
    };

    typeLog();

    // Glitch effect toggle only for crash scenario
    const glitchInterval = isCrashScenario ? setInterval(() => {
      setGlitchActive(prev => !prev);
    }, 100) : undefined;

    return () => {
      if (glitchInterval) clearInterval(glitchInterval);
      if (staticAudioRef.current) staticAudioRef.current.pause();
      if (alarmAudioRef.current) alarmAudioRef.current.pause();
    };
  }, [isCrashScenario]); // Add isCrashScenario to dependencies

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [logs]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isInputActive) {
      const command = currentInput.trim().toLowerCase();
      setLogs(prev => [...prev, `> ${currentInput}`]);
      setCurrentInput('');
      setIsInputActive(false); // Disable input while processing

      let commandAccepted = false;

      if (isCrashScenario && command === 'run system_check') {
        commandAccepted = true;
      } else if (!isCrashScenario && (command === 'exit' || command === 'close')) {
        commandAccepted = true;
      }

      if (commandAccepted) {
        setShowRedBanner(false);
        if (alarmAudioRef.current) alarmAudioRef.current.pause();
        if (successAudioRef.current) successAudioRef.current.play().catch(e => console.log("Success audio play failed:", e));

        let i = 0;
        const typeRecoveryLog = () => {
          if (i < recoveryLogs.length) {
            const currentLine = recoveryLogs[i];
            let charIndex = 0;
            const lineInterval = setInterval(() => {
              if (charIndex <= currentLine.length) {
                setLogs(prev => {
                  const newLogs = [...prev];
                  newLogs[newLogs.length - 1] = currentLine.substring(0, charIndex);
                  return newLogs;
                });
                if (typewriterAudioRef.current) {
                    typewriterAudioRef.current.currentTime = 0;
                    typewriterAudioRef.current.play();
                }
                charIndex++;
              } else {
                clearInterval(lineInterval);
                i++;
                setTimeout(typeRecoveryLog, 500);
              }
            }, 50);
            setLogs(prev => [...prev, '']); // Add empty line for current typing
          } else {
            // All recovery logs typed, now trigger fade out
            setTimeout(() => {
              onRecoveryComplete();
            }, 2000); // Fade out after 2 seconds
          }
        };
        typeRecoveryLog();
      } else {
        if (failAudioRef.current) failAudioRef.current.play();
        setLogs(prev => [...prev, "❌ Unknown command. Try again."]);
        setTimeout(() => setIsInputActive(true), 500); // Re-enable input after a short delay
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center font-space-mono text-green-400 text-sm md:text-base transition-opacity duration-1000">
      {isCrashScenario && glitchActive && <div className="glitch-overlay" />}
      
      {showRedBanner && (
        <div className="absolute top-0 left-0 right-0 bg-red-800/30 text-red-400 text-center py-2 text-lg font-bold animate-flicker red-warning-banner">
          SYSTEM ALERT: CRITICAL FAILURE IMMINENT
        </div>
      )}

      <div className="w-11/12 h-5/6 md:w-3/4 md:h-3/4 bg-black/80 border border-green-500/50 shadow-lg shadow-green-500/20 rounded-lg flex flex-col p-4">
        <div ref={terminalRef} className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {logs.map((log, index) => (
            <p key={index} className="whitespace-pre-wrap leading-relaxed">
              {log}
            </p>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <span className="text-green-400 mr-2">{isInputActive ? '>' : ''}</span>
          <input
            type="text"
            className={`flex-1 bg-transparent outline-none text-green-400 caret-green-400 ${isInputActive ? 'terminal-cursor' : ''}`}
            value={currentInput}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            disabled={!isInputActive}
            autoFocus
          />
        </div>
      </div>

      {/* Audio Elements */}
      <audio ref={alarmAudioRef} src="/sounds/alarm.mp3" preload="auto" />
      <audio ref={staticAudioRef} src="/sounds/static.mp3" preload="auto" />
      <audio ref={typewriterAudioRef} src="/sounds/typewriter.mp3" preload="auto" />
      <audio ref={successAudioRef} src="/sounds/success.mp3" preload="auto" />
      <audio ref={failAudioRef} src="/sounds/fail.mp3" preload="auto" />
    </div>
  );
};

export default SystemFailureTerminal;