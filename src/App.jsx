import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

const ffmpeg = createFFmpeg({ log: true });
function App() {

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [exporting,setExporting]=useState(false);

  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  }

  const convertToGif = async () => {
    setExporting(true);
    // put the video into WASM in-memory File System
    ffmpeg.FS('writeFile', 'video.mp4', await fetchFile(video));

    // Run the command
    await ffmpeg.run('-i', 'video.mp4', '-ss', '2.0', '-f', 'gif', 'output.gif');

    const data = ffmpeg.FS('readFile', 'output.gif');

    const url = URL.createObjectURL(new Blob([data.buffer], { type: 'image/gif' }));
    setGif(url);
    setExporting(false);
  }

  useEffect(() => {
    load();
  });


  // Return the App component.
  return ready ? (
    <div className="App">
      <h1>Video To Gif</h1>
      <p class="line-1 anim-typewriter">Select a video to convert</p>
      <div>
        <input type="file" onChange={(e) => setVideo(e.target.files?.item(0))} />
      </div>
      {video && <video
        controls
        width="500"
        src={URL.createObjectURL(video)}>
      </video>}

      <div className="video-export">
        {video && <button onClick={convertToGif}>Export</button>}
        {exporting && <p>Exporting...</p>}
      </div>

      {gif && 
      <div>
        <h3>Exported Gif</h3>
        <img src={gif} width="500" />
      </div>}
    </div>
  ) : <p>Loading...</p>;
}

export default App;
