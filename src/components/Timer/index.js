import React, { useState, useEffect } from "react";
import ProgressBar from "../ProgressBar";
import SetGoalButton from "../SetGoalButton";
import "./Timer.css"; // Import the CSS file

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFasting, setIsFasting] = useState(false);
  const [goalSeconds, setGoalSeconds] = useState(() => {
    const savedGoal = localStorage.getItem("fastingGoal");
    return savedGoal ? parseInt(savedGoal, 10) : 16 * 3600; // Default to 16 hours
  });
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem("fastingHistory");
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    // Load saved fasting state and start time if it exists
    const savedStartTime = localStorage.getItem("fastingStartTime");
    const savedIsFasting = JSON.parse(localStorage.getItem("isFasting"));

    if (savedStartTime && savedIsFasting) {
      const elapsedTime = Math.floor(
        (Date.now() - new Date(savedStartTime)) / 1000
      );
      setSeconds(elapsedTime);
      setIsFasting(true);
      setIsRunning(true);
    }
  }, []);

  useEffect(() => {
    let interval = null;

    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning]);

  const startFasting = () => {
    const startTime = new Date().toISOString();
    localStorage.setItem("fastingStartTime", startTime);
    localStorage.setItem("isFasting", JSON.stringify(true));
    setIsFasting(true);
    setIsRunning(true);
    setSeconds(0);
  };

  const stopFasting = () => {
    setIsFasting(false);
    setIsRunning(false);

    if (seconds > 0) {
      const endTime = new Date().toISOString();
      const newHistory = [
        ...history,
        {
          duration: seconds,
          startTime: localStorage.getItem("fastingStartTime"),
          endTime: endTime,
        },
      ];
      setHistory(newHistory);
      localStorage.setItem("fastingHistory", JSON.stringify(newHistory));
    }

    setSeconds(0);
    localStorage.removeItem("fastingStartTime");
    localStorage.setItem("isFasting", JSON.stringify(false));
  };

  const clearHistory = () => {
    if (
      window.confirm("Are you sure you want to clear your fasting history?")
    ) {
      setHistory([]);
      localStorage.removeItem("fastingHistory");
    }
  };

  const formatTime = (secs) => {
    const hours = Math.floor(secs / 3600);
    const minutes = Math.floor((secs % 3600) / 60);
    const remainingSeconds = secs % 60;
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  return (
    <div>
      <h1>{isFasting ? "Fasting" : "Not Fasting"}</h1>
      <div className="progress-container">
        <ProgressBar
          progress={(seconds / goalSeconds) * 100}
          size={200}
          strokeWidth={10}
          type="circle"
        />
        <div className="progress-time">{formatTime(seconds)}</div>
      </div>
      <h3>Goal: {formatTime(goalSeconds)}</h3>
      {isFasting ? (
        <button onClick={stopFasting}>Stop Fasting</button>
      ) : (
        <button onClick={startFasting}>Start Fasting</button>
      )}
      <SetGoalButton goalSeconds={goalSeconds} setGoalSeconds={setGoalSeconds} />

      <h3>Fasting History</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            {formatTime(entry.duration)} - Started on: {" "}
            {formatDate(entry.startTime)} - Ended on: {" "}
            {formatDate(entry.endTime)}
          </li>
        ))}
      </ul>
      {history.length > 0 && (
        <button onClick={clearHistory}>Clear History</button>
      )}
    </div>
  );
};

export default Timer;
