import React from 'react';
import KawaiiLetter from './KawaiiLetter';

const RoseWhisper = (props) => {
  const mergedScenes = {
    hint: 'A soft note just for you...',
    scene2Header: 'My Rose Whisper...',
    scene3Header: 'Little moments of us',
    ...props.scenes,
  };

  return (
    <KawaiiLetter
      {...props}
      palette={props.palette || 'lavender'}
      font={props.font || 'elegant'}
      scenes={mergedScenes}
    />
  );
};

export default RoseWhisper;
