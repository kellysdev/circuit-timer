import { useState, useEffect } from "react";

import './App.css'

function App() {
  const [seconds, setSeconds] = useState(30);
  const [timerState, setTimerState] = useState("stopped");

  useEffect(() => {
    let interval;

    if (timerState === "running" && seconds) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000)
    };

    return () => clearInterval(interval);
  }, [timerState, seconds]);

  const startOrStopTimer = () => {
    if (seconds === 0) {
      resetTimer();
      return setTimerState("running");
    } else if (timerState === "stopped") {
      return setTimerState("running");
    } else {
      setTimerState("stopped");
    };
    setTimerState("stopped");
  };

  const resetTimer = () => {
    setTimerState("stopped");
    setSeconds(30);
  };

  return (
    <>
      <header>Circuit Timer</header>
      <main>
        <div className="individual-timer-component">
          <div>{seconds}</div>
          <button onClick={startOrStopTimer}>{timerState !== "running" ? "Start" : "Stop"}</button>
          <button onClick={resetTimer}>Reset</button>
        </div>
      </main>
    </>
  )
};

export default App;