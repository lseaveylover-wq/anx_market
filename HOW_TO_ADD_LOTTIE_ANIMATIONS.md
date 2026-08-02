# How to Add Lottie JSON Animations

## Folder Structure Created

```
frontend/
└── src/
    └── assets/
        └── animations/
            ├── logo.json         (Put your logo animation here)
            └── mascot.json       (Put your mascot animation here)
```

## Step 1: Add Your JSON Files

1. Place your animation JSON files in: `src/assets/animations/`
2. Name them:
   - `logo.json` - for the animated logo
   - `mascot.json` - for the mascot animation

## Step 2: How to Use in Components

### Example 1: Logo in Navigation (DynamicIslandNav.jsx)

```jsx
import Lottie from 'lottie-react';
import logoAnimation from '../../assets/animations/logo.json';

// Replace the existing logo with:
<Lottie 
  animationData={logoAnimation}
  loop={true}
  autoplay={true}
  style={{ width: 38, height: 38 }}
/>
```

### Example 2: Mascot in Hero Section (Home.jsx)

```jsx
import Lottie from 'lottie-react';
import mascotAnimation from '../../assets/animations/mascot.json';

// Add to hero section:
<div className="hero-mascot">
  <Lottie 
    animationData={mascotAnimation}
    loop={true}
    autoplay={true}
    style={{ width: 500, height: 500 }}
  />
</div>
```

## Step 3: Lottie Props You Can Use

```jsx
<Lottie 
  animationData={yourAnimation}  // Required: Your JSON file
  loop={true}                    // Loop animation (true/false)
  autoplay={true}                // Auto start (true/false)
  speed={1}                      // Animation speed (0.5 = half, 2 = double)
  direction={1}                  // 1 = forward, -1 = reverse
  style={{ width: 300 }}         // Custom styles
  className="my-animation"       // CSS class
  onComplete={() => {}}          // Callback when animation completes
  onLoopComplete={() => {}}      // Callback on each loop
/>
```

## Step 4: Advanced Controls

### Play/Pause on Hover
```jsx
import { useRef } from 'react';
import Lottie from 'lottie-react';

const MyComponent = () => {
  const lottieRef = useRef();

  return (
    <div
      onMouseEnter={() => lottieRef.current?.play()}
      onMouseLeave={() => lottieRef.current?.pause()}
    >
      <Lottie 
        lottieRef={lottieRef}
        animationData={myAnimation}
        autoplay={false}
        loop={false}
      />
    </div>
  );
};
```

### Play Once on Click
```jsx
const handleClick = () => {
  lottieRef.current?.goToAndPlay(0, true);
};

<div onClick={handleClick}>
  <Lottie 
    lottieRef={lottieRef}
    animationData={myAnimation}
    autoplay={false}
    loop={false}
  />
</div>
```

## Where to Get Lottie Files

1. **LottieFiles**: https://lottiefiles.com/ (Free & Premium)
2. **Create your own**: Use Adobe After Effects with Bodymovin plugin
3. **Figma Plugin**: Export from Figma using Lottie plugins

## Installation Status

- ✅ `lottie-react` installed
- ✅ Animation folder created at `src/assets/animations/`
- ✅ Ready to use!

## Next Steps

1. Copy your `logo.json` file to `src/assets/animations/logo.json`
2. Copy your `mascot.json` file to `src/assets/animations/mascot.json`
3. Let me know when they're uploaded and I'll integrate them into:
   - Navigation bar (logo)
   - Hero section (mascot)
