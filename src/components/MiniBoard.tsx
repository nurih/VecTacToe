import React from 'react';

interface MiniBoardProps {
  board: string;
}

export function MiniBoard({ board }: MiniBoardProps) {
  const boardStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gridTemplateRows: 'repeat(3, 1fr)',
    width: '32px',
    height: '32px',
    backgroundColor: '#404060',
    boxSizing: 'border-box',
  };

  const cellStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',    
    boxSizing: 'border-box',
    fontSize: '10px',
    lineHeight: 1,
    userSelect: 'none',
  };

  return (
    <div style={boardStyle}>

      {board.split('').map((v, idx) => (
        <div key={idx} style={cellStyle} className={v === 'X' ? 'text-cyan-400' : 'text-yellow-400'}>
          {v === 'X' || v === 'O' ? v : ''}
        </div>
      ))}
    </div>
  );
}