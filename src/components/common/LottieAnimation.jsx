import { useEffect, useRef } from 'react';
import Lottie from 'lottie-react';

const LottieAnimation = ({ animationPath, loop = true, autoplay = true, style }) => {
  const lottieRef = useRef();

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationPath}
      loop={loop}
      autoplay={autoplay}
      style={style}
    />
  );
};

export default LottieAnimation;
