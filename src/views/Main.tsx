import { useRecording } from "../hooks/useRecording";
import Controls from "./components/Controls";
import Timer from "./components/Timer";
import Video from "./components/Video";

const Main = () => {
  const {
    isRecording,
    isMuted,
    toggleMute,
    startAt,
    endAt,
    startRecording,
    stopRecording,
    blob,
  } = useRecording();

  return (
    <div className="min-w-0 flex-1  xl:flex">
      <div className="border-b border-gray-200  xl:w-64 xl:flex-shrink-0 xl:border-b-0 xl:border-r xl:border-gray-200">
        <div className="h-full py-6 pl-4 pr-6 sm:pl-6 lg:pl-8 xl:pl-0">
          <Controls
            blob={blob}
            endAt={endAt}
            isMuted={isMuted}
            isRecording={isRecording}
            startAt={startAt}
            startRecording={startRecording}
            stopRecording={stopRecording}
            toggleMute={toggleMute}
          />
        </div>
      </div>

      <div className=" lg:min-w-0 lg:flex-1">
        <div className="h-full px-4 py-6 sm:px-6 lg:px-8">
          <Video blob={blob} />
        </div>
      </div>
    </div>
  );
};

export default Main;
