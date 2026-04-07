import { X, BookOpen, FileText } from "lucide-react";


export default function ModeModal({ setShowModal, setShowTimerModel, setSelectedMode }) {

    const handleModeClick = (mode) => {
        setSelectedMode(mode);
        setShowTimerModel(true);
        setShowModal(false);
    }

    return (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
            <div className="bg-white w-[420px] rounded-xl shadow-lg p-6 relative">
                <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-4 right-4 text-gray-500 hover:text-black"
                >
                    <X size={16} />
                </button>
                <h2 className="text-center text-lg font-bold pb-4">
                    Choose Mode
                </h2>
                <div className="border rounded-xl p-6 my-6 shadow-sm hover:border-black transition cursor-pointer" onClick={() => handleModeClick("Practice")}>
                    <div className="flex gap-6 py-6 items-center">
                        <div className="text-black-600 mt-1">
                            <BookOpen size={28} />
                        </div>
                        <div>
                            <h3 className="text-left text-lg font-bold text-black">
                                Practice Mode
                            </h3>
                            <p className="text-left text-sm text-muted-foreground mt-1">
                                Learn and practice without pressure. Timer can be disabled.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="border rounded-xl p-6 my-6 shadow-sm hover:border-black transition cursor-pointer" onClick={() => handleModeClick("Test")}>
                    <div className="flex gap-6 py-6 items-center">
                        <div className="text-black-600 mt-1">
                            <FileText size={28} />
                        </div>
                        <div>
                            <h3 className="text-left text-lg font-bold text-black">
                                Test Mode
                            </h3>
                            <p className="text-left text-sm text-gray-500 mt-1">
                                Simulate real exam conditions. Timer is always enabled.
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    );
}