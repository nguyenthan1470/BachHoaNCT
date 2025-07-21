import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const AlertMessage = ({ type, message }) => {
  const baseClass = "p-4 rounded-lg text-sm font-semibold mb-4 flex items-center space-x-2 border";
  const typeClasses = {
    success: "bg-green-50 text-green-800 border-green-300",
    error: "bg-red-50 text-red-800 border-red-300"
  };
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-600" />,
    error: <XCircle className="w-5 h-5 text-red-600" />
  };

  return (
    <div className={`${baseClass} ${typeClasses[type] || ''}`}>
      {icons[type]}
      <span>{message}</span>
    </div>
  );
};

export default AlertMessage;
