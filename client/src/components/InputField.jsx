import React from 'react';

const InputField = ({ label, name, value, onChange, type = 'text' }) => {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="mb-2 font-semibold text-gray-700">{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
      />
    </div>
  );
};

export default InputField;
