import dayjs from "dayjs";
import { FC, useState, useEffect } from "react";
import { MAX_RECORDING_DURATION_IN_MINUTE } from "../../hooks/useRecording";

const Timer: FC<{ startAt: any; endAt: any; stopRecording: any }> = ({
  startAt,
  endAt,
  stopRecording,
}) => {
  const [secondsLeft, setSecondsLeft] = useState(
    MAX_RECORDING_DURATION_IN_MINUTE * 60
  );

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSecondsLeft((secondsLeft) => secondsLeft - 1);
    }, 1000);
    if (!startAt || !endAt) return;

    if (dayjs().isAfter(endAt)) {
      stopRecording();
    }
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className=" mb-10 w-full text-center">
      <div className="text-4xl text-white">
        {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
      </div>
    </div>
  );
};

export default Timer;
