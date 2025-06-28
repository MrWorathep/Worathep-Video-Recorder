"use client";
import { useState, useEffect } from "react";
import useMediaRecorder from "@wmik/use-media-recorder";
import classNames from "classnames";
import { ToastContainer, toast } from "react-toastify";

const Home: React.FC = () => {
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);

  const { status, startRecording, stopRecording, mediaBlob, error } =
    useMediaRecorder({
      recordScreen: false,
      blobOptions: { type: "video/webm" },
      mediaStreamConstraints: { audio: true, video: true },
    });

  /** ถ้า MediaRecorder ขึ้น NotReadableError (device in use) ให้ Toast แจ้งผู้ใช้ */
  useEffect(() => {
    if (error && error.name === "NotReadableError") {
      toast.error(
        "กล้องหรือไมโครโฟนถูกใช้งานโดยแอปอื่นอยู่ กรุณาปิดก่อนแล้วลองใหม่"
      );
    }
  }, [error]);

  useEffect(() => {
    let currentStream: MediaStream | undefined;

    async function getStream() {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        toast.error("เบราว์เซอร์ของคุณไม่รองรับการใช้งานกล้องและไมโครโฟน");
        return;
      }

      if (typeof window.MediaRecorder === "undefined") {
        toast.error(
          "เบราว์เซอร์ของคุณไม่รองรับการบันทึกวิดีโอ (MediaRecorder API)"
        );
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        setMediaStream(stream);
        currentStream = stream;
      } catch (err) {
        if (err instanceof DOMException && err.name === "NotAllowedError") {
          toast.info(
            "กรุณาอนุญาตเข้าถึงกล้องและไมโครโฟน เพื่อใช้งานฟีเจอร์นี้"
          );
        } else if (
          err instanceof DOMException &&
          err.name === "NotReadableError"
        ) {
          toast.error("กล้อง/ไมค์กำลังถูกใช้งานโดยโปรแกรมอื่น");
        } else {
          console.error(err);
          toast.error("เกิดข้อผิดพลาดไม่ทราบสาเหตุ");
        }
      }
    }

    getStream();

    return () => {
      currentStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  useEffect(() => {
    if (status === "failed") {
      toast.info("กรุณาอนุญาตเข้าถึงกล้องและไมโครโฟน เพื่อใช้งานฟีเจอร์นี้");
    }

    if (video && mediaStream) {
      video.srcObject = mediaStream;
    }
  }, [video, mediaStream, status]);

  const mediaBlobUrl = mediaBlob ? URL.createObjectURL(mediaBlob) : null;

  return (
    <main className="flex flex-col items-center justify-center min-h-screen gap-8 p-8 bg-gradient-to-br from-blue-100 via-pink-100 to-purple-100 text-gray-800">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold">
        Worathep Video Recorder
      </h1>

      <div
        className={classNames("flex text-lg gap-2", {
          "text-blue-500": status === "idle",
          "text-green-500": status === "recording",
          "text-red-500": status === "stopped" || status === "failed",
          "opacity-0": status === "acquiring_media",
        })}
      >
        <p className="text-gray-800">Status:</p>
        <p>{status}</p>
      </div>

      <div className="flex gap-6">
        <button
          onClick={() => startRecording()}
          disabled={status === "recording"}
          className={classNames(
            "px-6 py-3 rounded-lg text-white font-semibold shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed duration-500",
            {
              "bg-blue-600 hover:bg-blue-700": status !== "recording",
              "bg-gray-400 cursor-not-allowed": status === "recording",
            }
          )}
        >
          Start
        </button>
        <button
          onClick={() => stopRecording()}
          disabled={status !== "recording"}
          className={classNames(
            "px-6 py-3 rounded-lg text-white font-semibold shadow-md transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed duration-500",
            {
              "bg-red-500 hover:bg-red-600": status === "recording",
              "bg-gray-400": status !== "recording",
            }
          )}
        >
          Stop
        </button>
      </div>

      {status === "recording" && (
        <div className="flex flex-col items-center mt-8">
          <video
            ref={setVideo}
            autoPlay
            muted
            playsInline
            className="w-full max-w-3xl rounded-lg shadow-md border-2 border-green-500"
          />
        </div>
      )}

      {mediaBlobUrl && status !== "recording" && (
        <div className="flex flex-col items-center mt-8">
          <video
            src={mediaBlobUrl}
            controls
            playsInline
            autoPlay={false}
            className="w-full max-w-3xl rounded-lg shadow-md border-2 border-blue-500"
          />
          <a
            href={mediaBlobUrl}
            download="recording.webm"
            className="mt-4 underline font-medium text-blue-700 hover:text-blue-900"
          >
            Download
          </a>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover={false}
        theme="light"
      />
    </main>
  );
};

export default Home;
