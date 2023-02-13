import dayjs from "dayjs";
import { FC, useState, useEffect } from "react";
import { MAX_RECORDING_DURATION_IN_MINUTE } from "../../hooks/useRecording";

const Timer: FC<{
  startAt: Date;
  endAt: Date | null;
  stopRecording: () => void;
}> = ({ startAt, endAt, stopRecording }) => {
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
  }, [secondsLeft]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;

  return (
    <div className="grid auto-cols-max grid-flow-col gap-5 text-center">
      <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span className="countdown font-mono text-5xl">
          {/* @ts-ignore */}
          <span style={{ "--value": minutes }}></span>
        </span>
        min
      </div>
      <div className="rounded-box flex flex-col bg-neutral p-2 text-neutral-content">
        <span className="countdown font-mono text-5xl">
          {/* @ts-ignore */}
          <span style={{ "--value": seconds }}></span>
        </span>
        sec
      </div>
    </div>
  );
};

export default Timer;
