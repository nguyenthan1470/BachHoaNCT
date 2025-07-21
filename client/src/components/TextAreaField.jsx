import React from 'react';

const TextAreaField = ({ label, name, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 font-semibold text-gray-700">{label}</label>
      <textarea
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        rows={5}
        className="border border-gray-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
};

export default TextAreaField;
