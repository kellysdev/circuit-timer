import { useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert"
import Timer from "./components/timer";

function App() {
  // seconds left in current round
  const [seconds, setSeconds] = useState(null);
  // number of active seconds in current round
  const [workoutSeconds, setWorkoutSeconds] = useState(45);
  // number of rest seconds in current round
  const [restSeconds, setRestSeconds] = useState(15);
  // roundPeriod = workout or rest
  const [roundPeriod, setRoundPeriod] = useState("workout");
  // a circuit is a number of rounds
  const [circuits, setCircuits] = useState(1);
  const [currentCircuit, setCurrentCircuit] = useState(1);
  // rest between circuits
  const [circuitRestSeconds, setCircuitRestSeconds] = useState(60);
  const [isCircuitRest, setIsCircuitRest] = useState(false);

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

  // number of rounds in circuit
  const [rounds, setRounds] = useState(7);
  // number of rounds completed in current circuit
  const [roundsCompleted, setRoundsCompleted] = useState(0);

  const [editWorkout, setEditWorkout] = useState(true);
  const [timerState, setTimerState] = useState("stopped");
  // snackbar handling
  const [open, setOpen] = useState(false);
  const snackBarMessage = isCircuitRest ? "CIRCUIT REST" : (roundPeriod === "workout" ? "GO" : "REST");
  const snackBarColor = roundPeriod === "workout" ? "success" : "error";

  useEffect(() => {
    let interval;

    if (timerState === "running" && seconds >= 0) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds > 0) {
            return prevSeconds - 1;
          } else {
            // Handle transitions when seconds reach 0
            if (isCircuitRest) {
              // End of circuit rest, start next circuit
              setIsCircuitRest(false);
              setCurrentCircuit(prev => prev + 1);
              setRoundsCompleted(0);
              setRoundPeriod("workout");
              setOpen(true);
              return workoutSeconds;
            } else if (roundPeriod === "workout") {
              // End of workout period
              setRoundPeriod("rest");
              setOpen(true);
              setRoundsCompleted((prevRounds) => {
                const newRounds = prevRounds + 1;
                // Check if all rounds in current circuit are completed
                if (newRounds >= rounds) {
                  // Circuit completed, check if more circuits remain
                  if (currentCircuit >= circuits) {
                    // All circuits completed, stop timer
                    setTimerState("stopped");
                    return rounds;
                  } else {
                    // Start circuit rest period
                    setIsCircuitRest(true);
                    setRoundPeriod("rest");
                    return circuitRestSeconds;
                  }
                }
                return newRounds;
              });
              return restSeconds;
            } else if (roundPeriod === "rest" && !isCircuitRest) {
              // End of regular rest period
              setRoundPeriod("workout");
              setOpen(true);
              return workoutSeconds;
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
  }, [timerState, seconds, rounds, roundPeriod, workoutSeconds, restSeconds, circuits, currentCircuit, circuitRestSeconds, isCircuitRest]);

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
    setCurrentCircuit(1);
    setIsCircuitRest(false);
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
    const restTimeInSeconds = prevTimes.hours * 3600 + prevTimes.minutes * 60 + prevTimes.seconds;
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
    if (circuits < 1) problems += "Please enter at least 1 curcuit.";
    if (circuitRestSeconds < 1) problems += "Please enter at least 1 second of rest between circuits.";
    if (problems !== "") return alert(problems);

    setSeconds(workoutSeconds);
    setEditWorkout(false);
    setRoundPeriod("workout");
    setRoundsCompleted(0);
    setCurrentCircuit(1);
    setIsCircuitRest(false);
  };

  return (
    <body>
      <div className="content">
        <header>Circuit Timer</header>
        {/* display the edit or timer page */}
        {editWorkout ? (
          <div className="edit-workout-container">
            <p className="instructions">Set the time for each round of your workout,<br />
              then click &quot;Get Started&quot; to begin!</p>
            <h3>Workout Time</h3>
            <div>
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
            <div>
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

            <h3>Rounds per Circuit</h3>
            <input
              type="number"
              label="Rounds"
              placeholder="Rounds per circuit"
              onChange={handleRoundsChange}
              min={1}
              value={rounds}
              className="rounds-input"
            />

            <h3>Number of Circuits</h3>
            <input
              type="number"
              label="Circuits"
              placeholder="Number of circuits"
              onChange={(e) => setCircuits(parseInt(e.target.value))}
              min={1}
              value={circuits}
              className="circuits-input"
            />

            <h3>Rest Between Circuits (seconds)</h3>
            <input
              type="number"
              label="Circuit Rest"
              placeholder="Rest between circuits"
              onChange={(e) => setCircuitRestSeconds(parseInt(e.target.value))}
              min={1}
              value={circuitRestSeconds}
              className="circuit-rest-input"
            />

            <div>
              <button
                onClick={handleGetStarted}
                className="btn btn-edit"
              >Get Started</button>
            </div>

          </div>
        ) : (
          // timer page
          <div className="timer-page-container">
            {/* <header>
                {timerState === "stopped" ? "Press Start" : roundPeriod === "workout" ? "Work" : "Rest"}
              </header> */}
            <div className="progress-info">
              <p>Circuit {currentCircuit} of {circuits}</p>
              {isCircuitRest ? (
                <p>Circuit Rest</p>
              ) : (
                <p>Round {roundsCompleted !== rounds ? roundsCompleted + 1 : rounds} of {rounds}</p>
              )}
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
          <div>
            <div>Circuits: {circuits}</div>
            <div>Rounds per Circuit: {rounds}</div>
            <div>Active: {workoutSeconds} s</div>
            <div>Rest: {restSeconds} s</div>
            <div>Circuit Rest: {circuitRestSeconds} s</div>
          </div>
          <button
            onClick={() => setEditWorkout(true)}
            className="btn btn-edit"
          >Edit Workout</button>
        </div>
      )}
      <Snackbar
        open={open}
        onClose={handleClose}
        autoHideDuration={1000}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
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
    </body>
  )
};

export default App;