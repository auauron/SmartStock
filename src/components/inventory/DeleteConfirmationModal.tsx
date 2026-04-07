import { useState, useEffect } from "react";
import { Button } from "../ui/Button";
import { Modal } from "../ui/Modal";
import { Trash2 } from "lucide-react";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void | Promise<void>;
    title: string;
    message: string;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
}: DeleteConfirmationModalProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const t = setTimeout(() => setMounted(true), 10);
            return () => clearTimeout(t);
        } else {
            setMounted(false);
            setIsDeleting(false);
        }
    }, [isOpen]);

    const handleConfirm = async () => {
        setIsDeleting(true);
        try {
            await onConfirm();
            onClose();
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div
                className="p-6 space-y-5"
                style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? "translateY(0)" : "translateY(6px)",
                    transition: "opacity 0.2s ease, transform 0.2s ease",
                }}
            >
                <div className="flex justify-center">
                    <div
                        className="flex items-center justify-center w-14 h-14 rounded-2xl bg-red-50"
                        style={{ boxShadow: "0 0 0 5px #fef2f2" }}
                    >
                        <Trash2 className="w-6 h-6 text-red-500" strokeWidth={1.75} />
                    </div>
                </div>

                <div className="text-center space-y-1.5">
                    <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
                </div>

                <div className="border-t border-gray-100" />

                <div className="flex gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isDeleting}
                        className="
                            flex-1 inline-flex items-center justify-center gap-2
                            rounded-lg px-4 py-2
                            bg-red-600 hover:bg-red-700 active:bg-red-800
                            text-white text-sm font-medium
                            transition-colors duration-150
                            disabled:opacity-60 disabled:cursor-not-allowed
                            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2
                        "
                    >
                        {isDeleting ? (
                            <>
                                <svg
                                    className="w-4 h-4 animate-spin"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    />
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    />
                                </svg>
                                Deleting…
                            </>
                        ) : (
                            <>
                                <Trash2 className="w-4 h-4" strokeWidth={2} />
                                Delete
                            </>
                        )}
                    </button>
                </div>

                <p className="text-center text-xs text-gray-400">
                    This action{" "}
                    <span className="font-medium text-gray-500">cannot</span> be undone.
                </p>
            </div>
        </Modal>
    );
}
