import React from "react";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  error,
  isConfirming,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal modal-open backdrop-blur-sm">
      <div className="modal-box relative max-w-md rounded-2xl shadow-2xl bg-base-100 p-6">
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 flex items-center justify-center rounded-full bg-red-100 text-red-600 text-2xl">
            ⚠️
          </div>
        </div>

        {/* Title */}
        <h3 className="font-extrabold text-xl text-center mb-2">
          Confirm Account Deletion
        </h3>

        {/* Message */}
        <p className="text-center text-base-content/70 mb-5">{message}</p>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            className="btn rounded-full px-8 bg-base-200 hover:bg-base-300 border-none"
            onClick={onClose}
            disabled={isConfirming}
          >
            Cancel
          </button>

          <button
            className="btn rounded-full px-8 bg-red-600 hover:bg-red-700 text-white border-none shadow-md"
            onClick={onConfirm}
            disabled={isConfirming}
          >
            {isConfirming ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
