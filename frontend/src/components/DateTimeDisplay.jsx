// components/DateTimeDisplay.jsx
import { useState, useEffect } from "react";

const DateTimeDisplay = () => {
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(timer);
  }, []);

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Today</h3>
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-600">
          {currentDateTime.toLocaleDateString(undefined, {
            day: "numeric",
            month: "short",
          })}
        </p>
        <p className="text-lg">
          {currentDateTime.toLocaleDateString(undefined, { weekday: "long" })}
        </p>
        <p className="text-sm text-gray-500">
          {currentDateTime.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
};

export default DateTimeDisplay;
