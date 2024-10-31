import React, { useState, useEffect } from "react";

const Timer = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFasting, setIsFasting] = useState(false);
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
    return `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${
      remainingSeconds < 10 ? "0" : ""
    }${remainingSeconds}`;
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
      <h2>{formatTime(seconds)}</h2>
      {isFasting ? (
        <button onClick={stopFasting}>Stop Fasting</button>
      ) : (
        <button onClick={startFasting}>Start Fasting</button>
      )}

      <h3>Fasting History</h3>
      <ul>
        {history.map((entry, index) => (
          <li key={index}>
            {formatTime(entry.duration)} - Started on:{" "}
            {formatDate(entry.startTime)} - Ended on:{" "}
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
