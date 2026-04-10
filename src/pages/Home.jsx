import ModeModal from "../components/ModeModal"
import TimerModel from "../components/TimerModel"
import Instructions from "./Instructions"
import { useState } from "react"

const Home = () => {
    const [step, setStep] = useState("startWithFirst");
    const [showModal, setShowModal] = useState(false);
    const [showTimerModel, setShowTimerModel] = useState(false);
    const [selectedMode, setSelectedMode] = useState("");
    const [isTimerEnabled, setIsTimerEnabled] = useState(true);

    const handleStartTimer = (timerEnabled) => {
        setIsTimerEnabled(timerEnabled);
        setStep("instructions");
    };

    const handleExit = () => {
        setStep("startWithFirst");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
            <div className="w-full max-w-6xl md:aspect-[16/9] min-h-[500px] md:min-h-0 bg-white rounded-2xl shadow-2xl relative flex flex-col overflow-hidden border border-gray-100">
                {/* Intro Screen */}
                {step === "startWithFirst" && (
                    <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in duration-500 p-6">
                        <div className="text-2xl sm:text-3xl font-extrabold text-black mb-4 sm:mb-6 italic text-center">Interactive Quiz Simulator</div>
                        <h1 className="text-lg sm:text-2xl font-bold text-gray-800 mb-8 sm:mb-12 max-w-2xl text-center px-4">Improve your problem-solving skills with interactive case quizzes.</h1>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-black hover:bg-gray-800 text-white px-8 sm:px-10 py-2 sm:py-3 rounded-full font-bold text-lg sm:text-xl transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.4)] active:scale-95 border-2 border-transparent"
                        >
                            Start
                        </button>
                    </div>
                )}

                {/* Instructions Screen */}
                {step === "instructions" && (
                    <Instructions
                        onExit={handleExit}
                        selectedMode={selectedMode}
                        isTimerEnabled={isTimerEnabled}
                    />
                )}

                {/* Modals */}
                {showModal && (
                    <ModeModal
                        setShowModal={setShowModal}
                        setShowTimerModel={setShowTimerModel}
                        setSelectedMode={setSelectedMode}
                    />
                )}
                {showTimerModel && (
                    <TimerModel
                        setShowTimerModel={setShowTimerModel}
                        setShowModal={setShowModal}
                        selectedMode={selectedMode}
                        onStart={handleStartTimer}
                    />
                )}
            </div>
        </div>
    )
}

export default Home
