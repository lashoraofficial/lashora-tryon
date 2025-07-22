import React, { useEffect, useRef, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import { FaceMesh } from "@mediapipe/face_mesh";

export default function LashoraTryOn() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedStyle, setSelectedStyle] = useState("Luna Line");

  const lashStyles = [
    "Luna Line",
    "Bunny Blink",
    "Puppy Glaze",
    "Velvet Layer",
    "Halo Flare",
    "Silken Blend",
    "Muse Flick",
    "Sculpted Crush",
    "Bare Muse",
    "Dream Frame",
    "Rose Beam",
    "Foxy Tsundere",
    "Starlight"
  ];

  const productHandles = {
    "Luna Line": "luna-line",
    "Bunny Blink": "bunny-blink",
    "Puppy Glaze": "puppy-glaze",
    "Velvet Layer": "velvet-layer",
    "Halo Flare": "halo-flare",
    "Silken Blend": "silken-blend",
    "Muse Flick": "muse-flick",
    "Sculpted Crush": "sculpted-crush",
    "Bare Muse": "bare-muse",
    "Dream Frame": "dream-frame",
    "Rose Beam": "rose-beam",
    "Foxy Tsundere": "foxy-tsundere",
    "Starlight": "starlight"
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    const faceMesh = new FaceMesh({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    faceMesh.onResults((results) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];

        const leftEye = landmarks[33];
        const rightEye = landmarks[263];

        const lashImage = new Image();
        lashImage.src = `/lashes/${selectedStyle}.png`; // will fail silently until PNGs are added
        lashImage.onload = () => {
          const eyeWidth =
            Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y) *
            canvasElement.width;
          const centerX = ((leftEye.x + rightEye.x) / 2) * canvasElement.width;
          const centerY = ((leftEye.y + rightEye.y) / 2) * canvasElement.height;

          canvasCtx.drawImage(
            lashImage,
            centerX - eyeWidth / 1.6,
            centerY - eyeWidth / 3,
            eyeWidth * 1.3,
            eyeWidth * 0.9
          );
        };
      }
      canvasCtx.restore();
    });

    const camera = new cam.Camera(videoElement, {
      onFrame: async () => {
        await faceMesh.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });
    camera.start();
  }, [selectedStyle]);

  const handleAddToBag = () => {
    const productHandle = productHandles[selectedStyle];
    if (productHandle && window.LASHORA_VARIANT_IDS) {
      fetch("/cart/add.js", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          items: [
            {
              id: window.LASHORA_VARIANT_IDS[productHandle],
              quantity: 1,
            },
          ],
        }),
      })
        .then((res) => res.json())
        .then(() => alert("Added to bag!"))
        .catch(() => alert("Error adding to cart"));
    }
  };

  return (
    <div className="flex flex-col lg:flex-row max-w-screen-xl mx-auto px-4 py-8 gap-8">
      {/* LEFT: Camera with canvas overlay */}
      <div className="relative w-full max-w-lg aspect-video rounded-xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          className="absolute top-0 left-0 z-10"
        />
      </div>

      {/* RIGHT: Lash selector */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center">VIRTUAL TRY-ON</h2>

        <div className="grid grid-cols-3 gap-3">
          {lashStyles.map((style) => (
            <div
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`cursor-pointer rounded-lg border-2 p-2 text-center transition-all ${
                selectedStyle === style
                  ? "border-black bg-gray-100 font-bold"
                  : "border-gray-300"
              }`}
            >
              <img
                src="/dummy-lash-thumbnail.png"
                alt={style}
                className="mx-auto w-full h-20 object-contain mb-1"
              />
              <span className="text-sm">{style}</span>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="mt-2 text-lg font-medium">
            Style: <span className="font-bold">{selectedStyle}</span>
          </p>
          <button
            onClick={handleAddToBag}
            className="mt-4 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
          >
            Add Lash Map to Bag
          </button>
        </div>
      </div>
    </div>
  );
}
