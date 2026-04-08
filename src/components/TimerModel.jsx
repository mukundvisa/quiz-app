import { X, Clock } from "lucide-react";
import { useState, useEffect } from "react";

export default function TimerModel({ setShowTimerModel, setShowModal, selectedMode, onStart }) {
    const [isTimerEnabled, setIsTimerEnabled] = useState(true);

    // Lock timer for Test mode
    useEffect(() => {
        if (selectedMode === "Test") {
            setIsTimerEnabled(true);
        }
    }, [selectedMode]);

    const isTestMode = selectedMode === "Test";

    const handleBack = () => {
        setShowTimerModel(false);
        setShowModal(true);
    };

    const handleStart = () => {
        setShowTimerModel(false);
        onStart(isTimerEnabled);
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] px-4 backdrop-blur-sm">
            <div className="bg-white w-full max-w-[420px] rounded-3xl shadow-2xl p-8 relative animate-in fade-in zoom-in duration-300">
                <button
                    onClick={() => setShowTimerModel(false)}
                    className="absolute top-6 right-6 text-gray-400 hover:text-black transition-colors"
                >
                    <X size={16} />
                </button>

                <h2 className="text-center text-xl font-bold text-gray-900 tracking-tight">
                    Timer Settings
                </h2>
                <div className="space-y-6 py-4">
                    <div className="text-center">

                        <Clock className="h-12 w-12 text-black mx-auto mb-4" />
                        <h3 className="font-semibold text-lg mb-2">
                            Timer Configuration
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Mode: <span className="font-medium capitalize">{selectedMode}</span>
                        </p>
                        {isTimerEnabled && (
                            <p className="text-sm text-muted-foreground">
                                Duration: 30 minutes
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-center space-x-3">
                        <button
                            disabled={isTestMode}
                            onClick={() => setIsTimerEnabled(!isTimerEnabled)}
                            className={`relative w-8 h-4 rounded-full transition-all duration-300 focus:outline-none ${isTimerEnabled ? "bg-black" : "bg-gray-500"
                                } ${isTestMode ? "opacity-50" : "cursor-pointer"}`}
                        >
                            <div
                                className={`absolute top-0 -left-3.5 bg-white w-4 h-4 rounded-full transition-transform duration-300 shadow-sm ${isTimerEnabled ? "translate-x-7" : "translate-x-4"
                                    }`}
                            />
                        </button>
                        <span className={`text-sm ${isTestMode ? "text-gray-400" : "cursor-pointer"}`}>
                            {isTestMode ? "Enable Timer (Required for test mode)" : "Enable Timer"}
                        </span>
                    </div>

                    <div className="flex space-x-3">
                        <button
                            onClick={handleBack}
                            className="flex-1 py-2 px-6 border-2 border-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-50 transition-all duration-200"
                        >
                            Back
                        </button>
                        <button
                            onClick={handleStart}
                            className="flex-1 py-2 px-6 bg-black text-white rounded-xl font-bold hover:bg-gray-900 transition-all duration-200 shadow-lg shadow-black/10 active:scale-[0.98]"
                        >
                            Start
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}