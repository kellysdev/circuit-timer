const Timer = ({ roundPeriod, seconds, startOrStopTimer, timerState, resetTimer }) => {
  return (
    <div className="timer">
      <div className={`seconds-container ${roundPeriod}`}>
        {seconds != null ? (
        <h2 className="seconds">{seconds}</h2>
        ) : null}
      </div>
      <button onClick={startOrStopTimer}>{timerState !== "running" ? "Start" : "Stop"}</button>
      <button onClick={resetTimer}>Reset</button>
  </div>
  )
};

export default Timer;