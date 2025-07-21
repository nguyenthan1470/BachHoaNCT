import React from 'react';

const ScheduleItem = ({ label, time }) => {
  return (
    <div className="flex justify-between text-white text-sm font-semibold">
      <span>{label}</span>
      <span>{time}</span>
    </div>
  );
};

export default ScheduleItem;
