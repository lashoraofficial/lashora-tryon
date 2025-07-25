import React, { useRef, useEffect, useState } from 'react';
import * as cam from '@mediapipe/camera_utils';
import { FaceMesh } from '@mediapipe/face_mesh';

export default function LashoraTryOn() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [selectedStyle, setSelectedStyle] = useState('Bunny Blink');

  // 12 styles from your folders
  const lashStyles = [
    { name: 'Bunny Blink', lengths: '10-10-12-14-12-10mm', leftPNG: '/lashes/bunny-blink-left.png', rightPNG: '/lashes/bunny-blink-right.png' },
    { name: 'Puppy Glaze', lengths: '10-10-12-12-14-12mm', leftPNG: '/lashes/puppy-glaze-left.png', rightPNG: '/lashes/puppy-glaze-right.png' },
    { name: 'Velvet Layer', lengths: '12-12-14-14-12-10mm', leftPNG: '/lashes/velvet-layer-left.png', rightPNG: '/lashes/velvet-layer-right.png' },
    { name: 'Halo Flare', lengths: '10-12-12-14-14-12mm', leftPNG: '/lashes/halo-flare-left.png', rightPNG: '/lashes/halo-flare-right.png' },
    { name: 'Silken Blend', lengths: '12-12-14-14-12-10mm', leftPNG: '/lashes/silken-blend-left.png', rightPNG: '/lashes/silken-blend-right.png' },
    { name: 'Muse Flick', lengths: '10-12-12-14-14-12mm', leftPNG: '/lashes/muse-flick-left.png', rightPNG: '/lashes/muse-flick-right.png' },
    { name: 'Sculpted Crush', lengths: '12-12-14-14-12-10mm', leftPNG: '/lashes/sculpted-crush-left.png', rightPNG: '/lashes/sculpted-crush-right.png' },
    { name: 'Bare Muse', lengths: '10-12-12-14-14-12mm', leftPNG: '/lashes/bare-muse-left.png', rightPNG: '/lashes/bare-muse-right.png' },
    { name: 'Dream Frame', lengths: '12-12-14-14-12-10mm', leftPNG: '/lashes/dream-frame-left.png', rightPNG: '/lashes/dream-frame-right.png' },
    { name: 'Luna Line', lengths: '10-12-12-14-14-12mm', leftPNG: '/lashes/luna-line-left.png', rightPNG: '/lashes/luna-line-right.png' },
    { name: 'Rose Beam', lengths: '12-12-14-14-12-10mm', leftPNG: '/lashes/rose-beam-left.png', rightPNG: '/lashes/rose-beam-right.png' },
    { 
      name: 'Foxy Tsundere', 
      lengths: '10-12-12-14-14-12mm', 
      leftPNG: 'https://cdn.shopify.com/s/files/.../Left.png', 
      rightPNG: 'https://cdn.shopify.com/s/files/.../Right.png' 
    }
  ];

  const selected = lashStyles.find((s) => s.name === selectedStyle);

  useEffect(() => {
    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
    });

    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    faceMesh.onResults(onResults);

    const camera = new cam.Camera(videoRef.current, {
      onFrame: async () => {
        await faceMesh.send({ image: videoRef.current });
      },
      width: 640,
      height: 480
    });

    camera.start();
  }, [selected]);

  const onResults = (results) => {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext('2d');
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
      const keypoints = results.multiFaceLandmarks[0];

      // Left eye (33 inner, 133 outer)
      const leftInner = keypoints[33];
      const leftOuter = keypoints[133];
      const leftMid = {
        x: (leftInner.x + leftOuter.x) / 2,
        y: (leftInner.y + leftOuter.y) / 2
      };
      const leftDx = (leftOuter.x - leftInner.x) * canvasElement.width;
      const leftDy = (leftOuter.y - leftInner.y) * canvasElement.height;
      const leftWidth = Math.sqrt(leftDx * leftDx + leftDy * leftDy) * 1.7;
      const leftAngle = Math.atan2(leftDy, leftDx);
      const leftHeight = leftWidth * 0.40;

      // Right eye (263 inner, 362 outer)
      const rightInner = keypoints[263];
      const rightOuter = keypoints[362];
      const rightMid = {
        x: (rightInner.x + rightOuter.x) / 2,
        y: (rightInner.y + rightOuter.y) / 2
      };
      const rightDx = (rightOuter.x - rightInner.x) * canvasElement.width;
      const rightDy = (rightOuter.y - rightInner.y) * canvasElement.height;
      const rightWidth = Math.sqrt(rightDx * rightDx + rightDy * rightDy) * 1.7;
      const rightAngle = Math.atan2(rightDy, rightDx);
      const rightHeight = rightWidth * 0.40;

      // Draw left lash
      const lashLeft = new Image();
      lashLeft.src = selected.leftPNG;
      lashLeft.onload = drawLeftLash;
      if (lashLeft.complete) drawLeftLash();

      function drawLeftLash() {
        canvasCtx.save();
        canvasCtx.translate(leftMid.x * canvasElement.width, leftMid.y * canvasElement.height);
        canvasCtx.rotate(leftAngle);
        canvasCtx.drawImage(
          lashLeft,
          -leftWidth / 2,
          -leftHeight / 2,
          leftWidth,
          leftHeight
        );
        canvasCtx.restore();
      }

      // Draw right lash
      const lashRight = new Image();
      lashRight.src = selected.rightPNG;
      lashRight.onload = drawRightLash;
      if (lashRight.complete) drawRightLash();

      function drawRightLash() {
        canvasCtx.save();
        canvasCtx.translate(rightMid.x * canvasElement.width, rightMid.y * canvasElement.height);
        canvasCtx.rotate(rightAngle);
        canvasCtx.drawImage(
          lashRight,
          -rightWidth / 2,
          -rightHeight / 2,
          rightWidth,
          rightHeight
        );
        canvasCtx.restore();
      }
    }
    canvasCtx.restore();
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100vw',
        minHeight: '100vh',
        background: '#f5ede4',
        fontFamily: 'Playfair Display, serif'
      }}
    >
      <h1 style={{ fontSize: 40, fontWeight: 700, margin: '40px 0 24px 0', color: '#4d3c2d' }}>Virtual Try On</h1>
      {/* Camera frame */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 640,
          height: '60vw', // Responsive height for mobile
          maxHeight: 480,
          background: '#000',
          borderRadius: 16,
          overflow: 'hidden',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          margin: '0 auto 32px auto',
        }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transform: 'scaleX(-1)',
            position: 'absolute',
            left: 0,
            top: 0
          }}
        />
        <canvas
          ref={canvasRef}
          width={640}
          height={480}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            transform: 'scaleX(-1)'
          }}
        />
        {/* Overlay info */}
        <div
          style={{
            position: 'absolute',
            bottom: 24,
            left: 24,
            background: 'rgba(255,255,255,0.85)',
            borderRadius: 12,
            padding: '12px 24px',
            display: 'flex',
            gap: 32,
            alignItems: 'center',
            fontSize: 16,
            boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
          }}
        >
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6d5c4a' }}>Lash Map</div>
            <div style={{ fontWeight: 700 }}>{selectedStyle}</div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6d5c4a' }}>Color</div>
            <div style={{ fontWeight: 700 }}>Black</div>
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#6d5c4a' }}>Length</div>
            <div style={{ fontWeight: 700 }}>Medium</div>
          </div>
        </div>
        {/* Remove this block to delete the overlay */}
        <div
          style={{
            position: 'absolute',
            top: 24,
            left: 24,
            background: 'rgba(0,0,0,0.55)',
            color: '#fff',
            fontWeight: 700,
            fontSize: 16,
            borderRadius: 8,
            padding: '8px 18px',
            zIndex: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)'
          }}
        >
          Lengths Included: {selected.lengths}
        </div>
      </div>

      {/* Selector below camera */}
      <div
        style={{
          width: 640, // reduced from 700 to 640
          background: '#fff',
          borderRadius: 16,
          boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
          padding: '32px 24px',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          marginBottom: 40
        }}
      >
        <h2 style={{ textAlign: 'center', fontSize: 28, fontWeight: 700, color: '#4d3c2d', marginBottom: 8 }}>
          TRY ON STYLE SELECTION
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 2, // closer gap
            marginBottom: 8
          }}
        >
          {[
            "Bunny Blink",
            "Puppy Glaze",
            "Velvet Layer",
            "Halo Flare",
            "Silken Blend",
            "Muse Flick",
            "Sculpted Crush",
            "Bare Muse",
            "Dream Frame",
            "Luna Line",
            "Rose Beam",
            "Foxy Tsundere"
          ].map((styleName) => (
            <button
              key={styleName}
              onClick={() => setSelectedStyle(styleName)}
              style={{
                width: 150, // increased from 120 to 150
                height: 48,
                borderRadius: 10,
                border: selectedStyle === styleName ? '2px solid #bfa06a' : '1px solid #d8c6a3',
                background: selectedStyle === styleName ? '#f7f3ec' : '#fff',
                color: selectedStyle === styleName ? '#4d3c2d' : '#7a6a54',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: selectedStyle === styleName ? '0 2px 12px rgba(191,160,106,0.08)' : 'none',
                fontFamily: 'Playfair Display, serif',
                fontSize: 15,
                letterSpacing: 0.5,
                transition: 'all 0.18s cubic-bezier(.4,0,.2,1)',
                margin: '0 auto'
              }}
            >
              <span style={{
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                width: '100%',
                textAlign: 'center'
              }}>
                {styleName}
              </span>
            </button>
          ))}
        </div>
        <div style={{ textAlign: 'center', color: '#4d3c2d', fontWeight: 600, fontSize: 16 }}>
          Lengths Included: <span style={{ fontWeight: 700 }}>{selected.lengths}</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button
            style={{
              background: '#bfa06a',
              color: '#fff',
              fontWeight: 700,
              fontSize: 18,
              border: 'none',
              borderRadius: 8,
              padding: '12px 32px',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(191,160,106,0.12)',
              fontFamily: 'Playfair Display, serif',
              letterSpacing: 0.5,
              transition: 'background 0.18s cubic-bezier(.4,0,.2,1)'
            }}
            onClick={() => {
              // Add your add-to-cart logic here
              alert(`Added "${selectedStyle}" to cart!`);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
