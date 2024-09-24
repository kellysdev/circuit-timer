import { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"
import Timer from "./components/timer";
import './App.css'

function App() {
  const [seconds, setSeconds] = useState(null);
  const [workoutSeconds, setWorkoutSeconds] = useState(45);
  const [restSeconds, setRestSeconds] = useState(15);
  const [roundPeriod, setRoundPeriod] = useState("workout");

  const [workoutPeriod, setWorkoutPeriod] = useState({
    hours: 0,
    minutes: 0,
    seconds: 45
  });
  const [restPeriod, setRestPeriod] = useState({
    hours: 0,
    minutes: 0,
    seconds: 15
  });

  const [rounds, setRounds] = useState(7);
  const [roundsCompleted, setRoundsCompleted] = useState(0);
  const [editWorkout, setEditWorkout] = useState(true);
  const [timerState, setTimerState] = useState("stopped");

  const [open, setOpen] = useState(false);
  const snackBarMessage = roundPeriod === "workout" ? "GO" : "REST";
  const snackBarColor = roundPeriod === "workout" ? "success" : "error";

  useEffect(() => {
    let interval;
  
    if (timerState === "running" && seconds >= 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            // Transition between workout and rest periods when seconds reach 0
            if (roundPeriod === "workout") {
              setRoundPeriod("rest");
              setOpen(true);
              // Increment rounds completed when workout ends
              setRoundsCompleted((prevRounds) => {
                const newRounds = prevRounds + 1;
                // Check if all rounds are completed
                if (newRounds >= rounds) {
                  setTimerState("stopped");
                  return rounds; // Ensure we don't exceed the total number of rounds
                }
                return newRounds;
              });
              return restSeconds; // Switch to rest
            } else if (roundPeriod === "rest") {
              setRoundPeriod("workout");
              setOpen(true);
              return workoutSeconds; // Switch back to workout
            }
            return 0; // Safety fallback
          }
        });
      }, 1000);
    }
  
    // Clean up interval when the timer is stopped
    if (timerState === "stopped") {
      clearInterval(interval);
    }
  
    return () => clearInterval(interval);
  }, [timerState, seconds, rounds, roundPeriod, workoutSeconds, restSeconds]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const startOrStopTimer = () => {
    if (seconds === 0) {
      resetTimer();
      setOpen(true);
      return setTimerState("running");
    } else if (timerState === "stopped") {
      setOpen(true);
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
    <div className="app-container">
      <header>Circuit Timer</header>
      {/* display edit screen or timer component */}
        <div className="content">
          {editWorkout ? (
            <div className="edit-workout-container">
              <p>Set the time for each round of your workout.</p>
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
            // timer page
            <div className="timer-page-container">
              <div className="space-around-container workout-status">
                <span>Rounds Completed: <strong>{roundsCompleted}</strong></span>
                <span>Rounds to Go: <strong>{rounds - roundsCompleted}</strong></span>  
              </div>
              <Timer 
                roundPeriod={roundPeriod}
                workoutSeconds={workoutSeconds}
                restSeconds={restSeconds}
                seconds={seconds}
                startOrStopTimer={startOrStopTimer}
                timerState={timerState}
                resetTimer={resetTimer}
              />
            </div>
          )}
          {/* display workout details */}
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
        <Snackbar 
          open={open}
          onClose={handleClose}
          autoHideDuration={1000}
          anchorOrigin={{vertical: "bottom", horizontal: "center"}}
          severity={snackBarColor}
        >
          <Alert
            icon={false}
            variant="filled"
            severity={snackBarColor}
            sx={{ width: "100%" }}
          >
            {snackBarMessage}
          </Alert>            
        </Snackbar>
    </div>
  )
};

export default App;