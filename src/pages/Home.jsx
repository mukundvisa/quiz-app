import { useState } from "react"
import ModeModal from "../components/ModeModal"
import TimerModel from "../components/TimerModel"


const Home = () => {
    const [showModal, setShowModal] = useState(false);
    const [showTimerModel, setShowTimerModel] = useState(false);
    const [selectedMode, setSelectedMode] = useState("");

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl aspect-[16/9] bg-white rounded-2xl shadow-2xl relative flex flex-col overflow-hidden border border-gray-100">
                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-3xl font-extrabold text-black mb-6 italic">Interactive Quiz Simulator</div>
                    <h1 className="text-2xl font-bold text-gray-800 mb-12 max-w-2xl text-center">Improve your problem-solving skills with interactive case quizzes.</h1>
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-black hover:bg-gray-800 text-white px-10 py-2 rounded-full font-bold text-xl transition-all shadow-[0_10px_20px_-10px_rgba(0,0,0,0.4)] active:scale-95 border-2 border-transparent hover:border-black/5"
                    >
                        Start
                    </button>
                </div>

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
                    />
                )}
            </div>
        </div>
    )
}

export default Home