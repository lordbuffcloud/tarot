'use client';

import { useEffect, useState } from 'react';

const fixedBackgroundImage = '/images/background/bg.jpg'; // Your specified background image

export default function DynamicBackground() {
  // This component doesn't render anything itself, it just applies a side effect.
  // The selectedBg state here is mostly for ensuring the effect runs and can be tracked if needed,
  // but the primary action is direct DOM manipulation of document.body.
  const [, setSelectedBg] = useState<string | null>(null);

  useEffect(() => {
    // Use the fixed background image instead of a random one
    const imageToUse = fixedBackgroundImage;
    setSelectedBg(imageToUse); // Update state, might be useful for debugging or extending
    
    if (imageToUse) {
      document.body.style.backgroundImage = `url(${imageToUse})`;
      document.body.style.backgroundSize = 'cover';
      document.body.style.backgroundPosition = 'center';
      document.body.style.backgroundRepeat = 'no-repeat';
      document.body.style.backgroundAttachment = 'fixed';
      document.body.style.minHeight = '100vh';
      document.body.style.margin = '0';
      // Ensure the body allows transparency if it has its own background color set via CSS classes
      document.body.classList.add('dynamic-bg-active'); // Optional: class to indicate script ran
    } else {
      // Fallback or default background if no image is selected
      document.body.style.backgroundColor = '#0D0A17'; // Example default dark bg
    }

    // Cleanup function to remove styles if the component unmounts
    return () => {
      document.body.style.backgroundImage = '';
      document.body.style.backgroundSize = '';
      document.body.style.backgroundPosition = '';
      document.body.style.backgroundRepeat = '';
      document.body.style.backgroundAttachment = '';
      document.body.style.minHeight = '';
      document.body.style.margin = '';
      document.body.style.backgroundColor = ''; 
      document.body.classList.remove('dynamic-bg-active');
    };
  }, []); // Empty dependency array means this runs once on mount

  return null; // This component does not render any actual HTML output
} 