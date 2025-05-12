import { Box } from '@mantine/core';
import '@/components/Loader/CustomLoader.css';

const CustomLoader = () => {
  return (
    <Box id="loader">
      <div className="loading-container">
        <div className="blood"></div>
        <div className="blood"></div>
        <div className="blood"></div>
      </div>
    </Box>
  );
};

export default CustomLoader;
