import React, { useState, useEffect } from "react";

const Quiz = ({ isOpen, onClose, onUserInteraction }) => {
  const [quizData, setQuizData] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOption, setSelectedOption] = useState("");
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [showNamePrompt, setShowNamePrompt] = useState(false);
  const [animationClass, setAnimationClass] = useState("");
  const openSound = new Audio("/sounds/quiz-open.mp3"); // Ensure this file exists

  useEffect(() => {
    if (isOpen) {
      setAnimationClass("animate-slideFadeIn");
      openSound.play().catch(() => {}); // Play opening sound
      if (!localStorage.getItem("quizUserName")) {
        setShowNamePrompt(true);
      } else {
        setUserName(localStorage.getItem("quizUserName"));
      }

      setLoading(true);
      fetch("https://opentdb.com/api.php?amount=5&category=17&type=multiple")
        .then((res) => res.json())
        .then((data) => {
          const formatted = data.results.map((q) => ({
            question: decodeHTML(q.question),
            options: shuffle([
              ...q.incorrect_answers.map(decodeHTML),
              decodeHTML(q.correct_answer),
            ]),
            answer: decodeHTML(q.correct_answer),
            explanation: `Learn more about: ${decodeHTML(q.correct_answer)}`,
          }));
          setQuizData(formatted);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Failed to fetch quiz data:", err);
          setLoading(false);
        });
    } else {
      setAnimationClass(""); // Reset animation
    }
  }, [isOpen]);

  const decodeHTML = (html) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    setShowExplanation(true);
    if (option === quizData[currentQ].answer) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    setSelectedOption("");
    setShowExplanation(false);
    if (currentQ < quizData.length - 1) {
      setCurrentQ(currentQ + 1);
    } else {
      alert(
        `Quiz finished! ${userName}, your score: ${score}/${quizData.length}`
      );
      saveScore();
      onClose(); // close quiz on finish
    }
  };

  const saveScore = () => {
    const existingScores = JSON.parse(localStorage.getItem("quizScores")) || {};
    existingScores[userName] = score;
    localStorage.setItem("quizScores", JSON.stringify(existingScores));
  };

  const handleNameSubmit = () => {
    if (userName.trim()) {
      localStorage.setItem("quizUserName", userName.trim());
      setShowNamePrompt(false);
    }
  };

  if (!isOpen) return null;

  if (showNamePrompt) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
        <div className="bg-gradient-to-r from-cyan-700 to-blue-900 p-6 rounded-lg shadow-xl text-white text-center">
          <h2 className="text-xl font-bold mb-4">Enter Your Name</h2>
          <input
            type="text"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full px-4 py-2 rounded text-black mb-4"
            placeholder="Your name"
          />
          <button
            onClick={handleNameSubmit}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded"
          >
            Start Quiz
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 text-xl text-white">
        Loading Quiz...
      </div>
    );
  }

  const current = quizData[currentQ];

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 ${animationClass}`}
    >
      <div className="max-w-md w-full mx-auto bg-gradient-to-br from-cyan-900 to-blue-800 text-white rounded-lg shadow-xl p-6 relative">
        <h2 className="text-2xl font-bold mb-4">Space & Science Quiz</h2>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-cyan-300 text-sm"
        >
          ✖ Close
        </button>

        <p className="mb-4">{current.question}</p>

        <div className="space-y-3">
          {current.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleOptionClick(option)}
              disabled={showExplanation}
              className={`w-full px-4 py-3 rounded-lg text-left font-medium transition duration-300
        ${
          selectedOption === option
            ? option === current.answer
              ? "bg-green-600 text-white"
              : "bg-red-600 text-white"
            : "bg-gradient-to-r from-cyan-700 to-blue-800 text-white hover:from-cyan-600 hover:to-blue-700"
        }`}
            >
              {option}
            </button>
          ))}
        </div>

        {showExplanation && (
          <div className="mt-4">
            <p>
              {selectedOption === current.answer
                ? "✅ Correct!"
                : `❌ Incorrect. The correct answer is ${current.answer}.`}
            </p>
            <p className="text-sm text-gray-300">{current.explanation}</p>
            <button
              onClick={handleNext}
              className="mt-4 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;
