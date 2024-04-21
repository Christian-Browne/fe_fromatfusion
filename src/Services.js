import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function useFileUpload() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (formData) => {
      const response = await axios.post(
        'https://beformatfusion-production.up.railway.app/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    },
    onError: (error) => {
      console.error('Error uploading files:', error);
    },
    onSuccess: (data) => {
      console.log('Upload successful:', data);
      // Redirect on success with video URL
      navigate('/video', { state: { videoUrl: data.upload } });
    },
  });
}
