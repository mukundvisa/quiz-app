import { useState, useRef, useEffect } from "react";
import { Clock, RotateCcw, LogOut, CheckCircle2 } from "lucide-react";

const QUESTIONS = [
  { id: 1, question: "What is React?", options: ["A JS Library", "A CSS Framework", "A Database", "An OS"], answer: "A JS Library" },
  { id: 2, question: "What is JSX?", options: ["JavaScript XML", "JSON XML", "Java Syntax", "Scripting Lang"], answer: "JavaScript XML" },
  { id: 3, question: "Which hook is used for state?", options: ["useEffect", "useState", "useContext", "useMemo"], answer: "useState" },
  { id: 4, question: "How to pass data to children?", options: ["Via State", "Via Props", "Via Refs", "Via Keys"], answer: "Via Props" },
  { id: 5, question: "What is the virtual DOM?", options: ["A game", "A copy of the real DOM", "A browser tool", "A database"], answer: "A copy of the real DOM" },
  { id: 6, question: "React component names must start with?", options: ["Lowercase", "Uppercase", "Numbers", "Symbols"], answer: "Uppercase" },
  { id: 7, question: "What is a React Fragment?", options: ["A broken part", "A grouping tool", "A hook", "A style"], answer: "A grouping tool" },
  { id: 8, question: "Which Hook handles side effects?", options: ["useState", "useEffect", "useCallback", "useRef"], answer: "useEffect" },
  { id: 9, question: "Initial value in useState is?", options: ["Required", "Optional", "Always 0", "Always string"], answer: "Optional" },
  { id: 10, question: "Redux is for?", options: ["Styling", "Global State", "Database", "Routing"], answer: "Global State" },
  { id: 11, question: "Vite is a?", options: ["Browser", "Build tool", "Text editor", "Package manager"], answer: "Build tool" },
  { id: 12, question: "Tailwind is a?", options: ["JS Library", "CSS Framework", "Database", "Cloud provider"], answer: "CSS Framework" },
  { id: 13, question: "Node.js runs on?", options: ["Python", "V8 Engine", "Java VM", "PHP"], answer: "V8 Engine" },
  { id: 14, question: "npm stands for?", options: ["Node Personal Mgr", "Node Package Mgr", "New Package Mgr", "Network Mgr"], answer: "Node Package Mgr" },
  { id: 15, question: "React was created by?", options: ["Google", "Facebook", "Microsoft", "Twitter"], answer: "Facebook" }
];

