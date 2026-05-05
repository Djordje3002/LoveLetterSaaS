import React from 'react';
import KawaiiLetter from './KawaiiLetter';

const GoldenPromise = (props) => {
  const mergedScenes = {
    hint: 'Open to read a golden promise ✨',
    scene2Header: 'A promise from my heart',
    scene3Header: 'Memories I treasure',
    closingMessage: 'You are my always.',
    ...props.scenes,
  };

  return (
    <KawaiiLetter
      {...props}
      palette={props.palette || 'gold'}
      font={props.font || 'classic'}
      scenes={mergedScenes}
    />
  );
};

export default GoldenPromise;
