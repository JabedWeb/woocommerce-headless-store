import React from 'react';
import { motion } from 'framer-motion';

const Ball = () => {
  // Define styles for the ball
  const ballStyle = {
    height: '100px',
    width: '100px',
    borderRadius: '50%',
    backgroundColor: '#EB333D',
  };

  // Define styles for the container
  const centerDivStyle = {
    minHeight: '30vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  };

  return (
    <div style={centerDivStyle}>
      <motion.div
        style={ballStyle}
        transition={{
          y: {
            duration: 3,
            repeat: Infinity,
            ease: 'linear',
          },
        }}
        animate={{ y: ['0px', '-150px' ,'0px'] }}
      />
    </div>
  );
};

export default Ball;
