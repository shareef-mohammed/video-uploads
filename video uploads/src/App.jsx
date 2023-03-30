import React, { useRef, useState } from 'react';
import AWS from 'aws-sdk';


const s3 = new AWS.S3({
  accessKeyId: import.meta.env.VITE_ACCESS_KEY_ID,
  secretAccessKey: import.meta.env.VITE_SECRET_ACCESS_KEY,
  region: import.meta.env.VITE_REGION,
});

const UploadVideo = () => {
  const [video, setVideo] = useState(null);
  const [progress, setProgress] = useState(0);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file.type === 'video/mp4') {
      setVideo(file);
    } else {
      alert('Please select a video file with the .mp4 format only.');
    }
  };

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (file.type === 'video/mp4') {
      setVideo(file);
    } else {
      alert('Please select a video file with the .mp4 format only.');
    }
  };

  const handleUpload = () => {
    if (!video) {
      alert('Please select a video file to upload.');
      return;
    }

    const params = {
      Bucket: import.meta.env.VITE_BUCKET_NAME,
      Key: video.name,
      Body: video,
      ACL: 'public-read',
    };
    s3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
      } else {
        console.log(data);
      }
    }).on('httpUploadProgress', (evt) => {
      const uploadedBytes = evt.loaded;
      const totalBytes = evt.total;
      const percentage = Math.round((uploadedBytes / totalBytes) * 100);
      setProgress(percentage);
    });
  };


    const fileInputRef = useRef(null);
    const handleDivClick = () => {
      fileInputRef.current.click();
    };

  return (
    <div className='w-full h-screen flex justify-center items-center bg-blue-500' >
      <div className='w-[70%] h-[80%] bg-white rounded-lg text-center'>
        <p className='text-lg mt-16 mb-4 font-semibold'>Upload your video</p>
        <div className={!video ? 'mx-auto border-2 border-dashed rounded-xl w-[80%] h-[50%] flex items-center justify-center': 'mx-auto rounded-xl w-[80%] h-[50%] '} onDrop={handleDrop} onDragOver={(e) => e.preventDefault()} onClick={handleDivClick} >
          <input ref={fileInputRef} className='w-full h-full hidden' type="file" accept="video/mp4" onChange={handleSelect} />
          {video ? (
            <video className='mx-auto h-full w-[50%] shadow-2xl' src={URL.createObjectURL(video)}  controls />
          ) : (
            <div>
              <p className='mx-auto '>Drag and drop a video file or select a video file with the .mp4 format only.</p>
              <p className='mx-auto font-semibold py-2'>OR</p>
              <p className='mx-auto '>Click here to upload a video.</p>
            </div>
          )}
        </div>
        {progress > 0 && <>
          <progress className='mt-4 w-[80%] h-3' value={progress} max="100" />
          <p className='text-sm'>{progress}%</p>
        </>} <br/>
        <button className='py-1 text-white rounded-lg cursor-pointer px-5 bg-blue-500 ' onClick={handleUpload}>Upload</button>
      </div>
    </div>
  );
};

export default UploadVideo;