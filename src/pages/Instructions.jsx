import { useState, useRef, useEffect } from "react";
import { Clock, RotateCcw, LogOut, CheckCircle2, Search, X, Loader2 } from "lucide-react";
import { checkAnswer, submitQuiz } from "../services/quizApi";

const QUESTIONS = [
  { id: 1, question: "What is React?", options: ["A JS Library", "A CSS Framework", "A Database", "An OS"], answer: "A JS Library", explanation: "React is an open-source JavaScript library for building user interfaces, particularly for single-page applications. It's used for handling the view layer for web and mobile apps." },
  { id: 2, question: "What is JSX?", options: ["JavaScript XML", "JSON XML", "Java Syntax", "Scripting Lang"], answer: "JavaScript XML", explanation: "JSX stands for JavaScript XML. It allows us to write HTML in React and makes it easier to write and add HTML in React." },
  { id: 3, question: "Which hook is used for state?", options: ["useEffect", "useState", "useContext", "useMemo"], answer: "useState", explanation: "useState is a Hook that allows you to add React state to function components. It returns a stateful value and a function to update it." },
  { id: 4, question: "How to pass data to children?", options: ["Via State", "Via Props", "Via Refs", "Via Keys"], answer: "Via Props", explanation: "Props (short for properties) are used to pass data from a parent component to its children. They are read-only and help make components reusable." },
  { id: 5, question: "What is the virtual DOM?", options: ["A game", "A copy of the real DOM", "A browser tool", "A database"], answer: "A copy of the real DOM", explanation: "The virtual DOM (VDOM) is a programming concept where an ideal, or 'virtual', representation of a UI is kept in memory and synced with the 'real' DOM by a library such as ReactDOM." },
  { id: 6, question: "React component names must start with?", options: ["Lowercase", "Uppercase", "Numbers", "Symbols"], answer: "Uppercase", explanation: "React components must always begin with an uppercase letter. If a component starts with a lowercase letter, React will treat it as a built-in DOM element like <div> or <span> instead of a custom component." },
  { id: 7, question: "What is a React Fragment?", options: ["A broken part", "A grouping tool", "A hook", "A style"], answer: "A grouping tool", explanation: "React Fragments let you group a list of children without adding extra nodes to the DOM. It's often used when you need to return multiple elements from a component." },
  { id: 8, question: "Which Hook handles side effects?", options: ["useState", "useEffect", "useCallback", "useRef"], answer: "useEffect", explanation: "The useEffect Hook lets you perform side effects in function components, such as data fetching, setting up a subscription, or manually changing the DOM." },
  { id: 9, question: "Initial value in useState is?", options: ["Required", "Optional", "Always 0", "Always string"], answer: "Optional", explanation: "The initial state argument in useState is only used during the first render. It's optional, and if you don't provide it, the state will be undefined." },
  { id: 10, question: "Redux is for?", options: ["Styling", "Global State", "Database", "Routing"], answer: "Global State", explanation: "Redux is a pattern and library for managing and updating application state, using events called 'actions'. It serves as a centralized store for state that needs to be used across your entire application." },
  { id: 11, question: "Vite is a?", options: ["Browser", "Build tool", "Text editor", "Package manager"], answer: "Build tool", explanation: "Vite is a modern frontend build tool that significantly improves the frontend development experience. It consists of two major parts: a dev server that provides rich feature enhancements over native ES modules, and a build command that bundles your code with Rollup." },
  { id: 12, question: "Tailwind is a?", options: ["JS Library", "CSS Framework", "Database", "Cloud provider"], answer: "CSS Framework", explanation: "Tailwind CSS is an open-source CSS framework. Unlike other frameworks like Bootstrap, it does not provide a series of predefined classes for elements such as buttons or tables, but instead provides utility classes to style them directly." },
  { id: 13, question: "Node.js runs on?", options: ["Python", "V8 Engine", "Java VM", "PHP"], answer: "V8 Engine", explanation: "Node.js is an open-source, cross-platform, JavaScript runtime environment that executes JavaScript code outside a web browser. It uses the V8 JavaScript engine, the same engine that powers Google Chrome." },
  { id: 14, question: "npm stands for?", options: ["Node Personal Mgr", "Node Package Mgr", "New Package Mgr", "Network Mgr"], answer: "Node Package Mgr", explanation: "npm is a package manager for the JavaScript programming language. It is the default package manager for the JavaScript runtime environment Node.js." },
  { id: 15, question: "React was created by?", options: ["Google", "Facebook", "Microsoft", "Twitter"], answer: "Facebook", explanation: "React was created by Jordan Walke, a software engineer at Facebook (now Meta). It was first deployed on Facebook's News Feed in 2011 and later on Instagram in 2012." }
];

