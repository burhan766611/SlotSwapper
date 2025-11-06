import React, { createContext, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (title, message, type = "info", duration = 3000) => {
    setAlert({ title, message, type });
    setTimeout(() => setAlert(null), duration);
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}

      <AnimatePresence>
        {alert && (
          <motion.div
            key="alert"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-4 right-4 z-50 rounded-2xl shadow-lg px-4 py-3 border
              ${
                alert.type === "success"
                  ? "bg-green-100 border-green-500 text-green-700"
                  : alert.type === "error"
                  ? "bg-red-100 border-red-500 text-red-700"
                  : alert.type === "warning"
                  ? "bg-yellow-100 border-yellow-500 text-yellow-700"
                  : "bg-blue-100 border-blue-500 text-blue-700"
              }`}
          >
            <strong className="block font-semibold">{alert.title}</strong>
            <p className="text-sm">{alert.message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  );
};
