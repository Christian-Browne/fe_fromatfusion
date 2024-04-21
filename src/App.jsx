import { useState, useEffect } from 'react';
import { Add, Upload, VideoFile } from '@mui/icons-material';
import {
  Box,
  Button,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import './App.css';
import useFileUpload from './Services';

function App() {
  const [files, setFiles] = useState([]);
  const [audio, setAudio] = useState([]);
  const [effect, setEffect] = useState('None');
  const [isUploading, setIsUploading] = useState(false); // New state for tracking upload status

  const { mutate: uploadFiles, isPending, isSuccess } = useFileUpload();

  useEffect(() => {
    if (isPending) {
      setIsUploading(true);
    }
  }, [isPending]);

  useEffect(() => {
    if (isSuccess) {
      setIsUploading(false);
    }
  }, [isSuccess]);

  const handleEffectChange = (event) => {
    setEffect(event.target.value);
  };

  const handleFileChange = (event) => {
    const filesWithProgress = Array.from(event.target.files).map((file) => ({
      file,
      progress: 0,
      interval: Math.random() * 3000 + 1000,
    }));
    setFiles(filesWithProgress);
  };

  const handleAudioChange = (event) => {
    const audioWithProgress = Array.from(event.target.files).map((file) => ({
      file,
      progress: 0,
      interval: Math.random() * 3000 + 1000,
    }));
    setAudio(audioWithProgress);
  };

  const handleUpload = () => {
    if (files.length === 0) {
      console.error('No files or audio to upload');
      return;
    }

    const formData = new FormData();
    files.forEach(({ file }) => {
      formData.append('clips', file);
    });

    if (audio.length > 0) {
      formData.append('audio', audio[0].file);
    }

    if (effect !== 'None') {
      formData.append('effect', effect);
    }

    uploadFiles(formData); // Ensure this call is awaited
  };

  return (
    <>
      <Typography variant="h1" component="h2" fontWeight="bold" sx={{ mb: 4 }}>
        FormatFusion
      </Typography>
      <Typography variant="h3" component="h2" fontWeight="bold">
        Create Custom Video
      </Typography>
      <Typography variant="body1">
        Upload your clips and create a custom video.
      </Typography>
      {isUploading && <LinearProgress sx={{ height: 20 }} />}
      {!isUploading && (
        <>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="center"
            gap={2}
          >
            <div>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: 'none' }}
                id="file-upload"
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Upload />}
                  component="span"
                  sx={{ mt: 2 }}
                >
                  Upload Clips
                </Button>
              </label>
            </div>

            <div>
              <input
                type="file"
                multiple
                onChange={handleAudioChange}
                style={{ display: 'none' }}
                id="audio-upload"
              />
              <label htmlFor="audio-upload">
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<Upload />}
                  component="span"
                  sx={{ mt: 2 }}
                >
                  Upload Audio
                </Button>
              </label>
            </div>

            <div>
              <InputLabel id="demo-simple-select-label">Effect</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={effect}
                label="Effect"
                onChange={handleEffectChange}
                size="small"
              >
                <MenuItem value={'None'}>None</MenuItem>
                <MenuItem value={'black_and_white'}>Black And White</MenuItem>
                <MenuItem value={'slow_motion'}>Slow Motion</MenuItem>
                <MenuItem value={'painting'}>Painting</MenuItem>
                <MenuItem value={'inverted'}>Inverted</MenuItem>
              </Select>
            </div>
          </Stack>
          <>
            {files.length > 0 && (
              <>
                <Stack
                  direction="row"
                  alignItems="flex-start"
                  justifyContent="space-between"
                  spacing={4}
                  sx={{ mt: 2 }}
                >
                  <div>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Videos
                    </Typography>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      {files.map((file, index) => (
                        <FileDisplay
                          key={index}
                          file={file.file}
                          interval={file.interval}
                        />
                      ))}
                    </Stack>
                  </div>
                  <div>
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      Audio
                    </Typography>
                    <Stack spacing={2} sx={{ mt: 2 }}>
                      {audio.map((file, index) => (
                        <FileDisplay
                          key={index}
                          file={file.file}
                          interval={file.interval}
                        />
                      ))}
                    </Stack>
                  </div>
                </Stack>

                <Button
                  variant="contained"
                  color="success"
                  startIcon={<Add />}
                  component="span"
                  sx={{ mt: 2 }}
                  onClick={handleUpload}
                >
                  Create Video
                </Button>
              </>
            )}
          </>
        </>
      )}
    </>
  );
}

export default App;

function FileDisplay({ file, interval }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        const newProgress = Math.min(oldProgress + 10, 100);
        return newProgress;
      });
    }, interval / 100); // Adjust the progress increment to be more frequent

    return () => {
      clearInterval(timer);
    };
  }, [interval]);

  return (
    <Paper square={false} elevation={6}>
      <Box p={2}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <VideoFile fontSize="large" sx={{ color: 'darkgray' }} />
          <Typography variant="body1">{`File: ${file.name}`}</Typography>
        </div>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 8, borderRadius: 5, mt: 1 }}
        />
      </Box>
    </Paper>
  );
}
