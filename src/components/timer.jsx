/* eslint-disable react/prop-types */
import CircularProgress from "@mui/material/CircularProgress";
import './timer.css';

const Timer = ({ roundPeriod, workoutSeconds, restSeconds, seconds, startOrStopTimer, timerState, resetTimer }) => {
  const MAX = (roundPeriod === "workout" ? workoutSeconds : restSeconds);
  const normalise = (value) => (value * 100) / (MAX);
  const progressColor = (roundPeriod === "workout" ? "success" : "error");
  
  return (
    <div className="timer">

      <div className="seconds-container">
        <CircularProgress 
          variant="determinate" value={normalise(seconds)} 
          className="circular-progress"
          color={progressColor}
          size="8em"
        />
        {seconds !== null ? (
        <p className="seconds">{seconds}</p>
        ) : <h2 className="seconds">00</h2>}
      </div>

      <button onClick={startOrStopTimer}>
        {timerState !== "running" ? "Start" : "Stop"}
      </button>
      <button onClick={resetTimer}>Reset</button>

  </div>
  )
};

export default Timer;