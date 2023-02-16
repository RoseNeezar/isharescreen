import dayjs from "dayjs";
import { useEffect, useMemo, useReducer } from "react";
import { env } from "../env/client.mjs";

export const MAX_RECORDING_DURATION_IN_MINUTE = parseInt(
  env.NEXT_PUBLIC_MAX_RECORDING_DURATION_IN_MINUTE,
  10
);

type State = {
  isRecording: boolean;
  isMuted: boolean;
  recorder: MediaRecorder | null;
  blob: Blob | null;
  startAt: Date | null;
};

const recordReducer = (state: State, action: Partial<State>) => ({
  ...state,
  ...action,
});
export const useRecording = () => {
  const [state, setState] = useReducer(recordReducer, {
    isRecording: false,
    isMuted: true,
    recorder: null,
    blob: null,
    startAt: null,
  });

  const { blob, isMuted, isRecording, recorder, startAt } = state;

  let stream: MediaStream;

  const endAt = useMemo(
    () =>
      startAt
        ? dayjs(startAt)
            .add(MAX_RECORDING_DURATION_IN_MINUTE, "minute")
            .toDate()
        : null,
    [startAt]
  );

  const startRecording = async () => {
    setState({ blob: null });
    const videoStream = await navigator.mediaDevices.getDisplayMedia({
      video: { mediaSource: "screen" } as MediaTrackConstraints,
    });

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

    setState({
      isRecording: true,
      recorder: recorder,
      startAt: new Date(),
    });
  };

  const stopRecording = () => {
    if (!recorder) return;

    setState({
      isRecording: false,
      startAt: null,
    });

    recorder.ondataavailable = (e) => {
      const blob = new Blob([e.data], { type: e.data.type });
      setState({
        blob,
      });
    };

    if (recorder.state === "recording") {
      recorder.stop();
    }

    if (stream) {
      stream.getVideoTracks().forEach((s) => s.stop());
      stream.getAudioTracks().forEach((s) => s.stop());
    }
  };

  const stopSharing = () => {
    if (recorder && recorder.state === "recording") {
      recorder.ondataavailable = (e) => {
        const blob = new Blob([e.data], { type: e.data.type });
        setState({ blob });
      };
      recorder.stop();
    }

    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop();
      });
    }

    setState({
      isRecording: false,
      startAt: null,
    });
  };

  const toggleMute = () => {
    setState({
      isMuted: !isMuted,
    });
  };

  useEffect(() => {
    if (recorder && recorder.stream) {
      recorder.stream
        .getVideoTracks()[0]
        ?.addEventListener("ended", stopSharing);
    }
    return () => {
      if (recorder && recorder.stream) {
        recorder.stream
          .getVideoTracks()[0]
          ?.removeEventListener("ended", stopSharing);
      }
    };
  }, [recorder, stopSharing]);

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
