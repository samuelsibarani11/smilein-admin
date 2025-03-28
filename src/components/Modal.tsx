import React, { useState, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  onConfirm?: () => void | Promise<void>;
  confirmText?: string;
  cancelText?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  description,
  onConfirm,
  confirmText = 'Simpan',
  cancelText = 'Batal',
  size = 'lg'
}: ModalProps) => {
  const [isLoading, setIsLoading] = useState(false);

  // Close modal on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  // Size classes with added responsive margins
  const sizeClasses = {
    'sm': 'max-w-md w-[95%] sm:w-[90%] md:w-[80%]',
    'md': 'max-w-xl w-[95%] sm:w-[90%] md:w-[80%] lg:w-[70%]',
    'lg': 'max-w-4xl w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%]',
    'xl': 'max-w-6xl w-[95%] sm:w-[90%] md:w-[90%] lg:w-[85%]',
    'full': 'max-w-full w-[95%] sm:w-[90%]'
  };

  const handleConfirm = async () => {
    if (onConfirm) {
      try {
        setIsLoading(true);
        const result = onConfirm();

        if (result instanceof Promise) {
          await result;
        }

        onClose();
      } catch (error) {
        console.error('Error in onConfirm:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className={`
          ${sizeClasses[size]} 
          mx-auto
          max-h-[90vh] 
          bg-white 
          dark:bg-gray-800 
          rounded-lg 
          shadow-xl 
          overflow-hidden 
          relative
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700">
          <div className="pr-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {title}
            </h3>
            {description && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                {description}
              </p>
            )}
          </div>
          <button
            className="
              text-gray-400 
              hover:text-gray-600 
              dark:hover:text-gray-200 
              focus:outline-none 
              text-2xl 
              sm:text-3xl 
              font-light
              flex-shrink-0
            "
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 max-h-[60vh] overflow-y-auto">
          {children}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end p-4 sm:p-5 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            disabled={isLoading}
            className="
              mr-2 
              sm:mr-3 
              px-3 
              sm:px-4 
              py-2 
              text-sm
              text-gray-600 
              dark:text-gray-300 
              hover:bg-gray-100 
              dark:hover:bg-gray-700 
              rounded-md 
              transition-colors
              disabled:opacity-50
            "
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            disabled={isLoading}
            className="
              px-3 
              sm:px-4 
              py-2 
              text-sm
              bg-blue-500 
              text-white 
              rounded-md 
              hover:bg-blue-600 
              transition-colors
              flex 
              items-center 
              justify-center
              disabled:opacity-50
            "
            onClick={handleConfirm}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-4 w-4 sm:h-5 sm:w-5 mr-2"
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
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;