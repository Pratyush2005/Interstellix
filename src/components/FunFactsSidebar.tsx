import React, { useEffect, useState } from "react";

const fallbackFacts = [
  "A day on Venus is longer than a year on Venus.",
  "There are more trees on Earth than stars in the Milky Way.",
  "Neutron stars can spin at a rate of 600 rotations per second.",
  "One million Earths could fit inside the Sun.",
  "Mars has the largest dust storms in the solar system.",
  "A spoonful of a neutron star weighs about a billion tons.",
  "Saturn could float in water because it's mostly made of gas.",
  "The footprints on the Moon will remain for millions of years.",
  "There is a planet made of diamonds called 55 Cancri e.",
  "If two pieces of metal touch in space, they permanently bond.",
];

const FunFactsSidebar = ({ onClose }: { onClose: () => void }) => {
  const [fact, setFact] = useState("Loading fun fact...");
  const [fade, setFade] = useState(true);

  const fetchFact = async () => {
    try {
      setFade(false);
      const response = await fetch("https://uselessfacts.jsph.pl/random.json?language=en");
      const data = await response.json();
      setTimeout(() => {
        setFact(data.text || fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)]);
        setFade(true);
      }, 500);
    } catch (err) {
      console.error("Failed to fetch fun fact:", err);
      setTimeout(() => {
        setFact(fallbackFacts[Math.floor(Math.random() * fallbackFacts.length)]);
        setFade(true);
      }, 500);
    }
  };

  useEffect(() => {
    fetchFact(); // initial load

    const interval = setInterval(() => {
      fetchFact();
    }, 10000); // fetch new fact every 10 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed right-4 top-1/4 bg-gradient-to-br from-black/80 to-gray-900/80 border border-cyan-500/40 rounded-xl p-4 w-72 max-w-xs shadow-2xl z-40 backdrop-blur-md transition-all duration-500 animate-slide-in-right">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-cyan-300 font-bold text-sm">✨ Fun Fact</h3>
        <button
          onClick={onClose}
          className="text-cyan-400 hover:text-cyan-200 text-lg font-bold transition-transform transform hover:scale-125"
        >
          ✕
        </button>
      </div>
      <p
        className={`text-cyan-200 text-sm transition-opacity duration-500 ${
          fade ? "opacity-100" : "opacity-0"
        }`}
      >
        {fact}
      </p>
    </div>
  );
};

export default FunFactsSidebar;
