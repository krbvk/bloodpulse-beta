import { Box } from '@mantine/core';
import '@/components/Loader/CustomLoader.css';

const CustomLoader = () => {
  return (
    <Box id="loader">
      <div className="loading-element">
        <div className="loading-element-wrapper">
          <div className="loading-element-img"></div>
        </div>
      </div>
    </Box>
  );
};

export default CustomLoader;
