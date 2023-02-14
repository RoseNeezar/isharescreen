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
    <div className="aspect-w-16 aspect-h-9 flex w-full items-center justify-center">
      <video
        ref={videoRef}
        src={blob ? URL.createObjectURL(blob) : undefined}
        controls
        style={{ borderRadius: 15, objectFit: "cover" }}
      />
    </div>
  );
});
Video.displayName = "Video";

export default Video;
