import { Player } from '@lottiefiles/react-lottie-player';

const LottiePlayer = ({ src, loop = true, autoplay = true, style }) => {
  return (
    <Player
      autoplay={autoplay}
      loop={loop}
      src={src}
      style={style}
    />
  );
};

export default LottiePlayer;
