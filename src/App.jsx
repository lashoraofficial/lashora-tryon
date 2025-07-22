import React, { useEffect, useRef, useState } from "react";
import * as cam from "@mediapipe/camera_utils";
import { FaceMesh } from "@mediapipe/face_mesh";
import { drawConnectors } from "@mediapipe/drawing_utils";

export default function LashoraTryOn() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedStyle, setSelectedStyle] = useState("CL01"); // default lash style

  const productHandles = {
    "Velvet Layer": "velvet-layer",
    "Halo Flare": "halo-flare",
    "Silken Blend": "silken-blend",
    "Muse Flick": "muse-flick",
    "Sculpted Crush": "sculpted-crush",
    "Bare Muse": "bare-muse",
    "Dream Frame": "dream-frame",
    "Luna Line": "luna-line",
    "Rose Beam": "rose-beam",
    "Foxy Tsundere": "foxy-tsundere",
    "Bunny Blink": "bunny-blink",
    "Puppy Glaze": "puppy-glaze",
  };

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
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
        lashImage.src = `/lashes/${selectedStyle}.png`;
        lashImage.onload = () => {
          const eyeWidth = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y) * canvasElement.width;
          const centerX = (leftEye.x + rightEye.x) / 2 * canvasElement.width;
          const centerY = (leftEye.y + rightEye.y) / 2 * canvasElement.height;

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

  const lashStyles = [
    "Velvet Layer",
    "Halo Flare",
    "Silken Blend",
    "Muse Flick",
    "Sculpted Crush",
    "Bare Muse",
    "Dream Frame",
    "Luna Line",
    "Rose Beam",
    "Foxy Tsundere",
    "Bunny Blink",
    "Puppy Glaze",
  ];

  const handleAddToBag = () => {
    const productHandle = productHandles[selectedStyle];
    if (productHandle) {
      fetch(`/cart/add.js`, {
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
    <div className="relative w-full max-w-5xl mx-auto px-4">
      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
        <video ref={videoRef} className="absolute top-0 left-0 w-full h-full object-cover" autoPlay muted playsInline />
        <canvas ref={canvasRef} width={640} height={480} className="absolute top-0 left-0 z-10" />
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        {lashStyles.map((name) => (
          <button
            key={name}
            onClick={() => setSelectedStyle(name)}
            className={`px-4 py-2 text-sm rounded-full border transition ${
              selectedStyle === name ? "bg-black text-white" : "bg-white hover:bg-neutral-100"
            }`}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="mt-6 text-center">
        <p className="text-base font-medium">Selected Style: <strong>{selectedStyle}</strong></p>
        <button
          onClick={handleAddToBag}
          className="mt-3 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800"
        >
          Add to Bag
        </button>
      </div>
    </div>
  );
}
