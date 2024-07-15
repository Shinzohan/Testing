import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';

interface NotificationProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, isVisible, onClose }) => (
  <AnimatePresence>
    {isVisible && (
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-5 right-5 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50"
      >
        <div className="flex items-center justify-between">
          <p>{message}</p>
          <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
            <FiX />
          </button>
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default Notification;