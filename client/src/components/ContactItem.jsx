import React from 'react';

const ContactItem = ({ icon: Icon, color, title, desc }) => {
  return (
    <div className="flex items-center space-x-4">
      <div className={`p-3 bg-${color}-100 rounded-full`}>
        <Icon className={`w-6 h-6 text-${color}-600`} />
      </div>
      <div>
        <h3 className="font-bold text-gray-800">{title}</h3>
        <p className="text-gray-600 text-sm">{desc}</p>
      </div>
    </div>
  );
};

export default ContactItem;
