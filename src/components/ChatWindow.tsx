import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare } from 'lucide-react'; // Removed Loader2
import conversationTree from '@/data/conversationTree.json';
import allSpaceEvents from '@/data/spaceEventsData.json';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'astronaut';
  timestamp: string;
  image?: string; // Added for image replies
}

interface ConversationNode {
  astronautReply: string | string[]; // Can be a single string or an array of strings
  image?: string | string[]; // Can be a single string or an array of strings
  options: { text: string; nextId: string }[];
}

interface ChatWindowProps {
  selectedDate: Date;
  isSystemRecovered: boolean; // New prop
  isOpen: boolean; // Now controlled by parent
  onChatOpened: (opened: boolean) => void; // New prop to notify parent
  onUserInteraction: () => void; // New prop to notify parent of user interaction
}

const ChatWindow: React.FC<ChatWindowProps> = ({ selectedDate, isSystemRecovered, isOpen, onChatOpened, onUserInteraction }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentConversationNodeId, setCurrentConversationNodeId] = useState<string>('mainMenu');
  const [isTyping, setIsTyping] = useState(false);
  const [hasShownRecoveryIntro, setHasShownRecoveryIntro] = useState(false); // New state to track if recovery intro has been shown
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationData: { [key: string]: ConversationNode } = conversationTree;

  // Function to add astronaut messages sequentially
  const addAstronautMessage = (text: string | string[], image?: string | string[]) => {
    const replies = Array.isArray(text) ? text : [text];
    const replyImage = Array.isArray(image) ? image[0] : image; // Only use the first image if array

    let delay = 0;
    replies.forEach((reply, index) => {
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: Date.now().toString() + '-reply-' + index,
          text: reply,
          sender: 'astronaut',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          image: index === 0 ? replyImage : undefined, // Only show image with the first part of the reply
        }]);
        if (index === replies.length - 1) {
          setIsTyping(false); // Set typing to false only after the last part is added
        }
      }, delay);
      delay += 1500; // Fixed delay of 1.5 seconds between message parts
    });
  };

  // Effect to handle chat opening and initial messages
  useEffect(() => {
    if (isOpen) {
      onUserInteraction(); // Notify parent that chat is open (user interaction)
      if (messages.length === 0) { // Only add initial message if chat is empty
        setIsTyping(true);
        let initialNodeId = 'mainMenu'; // Default initial node

        if (isSystemRecovered && !hasShownRecoveryIntro) {
          initialNodeId = 'systemRecoveredIntro';
          setHasShownRecoveryIntro(true); // Mark as shown
        } else if (isSystemRecovered && hasShownRecoveryIntro) {
          initialNodeId = 'fullMainMenu'; // After recovery, and intro already shown
        }
        
        setCurrentConversationNodeId(initialNodeId);
        setTimeout(() => {
          addAstronautMessage(conversationData[initialNodeId].astronautReply, conversationData[initialNodeId].image);
        }, 1000); // Delay for typing effect
      }
    } else {
      // Chat is now closed
      setMessages([]); // Clear messages when closing
      // Reset current conversation node to the appropriate main menu for the *next* open
      setCurrentConversationNodeId(isSystemRecovered && hasShownRecoveryIntro ? 'fullMainMenu' : 'mainMenu');
    }
  }, [isOpen, isSystemRecovered, hasShownRecoveryIntro]); // Dependencies

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const formatSelectedDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const addMessage = (message: Message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  };

  const handleUserOptionClick = (optionText: string, nextId: string) => {
    onUserInteraction(); // Notify parent of user interaction
    // Determine if this is a "back to main menu" action
    const isBackToMainMenuAction = (nextId === 'backToMainMenu');

    // Only add user message if it's not a "back to main menu" action
    if (!isBackToMainMenuAction) {
      addMessage({
        id: Date.now().toString(),
        text: optionText,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }

    let actualNextNodeId = nextId;
    if (isBackToMainMenuAction) {
      actualNextNodeId = isSystemRecovered && hasShownRecoveryIntro ? 'fullMainMenu' : 'mainMenu';
    }

    setCurrentConversationNodeId(actualNextNodeId);

    // If it's a "back to main menu" action, we don't want to show the astronaut's greeting again.
    // The options will simply update.
    if (isBackToMainMenuAction) {
      setIsTyping(false); // Ensure typing indicator is off
      return; // Exit early, no astronaut reply needed for this specific action
    }

    // For all other actions, show typing indicator and then astronaut's reply
    setIsTyping(true);

    setTimeout(() => {
      let nextNode = conversationData[actualNextNodeId];
      let astronautReplyText = nextNode.astronautReply;
      let astronautReplyImage = nextNode.image;

      // Handle dynamic content for 'eventsToday'
      if (actualNextNodeId === 'eventsToday') {
        const month = selectedDate.getMonth() + 1;
        const day = selectedDate.getDate();
        const filteredEvents = allSpaceEvents.filter(event => 
          event.month === month && event.day === day
        );

        if (filteredEvents.length > 0) {
          const eventTitles = filteredEvents.map(event => `- ${event.title} (${event.year})`).join('\n');
          astronautReplyText = `On ${formatSelectedDate(selectedDate)}, these events occurred:\n\n${eventTitles}\n\nScroll down to the 'Space Events' section for more details on the main page!`;
        } else {
          astronautReplyText = `No recorded space events found for ${formatSelectedDate(selectedDate)}. Try selecting a different date on the main page!`;
        }
      } else if (actualNextNodeId === 'spaceFact' || actualNextNodeId === 'anotherSpaceFact') {
        const facts = conversationData.allSpaceFacts as string[];
        const randomFact = facts[Math.floor(Math.random() * facts.length)];
        astronautReplyText = `${astronautReplyText}\n\n"${randomFact}"`;
      } else if (actualNextNodeId === 'spaceJoke' || actualNextNodeId === 'anotherSpaceJoke') {
        const jokes = conversationData.allSpaceJokes as string[];
        const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
        astronautReplyText = `${astronautReplyText}\n\n"${randomJoke}"`;
      }

      addAstronautMessage(astronautReplyText, astronautReplyImage);
    }, 2000); // 2-second delay for typing effect
  };

  const currentOptions = conversationData[currentConversationNodeId]?.options || [];

  return (
    <>
      {/* Chat Window */}
      <div
        className={`fixed bottom-4 right-4 z-50 w-72 h-[400px] md:w-80 md:h-[450px] lg:w-96 bg-black/70 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-2xl shadow-cyan-500/10 flex flex-col transition-all duration-300 ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-cyan-500/20">
          <div className="flex items-center space-x-2">
            <MessageSquare size={18} className="text-cyan-400" />
            <h4 className="text-lg md:text-xl text-cyan-400 font-bold">Astronaut Chat</h4>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              onChatOpened(false); // Notify parent to close chat
              setMessages([]); // Clear messages on close
              setCurrentConversationNodeId(isSystemRecovered && hasShownRecoveryIntro ? 'fullMainMenu' : 'mainMenu'); // Reset to appropriate main menu on close
              onUserInteraction(); // Notify parent of user interaction (closing chat)
            }}
            className="text-white/70 hover:text-white"
          >
            ✕
          </Button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 p-4 overflow-y-auto custom-scrollbar whitespace-pre-wrap">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex mb-3 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[75%] p-3 rounded-lg text-xs md:text-sm ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-700 text-white rounded-bl-none'
                }`}
              >
                {msg.image && (
                  <img src={msg.image} alt="Space View" className="rounded-md mb-2 max-w-full h-auto" />
                )}
                <p>{msg.text}</p>
                <span className="text-xs opacity-70 mt-1 block text-right">
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start mb-3">
              <div className="max-w-[75%] p-3 rounded-lg text-xs md:text-sm bg-gray-700 text-white rounded-bl-none">
                <span className="inline-flex items-center space-x-1">
                  <span className="typing-dot w-1.5 h-1.5 bg-white rounded-full animate-[dot-pulse_1.5s_infinite]"></span>
                  <span className="typing-dot w-1.5 h-1.5 bg-white rounded-full animate-[dot-pulse_1.5s_infinite_0.2s]"></span>
                  <span className="typing-dot w-1.5 h-1.5 bg-white rounded-full animate-[dot-pulse_1.5s_infinite_0.4s]"></span>
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Options Area */}
        <div className="p-4 border-t border-cyan-500/20 grid grid-cols-2 gap-2">
          {currentOptions.map((option, index) => (
            <Button
              key={index}
              onClick={() => handleUserOptionClick(option.text, option.nextId)}
              variant="outline"
              className="bg-transparent border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/10 text-xs md:text-sm font-medium transition-all duration-300 text-center whitespace-normal h-auto py-2"
              disabled={isTyping}
            >
              {option.text}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
};

export default ChatWindow;