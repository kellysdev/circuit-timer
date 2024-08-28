import { useState, useEffect } from "react";
import Timer from "./components/timer";
import './App.css'

function App() {
  const [seconds, setSeconds] = useState(null);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [restSeconds, setRestSeconds] = useState(0);
  const [roundPeriod, setRoundPeriod] = useState("workout");

  const [workoutPeriod, setWorkoutPeriod] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [restPeriod, setRestPeriod] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [rounds, setRounds] = useState(1);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [editWorkout, setEditWorkout] = useState(true);
  const [timerState, setTimerState] = useState("stopped");

  useEffect(() => {
    let interval;
    if (timerState === "running" && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(prevSeconds => prevSeconds - 1);
      }, 1000)
    } else if (timerState === "stopped") {
      return () => clearInterval(interval);
    } else if (seconds === 0) {
      if (roundPeriod === "workout") {
        if (roundsCompleted < rounds - 1) {
          setRoundsCompleted(prevRounds => prevRounds + 1);
          setRoundPeriod("rest");
          setSeconds(restSeconds);
        } else {
          setTimerState("stopped");
        }
      } else if (roundPeriod === "rest") {
        setRoundPeriod("workout");
        setSeconds(workoutSeconds);
      };
    };
    return () => clearInterval(interval);
  }, [timerState, seconds, roundsCompleted, rounds, roundPeriod, workoutSeconds, restSeconds]);

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
    setSeconds(workoutSeconds);
    setRoundPeriod("workout");
    setRoundsCompleted(0);
  };

  // handle change from inputs
  const handlePeriodChange = (e, roundPeriod, timeUnit) => {
    const val = parseInt(e.target.value);
    
    // if coming from an input under workout time
    if (roundPeriod === "workout") {
      // copy workoutPeriod object
      let prevTimes = { ...workoutPeriod };
      prevTimes[timeUnit] = val;
      // convert to seconds
      const workoutTimeInSeconds = prevTimes.hours * 3600 + prevTimes.minutes * 60 + prevTimes.seconds;

      setWorkoutSeconds(workoutTimeInSeconds);
      return setWorkoutPeriod(prevTimes);
    }

    let prevTimes = { ...restPeriod };
    prevTimes[timeUnit] = val;
    const restTimeInSeconds = prevTimes.hours * 3600 + prevTimes.minutes *  60 + prevTimes.seconds;
    setRestSeconds(restTimeInSeconds);
    return setRestPeriod(prevTimes);
  };

  const handleRoundsChange = (e) => {
    setRounds(e.target.value);
  };

  const handleGetStarted = () => {
    let problems = "";
    if (workoutSeconds < 1) problems += "Please enter a workout time greater than 0.";
    if (rounds < 1) problems += "Please make timer rounds more than 0.";
    if (restSeconds < 1) problems += "Please enter a rest time greater than 0.";
    if (problems !== "") return alert(problems);

    setSeconds(workoutSeconds);
    setEditWorkout(false);

    if (roundPeriod === "rest") setRoundPeriod("workout");
    setRoundsCompleted(0);
  };

  return (
    <>
      {/* <header>Circuit Timer</header> */}
        <div className="content">
          {editWorkout ? (
            <div className="edit-workout-container">

              <h3>Workout Time</h3>
              <div className="space-around-container">
                <span>hours</span>
                <span>minutes</span>
                <span>seconds</span>
              </div>
              <input 
                type="number"
                placeholder="hours"
                min={0}
                max={24}
                onChange={(e) => handlePeriodChange(e, "workout", "hours")}
                value={workoutPeriod.hours}
              />
              <input
                type="number"
                placeholder="minutes"
                min={0}
                max={60}
                onChange={(e) => handlePeriodChange(e, "workout", "minutes")}
                value={workoutPeriod.minutes}
              />
              <input
                type="number"
                placeholder="seconds"
                min={1}
                max={60}
                onChange={(e) => handlePeriodChange(e, "workout", "seconds")}
                value={workoutPeriod.seconds}
              />

              <h3>Rest Time</h3>
              <div className="space-around-container">
                <span>hours</span>
                <span>minutes</span>
                <span>seconds</span>
              </div>
              <input 
                type="number"
                placeholder="hours"
                min={0}
                max={24}
                onChange={(e) => handlePeriodChange(e, "rest", "hours")}
                value={restPeriod.hours}
              />
              <input 
                type="number"
                placeholder="minutes"
                min={0}
                max={60}
                onChange={(e) => handlePeriodChange(e, "rest", "minutes")}
                value={restPeriod.minutes}
              />
              <input
                type="number"
                placeholder="seconds"
                min={1}
                max={60}
                onChange={(e) => handlePeriodChange(e, "rest", "seconds")}
                value={restPeriod.seconds}
              />

              <h3>Rounds</h3>
              <input 
                type="number"
                label="Rounds"
                placeholder="Rounds"
                onChange={handleRoundsChange}
                min={1}
                value={rounds}
                className="rounds-input"
              />

              <button 
                onClick={handleGetStarted}
                className="start-button"
              >Get Started</button>

            </div>
          ) : (
            <div className="timer-page-container">
              <div className="space-around-container workout-status">
                <span>Rounds Completed: <strong>{roundsCompleted}</strong></span>
                <span>Rounds to Go: <strong>{rounds - roundsCompleted}</strong></span>                
              </div>
              <Timer 
                roundPeriod={roundPeriod}
                seconds={seconds}
                startOrStopTimer={startOrStopTimer}
                timerState={timerState}
                resetTimer={resetTimer}
              />
            </div>
          )}
        </div>
        {rounds > 0 && workoutSeconds > 0 && !editWorkout && (
          <div className="workout-stats-container">
            <h3 className="stats-title">Workout</h3>
            <div className="stats-container">
              <div className="stats">Rounds: {rounds}</div>
              <div className="stats">Active: {workoutSeconds} s</div>
              <div className="stats">Rest: {restSeconds} s</div>
            </div>
            <button 
              onClick={() => setEditWorkout(true)}
              className="edit-button"
            >Edit Workout</button>
          </div>
        )}
    </>
  )
};

export default App;