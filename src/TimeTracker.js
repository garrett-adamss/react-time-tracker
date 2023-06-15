import React, { useState, useEffect } from 'react';

const TimeTracker = () => {
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    // Retrieve data from local storage on component mount
    const storedData = localStorage.getItem('timeData');
    if (storedData) {
      setTimeData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    // Update local storage whenever timeData changes
    localStorage.setItem('timeData', JSON.stringify(timeData));
  }, [timeData]);

  const handleSubmit = (event) => {
    event.preventDefault();

    // Get form inputs (task name, start time, end time)
    const taskName = event.target.elements.taskName.value;
    const startTime = event.target.elements.startTime.value;
    const endTime = event.target.elements.endTime.value;

    // Create a new time tracking object
    const newTimeEntry = {
      taskName,
      startTime,
      endTime,
    };

    // Add the new time entry to the array in state
    setTimeData((prevTimeData) => [...prevTimeData, newTimeEntry]);

    // Reset form inputs
    event.target.reset();
  };

  return (
    <div>
      <h1>Time Tracker</h1>

      <form onSubmit={handleSubmit}>
        <label>
          Task Name:
          <input type="text" name="taskName" />
        </label>

        <label>
          Start Time:
          <input type="text" name="startTime" />
        </label>

        <label>
          End Time:
          <input type="text" name="endTime" />
        </label>

        <button type="submit">Add Time Entry</button>
      </form>

      <h2>Time Entries</h2>

      <ul>
        {timeData.map((entry, index) => (
          <li key={index}>
            <strong>Task:</strong> {entry.taskName}, <strong>Start Time:</strong> {entry.startTime}, <strong>End Time:</strong> {entry.endTime}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeTracker;
