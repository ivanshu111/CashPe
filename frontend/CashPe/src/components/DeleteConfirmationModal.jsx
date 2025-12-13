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
    <div className="modal modal-open">
      <div className="modal-box relative">
        <h3 className="font-bold text-lg">Confirm Account Deletion</h3>
        <p className="py-4">{message}</p>

        {error && (
          <div className="text-red-500 bg-red-100 p-3 rounded-md mb-4">
            {error}
          </div>
        )}

        <div className="modal-action">
          <button className="btn btn-ghost" onClick={onClose} disabled={isConfirming}>
            Cancel
          </button>
          <button
            className="btn btn-error"
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
