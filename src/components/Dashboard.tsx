import React, { useEffect, useState } from 'react';
import { TokenPrice } from '../types';
import { priceService } from '../services/priceService';
import TokenCard from './TokenCard';

const SUPPORTED_TOKENS = ['BTC', 'ETH', 'XRP', 'DOGE'];
const REFRESH_INTERVAL = 30000; // 30 seconds

const Dashboard: React.FC = () => {
  const [prices, setPrices] = useState<TokenPrice[]>([]);
  const [updatingTokens, setUpdatingTokens] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const fetchPrices = async () => {
    try {
      setError(null);
      const oldPrices = new Map(prices.map(p => [p.symbol, p]));
      const updatingSymbols = new Set(SUPPORTED_TOKENS);
      setUpdatingTokens(updatingSymbols);

      const newPrices = await priceService.getAllPrices(SUPPORTED_TOKENS);
      setPrices(newPrices);
      setUpdatingTokens(new Set());
    } catch (err) {
      setError('Failed to fetch token prices. Please try again later.');
      setUpdatingTokens(new Set());
    }
  };

  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Live Token Prices
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Powered by Flare FTSOv2 Oracle
          </p>
        </div>

        {error && (
          <div className="mb-8 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {prices.map((token) => (
            <TokenCard
              key={token.symbol}
              token={token}
              isUpdating={updatingTokens.has(token.symbol)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 