export default function Instructions({ onExit, selectedMode, isTimerEnabled }) {
  const [quizStarted, setQuizStarted] = useState(false);
  const [visibleQuestionsCount, setVisibleQuestionsCount] = useState(0);
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [timeSpent, setTimeSpent] = useState(0);

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

  const handleContinue = (idx) => {
    if (!answers[idx]) return;

    setConfirmedCount(idx + 1);

    if (idx + 1 < QUESTIONS.length) {
      setVisibleQuestionsCount(idx + 2);
      setTimeout(() => {
        questionRefs.current[idx + 1]?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const calculateScore = () => {
    return QUESTIONS.reduce((score, q, idx) => (answers[idx] === q.answer ? score + 1 : score), 0);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  if (isSubmitted) {
    const score = calculateScore();
    return (
      <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
        <header className="flex-none bg-black text-white justify-between py-4 px-8 w-full items-center flex shadow-xl">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-black tracking-tighter italic">QUIZ RESULTS</h1>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end border-r border-white/20 pr-8">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Time Taken</span>
              <span className="text-2xl font-black">{formatTime(timeSpent)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-none">Final Score</span>
              <span className="text-2xl font-black">{score} / {QUESTIONS.length}</span>
            </div>
            <button
              onClick={onExit}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="Exit to home"
            >
              <LogOut size={24} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-slate-300
        [&::-webkit-scrollbar-thumb]:bg-black
        [&::-webkit-scrollbar-thumb]:rounded-lg p-6 md:p-10 space-y-6 bg-gray-100">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center animate-in zoom-in duration-500">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-black text-gray-900">Great Job!</h2>
              <p className="text-gray-500">Review your performance below to understand your strengths and areas for improvement.</p>
            </div>

            <div className="space-y-4">
              {QUESTIONS.map((q, idx) => {
                const userAnswer = answers[idx];
                const isCorrect = userAnswer === q.answer;

                return (
                  <div key={q.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="bg-gray-100 text-gray-500 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">
                        {q.id}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 pt-0.5">{q.question}</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className={`p-4 rounded-xl border-2 flex flex-col ${isCorrect ? 'border-green-100 bg-green-50' : 'border-red-100 bg-red-50'}`}>
                        <span className={`text-[10px] font-bold uppercase mb-1 ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>Your Answer</span>
                        <span className="font-bold text-gray-800">{userAnswer || 'No answer selected'}</span>
                      </div>
                      <div className="p-4 rounded-xl border-2 border-blue-100 bg-blue-50 flex flex-col">
                        <span className="text-[10px] text-blue-600 font-bold uppercase mb-1">Correct Answer</span>
                        <span className="font-bold text-gray-800">{q.answer}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center pb-10">
              <button
                onClick={onExit}
                className="bg-black text-white px-12 py-4 rounded-2xl font-black text-lg hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
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
      <section className="flex-none bg-black text-white justify-between py-2 px-4 w-full items-center flex">
        <div className="flex items-start gap-4">
          <RotateCcw
            className="cursor-pointer hover:text-gray-400 transition-colors"
            onClick={handleRestart}
          />
          <LogOut className="cursor-pointer hover:text-gray-400 transition-colors" onClick={onExit} />
        </div>
        {showTimer && (
          <div className="flex gap-2 bg-gray-500 py-1 px-2 rounded-lg items-center">
            <Clock size={16} />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        )}
      </section>

      <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1
        [&::-webkit-scrollbar-track]:bg-slate-300
        [&::-webkit-scrollbar-thumb]:bg-black
        [&::-webkit-scrollbar-thumb]:rounded-lg bg-gray-100 p-6">
        <div className="bg-white rounded-xl shadow p-6 mb-6 animate-in slide-in-from-bottom-2 duration-300 text-left">
          <h2 className="text-lg font-bold mb-3 ">
            Welcome to the React Quiz
          </h2>

          <p className="text-gray-600 mb-3">
            Please read the instructions carefully before starting the quiz.
          </p>

          <p className="mb-2">
            <span className="font-bold">Quiz Information:</span> You will complete
            15 questions. Each question has one correct answer. You cannot go back
            after answering.
          </p>

          <p className="text-gray-600">
            Do not refresh the page. Ensure stable internet connection.
          </p>
        </div>

        <div className="flex gap-6 flex-wrap animate-in slide-in-from-bottom-4 duration-500 mb-6">
          <div className="bg-white w-[280px] rounded-xl shadow p-5">
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

        <div className="bg-white w-[600px] rounded-xl shadow p-5 text-left">
          Once you're ready, click the button below to start the quiz and the question will appear automatically.
        </div>

        <div className="my-10 flex justify-end ">
          <button
            onClick={handleStartQuiz}
            disabled={quizStarted}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${quizStarted ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-black text-white hover:bg-gray-800 active:scale-95 shadow-lg shadow-black/10"}`}
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
              className="p-8 animate-in duration-500 text-left"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="bg-black text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0">{q.id}</div>
                <h2 className="text-xl font-bold text-gray-900">{q.question}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {isConfirmed ? (
                  <div className="p-4 rounded-xl border-2 border-black bg-gray-50 font-bold text-black animate-in fade-in slide-in-from-left-2 duration-300 flex items-center gap-3">
                    <span className="text-gray-400 text-xs">
                      {optionLabels[q.options.indexOf(selectedAnswer)]}.
                    </span>
                    {selectedAnswer}
                  </div>
                ) : (
                  q.options.map((opt, optIdx) => (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(idx, opt)}
                      className={`text-left p-4 rounded-xl border-2 transition-all flex items-center gap-3 group ${answers[idx] === opt ? "border-black bg-gray-50 font-bold" : "border-gray-400 hover:border-gray-600 hover:bg-gray-50/50 text-gray-600 hover:text-black"}`}
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
                <div className="mt-3 flex justify-end animate-in fade-in slide-in-from-top-2 duration-300">
                  <button
                    onClick={() => handleContinue(idx)}
                    className="bg-black text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-800 transition-all active:scale-95"
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {confirmedCount === QUESTIONS.length && (
          <div className="flex justify-center pb-20">
            <button
              onClick={() => setIsSubmitted(true)}
              className="bg-black text-white px-20 py-4 rounded-2xl font-black text-xl hover:bg-gray-800 transition-all shadow-xl shadow-black/20 animate-bounce"
            >
              SUBMIT QUIZ
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
