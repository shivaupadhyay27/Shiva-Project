import React from 'react';

interface PuzzleCardProps {
  title: string;
  date: string;
}

const PuzzleCard: React.FC<PuzzleCardProps> = ({ title, date }) => {
  return (
    <div style={{ border: '1px solid gray', padding: '10px', margin: '10px' }}>
      <h2>{title}</h2>
      <p>{date}</p>
    </div>
  );
};

export default PuzzleCard;

