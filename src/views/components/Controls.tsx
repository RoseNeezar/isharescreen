import { DialogClose } from "@radix-ui/react-dialog";
import { Mic, MicOff, Pause, Play } from "lucide-react";
import { FC, useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogTrigger,
} from "../../components/AlertDialog";
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
import Timer from "./Timer";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import { useSetState } from "react-use";

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
      <DialogContent className="bg-base-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-primary ">Download clip</DialogTitle>
          <DialogDescription>Enter name of the file</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="name"
              className="text-right font-bold text-primary "
            >
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

const RecordVideoModal: FC<
  Pick<
    Props,
    "isRecording" | "startRecording" | "stopRecording" | "endAt" | "startAt"
  >
> = ({ isRecording, startRecording, stopRecording, endAt, startAt }) => {
  return (
    <AlertDialog
      open={isRecording}
      onOpenChange={(e) => {
        if (e === false) {
          stopRecording();
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <button
          className="btn-secondary btn-circle btn text-base-content"
          onClick={startRecording}
        >
          <Play />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent className="flex  h-1/2 max-w-fit flex-col   justify-center bg-transparent p-0">
        {startAt && (
          <Timer
            endAt={endAt}
            startAt={startAt}
            stopRecording={stopRecording}
          />
        )}
        <div className="tooltip mt-20" data-tip="Stop recording">
          <AlertDialogAction
            className="h-32 w-32 rounded-full bg-secondary text-base-content hover:bg-secondary-focus"
            onClick={stopRecording}
          >
            <Pause className="h-16  w-16 text-3xl" />
          </AlertDialogAction>{" "}
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

interface State {
  run: boolean;
  steps: Step[];
}

const Controls = ({
  isRecording,
  stopRecording,
  blob,
  isMuted,
  startRecording,
  toggleMute,
  endAt,
  startAt,
}: Props) => {
  const [{ run, steps }, setState] = useSetState<State>({
    run: false,
    steps: [
      {
        content: (
          <div className="text-lg font-bold text-base-content">
            Download Your Recording Here!
          </div>
        ),
        disableBeacon: true,
        hideFooter: true,
        placement: "left",
        styles: {
          options: {
            zIndex: 10000,
            backgroundColor: "rgb(255,20,147)",
            arrowColor: "rgb(255,20,147)",
          },
        },
        target: ".download-video",
      },
    ],
  });

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setState({ run: false });
    }
  };

  useEffect(() => {
    if (blob) {
      setState({
        run: true,
      });
    }
  }, [blob]);

  return (
    <>
      <Joyride
        callback={handleJoyrideCallback}
        continuous
        hideCloseButton
        run={run}
        scrollToFirstStep
        showProgress
        showSkipButton
        steps={steps}
        styles={{
          options: {
            zIndex: 10000,
          },
        }}
      />
      <div className="text-2xl font-bold text-secondary">Controls</div>
      <div className="flex flex-col items-center">
        <div className="download-video my-5 flex w-full items-center">
          <DownloadButton blob={blob} />
        </div>

        <div className="my-5 flex w-full items-center">
          <div className="w-20 text-lg text-base-content">Audio</div>
          {isMuted ? (
            <button
              className={`${
                isRecording ? "btn-disabled" : ""
              } btn-primary btn-circle btn`}
              onClick={toggleMute}
              disabled={isRecording}
            >
              <MicOff className="text-base-content" />
            </button>
          ) : (
            <button
              className={`${
                isRecording ? "btn-disabled" : ""
              } btn-primary btn-circle btn`}
              onClick={toggleMute}
              disabled={isRecording}
            >
              <Mic className="text-base-content" />
            </button>
          )}
        </div>
        <div className="my-5 flex w-full items-center">
          <div className="w-20 text-lg text-base-content">Record</div>
          <RecordVideoModal
            endAt={endAt}
            startAt={startAt}
            isRecording={isRecording}
            startRecording={startRecording}
            stopRecording={stopRecording}
          />
        </div>
      </div>
    </>
  );
};

export default Controls;
