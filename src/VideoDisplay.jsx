import { useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link'; // Import Link component for styling purposes
import { Stack } from '@mui/material';

function VideoDisplay() {
  const location = useLocation();
  const { videoUrl } = location.state || {};

  const handleDownload = async () => {
    if (!videoUrl) {
      console.error('No video URL provided.');
      return;
    }

    try {
      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error('Network response was not ok');
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', 'custom_fromatfusion.mp4'); // or any other extension
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl); // Clean up
    } catch (err) {
      console.error('Failed to download the video:', err);
    }
  };

  if (!videoUrl) return <div>No video found.</div>;

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        gap={2}
        sx={{ mb: 2 }}
      >
        <Button variant="contained" color="primary" onClick={handleDownload}>
          Download Video
        </Button>
      </Stack>

      <video
        src={videoUrl}
        controls
        width="80%"
        style={{ maxWidth: '100%' }}
      ></video>
      <br />
    </div>
  );
}

export default VideoDisplay;