export default function Instructions({ onExit, selectedMode, isTimerEnabled }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [visibleQuestionsCount, setVisibleQuestionsCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showExplanation, setShowExplanation] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questionRefs = useRef([]);

  const showTimer = selectedMode === "Test" || (selectedMode === "Practice" && isTimerEnabled);

  useEffect(() => {
    let timer;
    if (quizStarted && !isSubmitted) {
      timer = setInterval(() => {
        setTimeSpent(prev => prev + 1);
        if (showTimer) {
          setTimeLeft(prev => {
            if (prev <= 1) {
              setIsSubmitted(true);
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [quizStarted, isSubmitted, showTimer]);

  const handleStartQuiz = () => {
    setQuizStarted(true);
    setVisibleQuestionsCount(1);
    setTimeout(() => {
      questionRefs.current[0]?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const handleRestart = () => {
    if (window.confirm("Are you sure you want to restart the quiz? All progress will be lost.")) {
      setQuizStarted(false);
      setVisibleQuestionsCount(0);
      setConfirmedCount(0);
      setAnswers({});
      setIsSubmitted(false);
      setTimeLeft(300);
      setTimeSpent(0);
    }
  };

  const handleOptionSelect = (qIndex, option) => {
    if (isSubmitted || qIndex < confirmedCount) return;
    setAnswers({ ...answers, [qIndex]: option });
  };

  const handleContinue = async (idx) => {
    if (!answers[idx]) return;

    setIsChecking(true);
    try {
      // Check answer with API
      const result = await checkAnswer(QUESTIONS[idx].id, answers[idx]);
      console.log("API Check Result:", result);

      // Moving to next question
      setConfirmedCount(idx + 1);

      if (idx + 1 < QUESTIONS.length) {
        setVisibleQuestionsCount(idx + 2);
        setTimeout(() => {
          questionRefs.current[idx + 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100);
      }
    } finally {
      setIsChecking(false);
    }
  };

  const handleFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      const score = calculateScore();
      const results = {
        answers,
        score,
        timeSpent,
        mode: selectedMode
      };
      await submitQuiz(results);
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const calculateScore = () => {
    return QUESTIONS.reduce((score, q, idx) => (answers[idx] === q.answer ? score + 1 : score), 0);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const formatTimeSpent = (s) => {
    if (s < 60) return `${s}s`;
    return `${(s / 60).toFixed(2)}m`;
  };

  if (isSubmitted) {
    const score = calculateScore();
    return (
      <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      <header className="flex-none bg-black text-white flex-col sm:flex-row justify-between py-4 px-4 sm:px-8 w-full items-center flex gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-lg sm:text-xl font-black tracking-tighter italic">QUIZ RESULTS</h1>
          </div>

          <div className="flex items-center gap-4 sm:gap-8 w-full sm:w-auto justify-around sm:justify-end">
            <div className="flex flex-col items-center sm:items-end sm:border-r border-white/20 sm:pr-8">
              <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Time Taken</span>
              <span className="text-xl sm:text-2xl font-black">{formatTimeSpent(timeSpent)}</span>
            </div>
            <div className="flex flex-col items-center sm:items-end">
              <span className="text-[8px] sm:text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Final Score</span>
              <span className="text-xl sm:text-2xl font-black">{score} / {QUESTIONS.length}</span>
            </div>
            <button
              onClick={onExit}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Exit to home"
            >
              <LogOut size={20} className="sm:w-[24px] sm:h-[24px]" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-slate-300
        [&::-webkit-scrollbar-thumb]:bg-black
        [&::-webkit-scrollbar-thumb]:rounded-lg p-4 sm:p-10 space-y-6 bg-gray-100">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-sm border border-gray-100 text-center animate-in zoom-in duration-500">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 size={24} className="sm:w-[32px] sm:h-[32px]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">Great Job!</h2>
              <p className="text-sm sm:text-base text-gray-500">Review your performance below to understand your strengths and areas for improvement.</p>
            </div>

            <div className="space-y-4">
              {QUESTIONS.map((q, idx) => {
                const userAnswer = answers[idx];
                const isCorrect = userAnswer === q.answer;

                return (
                  <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-gray-100 text-gray-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                        {q.id}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 pt-0.5">{q.question}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className={`p-4 rounded-xl border-2 flex flex-col ${isCorrect ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                        <span className={`text-[10px] font-bold uppercase mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>Your Answer</span>
                        <span className="font-bold text-sm sm:text-base text-gray-800">{userAnswer || 'No answer selected'}</span>
                      </div>
                      <div className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50 flex flex-col">
                        <span className="text-[10px] text-blue-600 font-bold uppercase mb-1">Correct Answer</span>
                        <span className="font-bold text-sm sm:text-base text-gray-800">{q.answer}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pb-10">
              <button
                onClick={onExit}
                className="bg-black text-white px-8 sm:px-12 py-3 sm:py-4 rounded-2xl font-black text-base sm:text-lg hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                BACK TO HOME
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const optionLabels = ["A", "B", "C", "D"];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <section className="flex-none bg-black text-white justify-between py-3 px-4 sm:px-6 w-full items-center flex shadow-md overflow-x-hidden">
        <div className="flex items-center gap-6 sm:gap-8">
          <RotateCcw
            className="cursor-pointer hover:text-gray-400 transition-colors w-5 h-5 sm:w-6 sm:h-6"
            onClick={handleRestart}
          />
          <LogOut 
            className="cursor-pointer hover:text-gray-400 transition-colors w-5 h-5 sm:w-6 sm:h-6" 
            onClick={onExit} 
          />
        </div>
        {showTimer && (
          <div className="flex gap-2 bg-gray-800 py-1.5 px-3 rounded-full items-center border border-gray-700">
            <Clock size={14} className="sm:w-[16px] sm:h-[16px]" />
            <span className="font-mono font-black text-sm sm:text-base">{formatTime(timeLeft)}</span>
          </div>
        )}
      </section>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-slate-300
        [&::-webkit-scrollbar-thumb]:bg-black
        [&::-webkit-scrollbar-thumb]:rounded-lg bg-gray-100 p-4 sm:p-6">
        <div className="bg-white rounded-xl shadow p-4 sm:p-6 mb-6 animate-in slide-in-from-bottom-2 duration-300 text-left">
          <h2 className="text-lg font-bold mb-3 ">
            Welcome to the React Quiz
          </h2>

          <p className="text-sm sm:text-base text-gray-600 mb-3">
            Please read the instructions carefully before starting the quiz.
          </p>

          <p className="text-sm sm:text-base mb-2">
            <span className="font-bold">Quiz Information:</span> You will complete
            15 questions. Each question has one correct answer. You cannot go back
            after answering.
          </p>

          <p className="text-xs sm:text-sm text-gray-600">
            Do not refresh the page. Ensure stable internet connection.
          </p>
        </div>

        <div className="flex gap-4 sm:gap-6 flex-wrap animate-in slide-in-from-bottom-4 duration-500 mb-6">
          <div className="bg-white w-full sm:w-[280px] rounded-xl shadow p-5">
            <h3 className="font-bold mb-4 text-gray-800 text-left">Quiz Details:</h3>

            <ul className="text-sm space-y-3">
              <li className="flex justify-between">
                <span className="text-gray-500">Total Questions:</span>
                <span className="font-bold text-gray-500">15</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Type:</span>
                <span className="text-gray-500 font-bold uppercase">MCQ</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Time Limit:</span>
                <span className="text-gray-500 font-bold">10 mins</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-500">Attempts:</span>
                <span className="text-gray-500 font-bold">1</span>
              </li>
            </ul>

            <div className="h-px bg-gray-100 my-4" />

            <h4 className="font-medium text-gray-800 text-left">Topics Covered:</h4>
            <ul className="text-sm mt-3 space-y-2">
              <li className="flex items-center gap-2 text-gray-600">
                <div className="w-1 h-1 bg-black rounded-full" /> React Basics
              </li>
              <li className="items-center gap-2 text-gray-600 flex">
                <div className="w-1 h-1 bg-black rounded-full" /> Hooks
              </li>
              <li className="items-center gap-2 text-gray-600 flex">
                <div className="w-1 h-1 bg-black rounded-full" /> State & Props
              </li>
              <li className="items-center gap-2 text-gray-600 flex">
                <div className="w-1 h-1 bg-black rounded-full" /> JSX
              </li>
              <li className="items-center gap-2 text-gray-600 flex">
                <div className="w-1 h-1 bg-black rounded-full" /> Events
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white w-full sm:max-w-[600px] rounded-xl shadow p-5 text-left text-sm sm:text-base">
          Once you're ready, click the button below to start the quiz and the question will appear automatically.
        </div>

        <div className="my-6 sm:my-10 flex justify-end ">
          <button
            onClick={handleStartQuiz}
            disabled={quizStarted}
            className={`w-full sm:w-auto px-8 py-3 rounded-xl font-bold transition-all ${quizStarted ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800 active:scale-95 shadow-lg shadow-black/10"}`}
          >
            {quizStarted ? "Quiz in Progress..." : "Start Quiz"}
          </button>
        </div>

        {QUESTIONS.slice(0, visibleQuestionsCount).map((q, idx) => {
          const isConfirmed = idx < confirmedCount;
          const selectedAnswer = answers[idx];

          return (
            <div
              key={q.id}
              ref={el => questionRefs.current[idx] = el}
              className="p-4 sm:p-8 animate-in duration-500 text-left border-b border-gray-100 last:border-0"
            >
              <div className="flex items-start gap-4 mb-4 sm:mb-6">
                <div className="bg-black text-white w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-bold text-xs sm:text-sm shrink-0">{q.id}</div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 leading-tight">{q.question}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                {isConfirmed ? (
                  <div className="p-4 rounded-xl border-2 border-black bg-gray-50 font-bold text-black animate-in fade-in slide-in-from-left-2 duration-300 flex items-center justify-between group">
                    <div className="flex items-center gap-3 text-sm sm:text-base">
                      <span className="text-gray-400 text-xs">
                        {optionLabels[q.options.indexOf(selectedAnswer)]}.
                      </span>
                      {selectedAnswer}
                    </div>
                    <button
                      onClick={() => setShowExplanation({ q, userAnswer: selectedAnswer })}
                      className="p-1.5 hover:bg-black hover:text-white rounded-lg transition-all text-gray-400"
                      title="View explanation"
                    >
                      <Search size={16} />
                    </button>
                  </div>
                ) : (
                  q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(idx, opt)}
                      className={`text-left p-3 sm:p-4 rounded-xl border-2 transition-all flex items-center gap-3 group text-sm sm:text-base ${answers[idx] === opt ? "border-black bg-gray-50 font-bold" : "border-gray-300 hover:border-gray-500 hover:bg-gray-50/50 text-gray-600 hover:text-black"}`}
                    >
                      <span className={`text-[10px] font-bold ${answers[idx] === opt ? "text-black" : "text-gray-400"}`}>
                        {optionLabels[optIdx]}.
                      </span>
                      {opt}
                    </button>
                  ))
                )}
              </div>

              {!isConfirmed && answers[idx] && (
                <div className="mt-4 flex justify-end items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <button
                    onClick={() => handleContinue(idx)}
                    disabled={isChecking}
                    className="w-full sm:w-auto bg-black text-white px-6 py-2.5 rounded-lg font-bold hover:bg-gray-800 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isChecking ? <><Loader2 size={16} className="animate-spin" /> Checking...</> : "Continue"}
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {confirmedCount === QUESTIONS.length && (
          <div className="flex justify-center pb-20 px-4">
            <button
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-black text-white px-10 sm:px-20 py-4 rounded-2xl font-black text-lg sm:text-xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 animate-bounce flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isSubmitting ? <><Loader2 size={24} className="animate-spin" /> SUBMITTING...</> : "SUBMIT QUIZ"}
            </button>
          </div>
        )}

        {/* Google Themed Explanation Modal */}
        {showExplanation && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-md z-[100] flex items-center justify-center p-2 sm:p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-gray-100 animate-in zoom-in duration-300 max-h-[90vh] flex flex-col">
              <div className="px-4 sm:px-6 pt-4 flex justify-end items-center flex-none">
                <button
                  onClick={() => setShowExplanation(null)}
                  className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="px-4 sm:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6 overflow-y-auto">
                <div>
                  <h4 className="text-left text-black text-lg sm:text-xl font-medium mb-4">
                    {showExplanation.q.question}
                  </h4>

                  <div className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {showExplanation.q.options.map((opt, i) => {
                        const isCorrect = opt === showExplanation.q.answer;
                        const isUserAnswer = opt === showExplanation.userAnswer;

                        let cardClass = "bg-gray-50 border-gray-100 text-gray-400";
                        if (isCorrect) {
                          cardClass = "bg-green-50 border-green-200 text-green-700 font-bold";
                        } else if (isUserAnswer) {
                          cardClass = "bg-red-50 border-red-200 text-red-700 font-bold";
                        }

                        return (
                          <div
                            key={i}
                            className={`p-3 rounded-lg border text-xs sm:text-sm flex items-center gap-2 transition-all ${cardClass}`}
                          >
                            <span className="w-5 h-5 rounded bg-white flex items-center justify-center border border-inherit text-[10px]">
                              {optionLabels[i]}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && <CheckCircle2 size={14} className="ml-auto text-green-600 shrink-0" />}
                            {isUserAnswer && !isCorrect && <X size={14} className="ml-auto text-red-600 shrink-0" />}
                          </div>
                        );
                      })}
                    </div>

                    <div className="bg-blue-50/50 p-4 sm:p-6 rounded-2xl border border-blue-100 animate-in slide-in-from-bottom-2 duration-500">
                      <h5 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2">Expert Explanation</h5>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
                        "{showExplanation.q.explanation}"
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
