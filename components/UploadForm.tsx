import axios, { AxiosResponse, AxiosError } from 'axios';
import { useState, Dispatch, SetStateAction } from 'react';

interface UploadFormProps {
  setResponse: Dispatch<SetStateAction<string>>;
}

const UploadForm: React.FC<UploadFormProps> = ({ setResponse }) => {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedFiles) return;
    setLoading(true);

    try {
      const res: AxiosResponse<string> = await axios.post(
        process.env.BACKEND_UPLOAD_URL as string,
        {
          files: selectedFiles,
        },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setResponse(res.data);
    } catch (error: unknown) {
      console.error('Upload failed:', error);
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        console.error('Axios error:', axiosError.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full max-w-lg mx-auto">
      <input
        type="file"
        onChange={handleFileChange}
        multiple
        accept=".heic,.jpg,.jpeg,.png"
        className="block w-full mb-4 text-sm text-gray-300
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-600 file:text-white
          file:cursor-pointer
          hover:file:bg-blue-700
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
      />
      <button
        type="submit"
        disabled={!selectedFiles || loading}
        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 
          text-white font-medium rounded-lg
          hover:from-blue-700 hover:to-blue-800
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-all duration-200"
      >
        {loading ? 'Analyzing...' : 'Analyze Receipt'}
      </button>
    </form>
  );
};

export default UploadForm;
