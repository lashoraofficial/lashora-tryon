import { useState } from 'react';
import './index.css';

function App() {
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [uploadedImage, setUploadedImage] = useState(null);

  const styles = [
    'B01 – Luna Line',
    'D02 – Bunny Blink',
    'D03 – Puppy Glaze',
    'CL01 – Velvet Layer',
    'CL03 – Halo Flare',
    'CL09 – Silken Blend',
    'CL19 – Muse Flick',
    'CL20 – Sculpted Crush',
    'CL21 – Bare Muse',
    'CL24 – Dream Frame',
    'B05 – Rose Beam',
    'D01 – Foxy Tsundere',
    'C04 – Starlight'
  ];

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => setUploadedImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="lash-tryon-app" style={{ padding: '20px', textAlign: 'center' }}>
      <h1>Lashora Virtual Try-On</h1>

      <input type="file" accept="image/*" onChange={handleImageUpload} />
      
      {uploadedImage && (
        <div className="preview-section" style={{ marginTop: '20px' }}>
          <img
            src={uploadedImage}
            alt="Uploaded Face"
            style={{ width: '300px', borderRadius: '8px' }}
          />
          {selectedStyle && (
            <p style={{ marginTop: '10px', fontWeight: 'bold' }}>
              Selected Style: {selectedStyle}
            </p>
          )}
        </div>
      )}

      <div className="style-selector" style={{ marginTop: '30px' }}>
        <h2>Select a Lash Style</h2>
        <div className="style-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center' }}>
          {styles.map((style) => (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              style={{
                padding: '10px 14px',
                borderRadius: '5px',
                border: selectedStyle === style ? '2px solid #d4af37' : '1px solid #ccc',
                backgroundColor: selectedStyle === style ? '#fef6e4' : '#fff',
                cursor: 'pointer',
                minWidth: '140px'
              }}
            >
              {style}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
