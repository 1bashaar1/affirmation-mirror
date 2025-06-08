import React, { useState, useRef } from 'react';

const Recorder = ({ onUpdate }) => {
  const [audioURL, setAudioURL] = useState('');
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        setAudioURL(URL.createObjectURL(audioBlob));
        setLoading(true);

        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.webm');

        try {
          const response = await fetch('http://localhost:5000/api/affirmation', {
            method: 'POST',
            body: formData,
          });

          const data = await response.json();
          setResult(data.affirmations);
          onUpdate && onUpdate(data); // Update parent if provided
        } catch (err) {
          console.error('Failed to fetch affirmations:', err);
        } finally {
          setLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);

      setTimeout(() => {
        mediaRecorderRef.current.stop();
        setRecording(false);
      }, 5000); // 5 seconds max recording
    } catch (error) {
      console.error('Microphone access denied or error:', error);
    }
  };

  return (
    <div className="recorder-container space-y-4">
      <button
        onClick={startRecording}
        disabled={recording}
        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        {recording ? 'Recording...' : 'Start Recording'}
      </button>

      {audioURL && (
        <audio className="mt-2" controls src={audioURL}>
          Your browser does not support the audio element.
        </audio>
      )}

      {loading && <p className="text-gray-500">Processing your thoughts...</p>}

      {result && (
        <div className="mt-4 p-4 bg-indigo-50 border border-indigo-200 rounded">
          <h3 className="text-indigo-700 font-semibold mb-2">Generated Affirmations:</h3>
          <pre className="whitespace-pre-wrap text-gray-800">{result}</pre>
        </div>
      )}
    </div>
  );
};

export default Recorder;
