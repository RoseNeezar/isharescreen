import dayjs from "dayjs";
import { useCallback, useMemo, useReducer } from "react";

const MAX_RECORDING_DURATION_IN_MINUTE = 10;

type State = {
  isRecording: boolean;
  isMuted: boolean;
  recorder: MediaRecorder | null;
  blob: Blob | null;
  startAt: Date | null;
};

type Action = (state: State) => State;

const recordReducer = (state: State, action: Action) => ({
  ...state,
  ...action(state),
});

export const useRecording = () => {
  const [state, setState] = useReducer(recordReducer, {
    isRecording: false,
    isMuted: true,
    recorder: null,
    blob: null,
    startAt: null,
  });

  const { blob, isMuted, isRecording, recorder, startAt } = useMemo(
    () => state,
    [state]
  );

  const endAt = useMemo(
    () =>
      startAt
        ? dayjs(startAt)
            .add(MAX_RECORDING_DURATION_IN_MINUTE, "minute")
            .toDate()
        : null,
    [startAt]
  );

  const startRecording = useCallback(async () => {
    const videoStream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" } as MediaTrackConstraints,
    });
    let stream: MediaStream;

    if (isMuted) {
      stream = videoStream;
    } else {
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      const videoTrack = videoStream.getTracks()[0]!;
      const audioTrack = audioStream.getTracks()[0]!;

      stream = new MediaStream([videoTrack, audioTrack]);
    }

    const mimeType = MediaRecorder.isTypeSupported("video/webm; codecs=vp9")
      ? "video/webm; codecs=vp9"
      : "video/webm";

    const recorder = new MediaRecorder(stream, { mimeType });
    recorder.start();

    setState(() => ({
      ...state,
      isRecording: true,
      recorder: recorder,
      startAt: new Date(),
    }));
  }, [setState]);

  const stopRecording = () => {
    if (!recorder) return;

    setState((s) => ({
      ...state,
      isRecording: false,
      startAt: null,
    }));

    recorder.ondataavailable = (e) => {
      const blob = new Blob([e.data], { type: e.data.type });
      setState((s) => ({
        ...state,
        blob,
      }));
    };

    if (recorder.state === "recording") {
      recorder.stop();
    }

    if (recorder.stream) {
      recorder.stream.getVideoTracks().forEach((s) => s.stop());
      recorder.stream.getAudioTracks().forEach((s) => s.stop());
    }
  };

  const toggleMute = () => {
    setState((s) => ({
      ...state,
      isMuted: !s.isMuted,
    }));
  };

  return {
    isRecording,
    isMuted,
    toggleMute,
    startAt,
    endAt,
    startRecording,
    stopRecording,
    blob,
  };
};
