import { useState, useEffect, useCallback } from 'react';


export default () => {

  const [windowHeight, setWindowHeight] = useState(0);

  const handleResize = useCallback(() => {
    setWindowHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    }
  }, []);

  return windowHeight;
};
