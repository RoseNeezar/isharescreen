import { DialogClose } from "@radix-ui/react-dialog";
import { Mic, MicOff, Pause, Play } from "lucide-react";
import { FC, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/Dialog";
import { Input } from "../../components/Input";
import { Label } from "../../components/Label";

type Props = {
  isRecording: boolean;
  startAt: Date | null;
  endAt: Date | null;
  toggleMute: () => void;
  stopRecording: () => void;
  startRecording: () => Promise<void>;
  blob: Blob | null;
  isMuted: boolean;
};

const DownloadButton: FC<{ blob: Pick<Props, "blob">["blob"] }> = ({
  blob,
}) => {
  const [name, setName] = useState("myvideo");
  return (
    <Dialog>
      {blob ? (
        <DialogTrigger asChild>
          <button className={`btn-primary btn`}>Download clip</button>
        </DialogTrigger>
      ) : (
        <button className={`btn-disabled btn-primary btn`} disabled={true}>
          Download clip
        </button>
      )}
      <DialogContent className="bg-slate-800 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary">Download clip</DialogTitle>
          <DialogDescription>Enter name of the file</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <a
              className="btn-primary btn"
              href={blob ? URL.createObjectURL(blob) : undefined}
              download={`${name}.webm`}
            >
              Download
            </a>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const Controls = ({
  isRecording,
  stopRecording,
  blob,
  isMuted,
  startRecording,
  toggleMute,
}: Props) => {
  return (
    <>
      <div className="text-2xl font-bold text-secondary">Controls</div>
      <div className="flex flex-col items-center">
        <div className="my-5 flex w-full items-center">
          <DownloadButton blob={blob} />
        </div>

        <div className="my-5 flex w-full items-center">
          <div className="w-20 text-lg text-white">Audio</div>
          {isMuted ? (
            <button
              className={`${
                isRecording ? "btn-disabled" : ""
              } btn-primary btn-circle btn`}
              onClick={toggleMute}
              disabled={isRecording}
            >
              <MicOff className="text-white" />
            </button>
          ) : (
            <button
              className={`${
                isRecording ? "btn-disabled" : ""
              } btn-primary btn-circle btn`}
              onClick={toggleMute}
              disabled={isRecording}
            >
              <Mic className="text-white" />
            </button>
          )}
        </div>
        <div className="my-5 flex w-full items-center">
          <div className="w-20 text-lg text-white">Record</div>
          {isRecording ? (
            <button
              className="btn-secondary btn-circle btn text-white"
              onClick={stopRecording}
            >
              <Pause />
            </button>
          ) : (
            <button
              className="btn-secondary btn-circle btn text-white"
              onClick={startRecording}
            >
              <Play />
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Controls;
