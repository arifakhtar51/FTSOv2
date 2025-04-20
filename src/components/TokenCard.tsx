import React from 'react';
import { TokenCardProps } from '../types';
import { formatDistanceToNow } from 'date-fns';

const TokenCard: React.FC<TokenCardProps> = ({ token, isUpdating }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${isUpdating ? 'animate-pulse-once' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800">{token.symbol}</h3>
        <span className="text-sm text-gray-500">{token.pair}</span>
      </div>
      
      <div className="text-3xl font-bold text-blue-600 mb-4">
        ${token.price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </div>
      
      <div className="text-sm text-gray-500">
        Last updated: {formatDistanceToNow(token.lastUpdate, { addSuffix: true })}
      </div>
    </div>
  );
};

export default TokenCard; 