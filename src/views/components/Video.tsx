import React, { memo, useEffect, useRef } from "react";

type Props = {
  blob: Blob | null;
};

const Video = memo(({ blob }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (!blob) {
      videoRef.current?.load();
    }
  }, [blob]);

  return (
    <div className="flex w-full items-center justify-center ">
      <video
        ref={videoRef}
        src={blob ? URL.createObjectURL(blob) : undefined}
        autoPlay
        controls
        width="1248"
        height="768"
        style={{ borderRadius: 15, objectFit: "cover" }}
      />
    </div>
  );
});

export default Video;