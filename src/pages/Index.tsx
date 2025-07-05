import React, { useState, useEffect, useRef, useCallback } from 'react';
import StarField from '@/components/StarField';
import Navigation from '@/components/Navigation';
import HeroSection from '@/components/HeroSection';
import SpaceTimeIntro from '@/components/SpaceTimeIntro';
import EventsTimeline from '@/components/EventsTimeline';
import OpeningAnimation from '@/components/OpeningAnimation';
import ChatWindow from '@/components/ChatWindow';
import SystemFailureTerminal from '@/components/SystemFailureTerminal';
import AstronautChatButton from '@/components/AstronautChatButton';
import AstronomyPictureOfTheDay from '@/components/AstronomyPictureOfTheDay'; // Import the new component
import Quiz from '@/components/Quiz' // Import the Quiz component


const Index = () => {
  const [showOpening, setShowOpening] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showSystemFailure, setShowSystemFailure] = useState(false);
  const [isSystemRecovered, setIsSystemRecovered] = useState(false);
  const [showAstronautHint, setShowAstronautHint] = useState(false); // Controls visibility of the hint bubble
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false); // State for quiz open/close
  
  const [hasInteractedWithAstronaut, setHasInteractedWithAstronaut] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasInteractedWithAstronaut') === 'true';
    }
    return false;
  });
  const [hasInitialCrashOccurred, setHasInitialCrashOccurred] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('hasInitialCrashOccurred') === 'true';
    }
    return false;
  });
  const [isCrashScenarioActive, setIsCrashScenarioActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false); // New state for mute/unmute
  
  // New states and refs for astronaut bubble messages
  const [astronautBubbleMessage, setAstronautBubbleMessage] = useState<string | null>(null);

  // Handler to launch the quiz
  const handleLaunchQuizClick = () => {
    setIsQuizOpen(true);
  };
  const hintCycleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idlePromptTimerRef = useRef<NodeJS.Timeout | null>(null);
  const initialHintDisplayTimerRef = useRef<NodeJS.Timeout | null>(null); // For the 1-minute "Wanna chat?" display
  const chatCloseDelayTimerRef = useRef<NodeJS.Timeout | null>(null); // NEW: For the 1-minute delay after chat closes
  const currentHintMessageIndex = useRef(0);
  // Initialize as false so it shows immediately after opening animation
  const [isAstronautHintDelayed, setIsAstronautHintDelayed] = useState(false); 
  // New state to manage the phase of the hint messages
  const [hintPhase, setHintPhase] = useState<'initial' | 'cycling'>('initial');

  const humAudioRef = useRef<HTMLAudioElement>(null);
  const eventsTimelineRef = useRef<HTMLDivElement>(null);

  const firstHintMessage = "Wanna chat?"; // The very first message to display
  const cyclingHintMessages = [ // Messages to cycle through after the first one
    "Still there, comrade?",
    "How's the weather today?",
    "Zero gravity makes time weird, huh?",
    "Need a cosmic tip?",
    "Don't be shy, ask me anything!",
    "My circuits are humming, ready to chat!"
  ];

  // Function to start the cycling of subsequent hint messages
  const startCyclingHints = useCallback(() => {
    if (hintCycleTimerRef.current) {
      clearTimeout(hintCycleTimerRef.current);
    }
    hintCycleTimerRef.current = setTimeout(() => {
      currentHintMessageIndex.current = (currentHintMessageIndex.current + 1) % cyclingHintMessages.length;
      setAstronautBubbleMessage(cyclingHintMessages[currentHintMessageIndex.current]);
      startCyclingHints(); // Recursively call to continue cycling
    }, (Math.random() * 60 + 60) * 1000); // 1 to 2 minutes
  }, [cyclingHintMessages]);

  // Function to reset the idle prompt timer (15 seconds)
  const resetIdlePrompt = useCallback(() => {
    if (idlePromptTimerRef.current) {
      clearTimeout(idlePromptTimerRef.current);
    }
    idlePromptTimerRef.current = setTimeout(() => {
      const randomMessage = cyclingHintMessages[Math.floor(Math.random() * cyclingHintMessages.length)];
      setAstronautBubbleMessage(randomMessage);
    }, 15000); // 15 seconds
  }, [cyclingHintMessages]);

  // User interaction handler - ONLY resets the idle prompt for message cycling (15-sec timer)
  const handleUserInteraction = useCallback(() => {
    resetIdlePrompt(); 
  }, [resetIdlePrompt]); 

  // Main effect for managing astronaut bubble visibility and messages
  useEffect(() => {
    const shouldShowBubble = !showOpening && !showSystemFailure && !isChatOpen && !isAstronautHintDelayed;
    setShowAstronautHint(shouldShowBubble);

    if (shouldShowBubble) {
      if (hintPhase === 'initial') {
        setAstronautBubbleMessage(firstHintMessage);
        // Start a timer to transition to cycling messages after the first one is shown
        if (!initialHintDisplayTimerRef.current) { // Only set if not already running
            initialHintDisplayTimerRef.current = setTimeout(() => {
                setHintPhase('cycling'); // Transition to cycling phase
                currentHintMessageIndex.current = 0; // Reset index for cycling messages
                setAstronautBubbleMessage(cyclingHintMessages[currentHintMessageIndex.current]); // Set the first cycling message
                startCyclingHints();
                resetIdlePrompt();
                initialHintDisplayTimerRef.current = null; // Clear the ref after execution
            }, 60 * 1000); // Display "Wanna chat?" for 1 minute before cycling starts
        }
      } else { // hintPhase === 'cycling'
        // If astronautBubbleMessage is currently null (e.g., after being hidden), set it to the current cycling message.
        // Also, ensure cycling and idle prompts are active.
        if (astronautBubbleMessage === null || astronautBubbleMessage === firstHintMessage || !cyclingHintMessages.includes(astronautBubbleMessage)) {
          setAstronautBubbleMessage(cyclingHintMessages[currentHintMessageIndex.current]);
        }
        startCyclingHints(); // Ensure cycling is active
        resetIdlePrompt(); // Ensure idle prompt timer is active
      }
    } else {
      // If bubble should not be shown, clear message and all related timers
      setAstronautBubbleMessage(null);
      if (hintCycleTimerRef.current) clearTimeout(hintCycleTimerRef.current);
      if (idlePromptTimerRef.current) clearTimeout(idlePromptTimerRef.current);
      if (initialHintDisplayTimerRef.current) clearTimeout(initialHintDisplayTimerRef.current); // Clear initial hint timer if hidden
      // Do NOT clear chatCloseDelayTimerRef.current here, as it's managing the 1-minute delay after closing.
      
      // When the bubble is hidden, we only reset to 'initial' phase if it's hidden by opening animation or system failure.
      // If hidden by chat opening, the chatCloseDelayTimerRef will handle setting phase to 'cycling' upon reappearance.
      if (!isChatOpen && !isAstronautHintDelayed) { // Only reset to initial if not hidden by chat or its delay
        setHintPhase('initial'); 
      }
    }

    // Cleanup on unmount
    return () => {
      if (hintCycleTimerRef.current) clearTimeout(hintCycleTimerRef.current);
      if (idlePromptTimerRef.current) clearTimeout(idlePromptTimerRef.current);
      if (initialHintDisplayTimerRef.current) clearTimeout(initialHintDisplayTimerRef.current);
      if (chatCloseDelayTimerRef.current) clearTimeout(chatCloseDelayTimerRef.current); // NEW cleanup
    };
  }, [showOpening, showSystemFailure, isChatOpen, isAstronautHintDelayed, hintPhase, startCyclingHints, resetIdlePrompt, astronautBubbleMessage, firstHintMessage, cyclingHintMessages]);

  const handleToggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []); // setIsMuted is a stable function, so no dependencies needed

  useEffect(() => {
    if (humAudioRef.current) {
      humAudioRef.current.loop = true;
      humAudioRef.current.volume = isMuted ? 0 : 0.3;
      humAudioRef.current.play().catch(e => console.log("Background hum audio play failed (user interaction might be needed):", e));
    }

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
      // Only call handleUserInteraction if the opening animation is complete
      if (!showOpening) {
        handleUserInteraction(); // Call user interaction handler on scroll
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Initialize isScrolled based on current scroll position without triggering interaction
    setIsScrolled(window.scrollY > 50);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (humAudioRef.current) {
        humAudioRef.current.pause();
      }
    };
  }, [isMuted, handleUserInteraction, showOpening]); // Add showOpening to dependencies

  // Effect for the 1-minute crash timer
  useEffect(() => {
  let timer: NodeJS.Timeout;
  if (!showOpening && !hasInitialCrashOccurred && !showSystemFailure) {
    timer = setTimeout(() => {
      setIsCrashScenarioActive(true);
      setShowSystemFailure(true);
    }, 300000);
  }

  return () => {
    if (timer) clearTimeout(timer);
  };
}, [showOpening, hasInitialCrashOccurred, showSystemFailure]);


  const handleOpeningComplete = () => {
    setShowOpening(false);
    setIsAstronautHintDelayed(false); // Allow hint to show immediately after opening animation
    setHintPhase('initial'); // Ensure "Wanna chat?" is shown first after opening
  };

  const handleLaunchDiagnosticsClick = () => {
    if (!hasInitialCrashOccurred) {
      setIsCrashScenarioActive(true);
    } else {
      setIsCrashScenarioActive(false);
    }
    setShowSystemFailure(true);
    handleUserInteraction(); // Reset idle timer on diagnostics launch
  };

  const handleScrollToEvents = () => {
    eventsTimelineRef.current?.scrollIntoView({ behavior: 'smooth' });
    handleUserInteraction(); // Reset idle timer on scroll to events
  };

  const handleSystemRecoveryComplete = () => {
    if (isCrashScenarioActive) {
      setHasInitialCrashOccurred(true);
      localStorage.setItem('hasInitialCrashOccurred', 'true');
      setIsChatOpen(true); // Only open chat automatically if it was a crash scenario
    }
    setShowSystemFailure(false);
    setIsSystemRecovered(true);
    handleUserInteraction(); // Reset idle timer after recovery
  };

  const handleChatOpened = (opened: boolean) => {
    setIsChatOpen(opened);
    handleUserInteraction(); // Reset idle prompt timer when chat state changes (open/close)
  };

  const toggleChatWindow = () => {
    const newOpenState = !isChatOpen;
    setIsChatOpen(newOpenState);
    handleChatOpened(newOpenState); // Notify ChatWindow of state change and reset idle prompt timer

    // Clear any existing chat close delay timer
    if (chatCloseDelayTimerRef.current) {
      clearTimeout(chatCloseDelayTimerRef.current);
      chatCloseDelayTimerRef.current = null;
    }
    // Also clear any initial hint display timer if it was running
    if (initialHintDisplayTimerRef.current) {
      clearTimeout(initialHintDisplayTimerRef.current);
      initialHintDisplayTimerRef.current = null;
    }

    if (newOpenState) { // If chat is being opened by clicking the astronaut button
      setIsAstronautHintDelayed(true); // Hide hint immediately when chat opens
      setAstronautBubbleMessage(null); // Clear message while chat is open
      // No need to set hintPhase here. It will be handled by the useEffect when it reappears.
    } else { // If chat is being closed by clicking the astronaut button
      setIsAstronautHintDelayed(true); // Keep hint hidden for the 1-minute delay after closing
      chatCloseDelayTimerRef.current = setTimeout(() => {
        setIsAstronautHintDelayed(false); // Allow hint to show after 1 minute
        setHintPhase('cycling'); // Set phase to cycling when it reappears after close
        currentHintMessageIndex.current = 0; // Reset index for cycling messages
      }, 60 * 1000); // 1 minute delay before reappearing
    }

    // This ensures the "hasInteractedWithAstronaut" flag is set correctly
    if (!hasInteractedWithAstronaut) {
      setHasInteractedWithAstronaut(true);
      localStorage.setItem('hasInteractedWithAstronaut', 'true');
    }
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {showOpening && <OpeningAnimation onComplete={handleOpeningComplete} />}

      {showSystemFailure && <SystemFailureTerminal onRecoveryComplete={handleSystemRecoveryComplete} isCrashScenario={isCrashScenarioActive} />}

      <div className={`transition-opacity duration-1000 ${showOpening || showSystemFailure ? 'opacity-0' : 'opacity-100'}`}>
        <StarField />
        <Navigation 
          onLaunchDiagnosticsClick={handleLaunchDiagnosticsClick} 
          isMuted={isMuted} // Pass mute state
          onToggleMute={handleToggleMute} // Pass toggle function
          onLaunchQuizClick={handleLaunchQuizClick}
         
        />

        <main className="relative z-10">
          <HeroSection isScrolled={isScrolled} onExploreClick={handleScrollToEvents} />
          <SpaceTimeIntro />
          {/* Replaced MilestonesSection with AstronomyPictureOfTheDay */}
          <AstronomyPictureOfTheDay />
          <EventsTimeline ref={eventsTimelineRef} selectedDate={selectedDate} onDateChange={setSelectedDate} />
        </main>

        <AstronautChatButton
          isOpen={isChatOpen}
          onToggle={toggleChatWindow}
          showHint={showAstronautHint}
          idleMessage={astronautBubbleMessage} // Pass the dynamic message
        />

        <ChatWindow
          selectedDate={selectedDate}
          isSystemRecovered={isSystemRecovered}
          onChatOpened={handleChatOpened}
          isOpen={isChatOpen}
          onUserInteraction={handleUserInteraction} // Pass the interaction handler
        />

        <footer className="relative z-10 bg-black/60 backdrop-blur-md border-t border-cyan-500/20 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-white/70">
              © {new Date().getFullYear()} Interstellix. All rights reserved.
            </p>
            <audio ref={humAudioRef} src="/sounds/hum.mp3" preload="auto" />
          </div>
        </footer>

        {/* Quiz component */}
        <Quiz 
          isOpen={isQuizOpen} // Show quiz only when quiz is open
          onClose={() => setIsQuizOpen(false)} // Close quiz when quiz closes
          onUserInteraction={handleUserInteraction} // Pass interaction handler to reset idle prompt
        />
        



      </div>
    </div>
  );
};

export default Index;
