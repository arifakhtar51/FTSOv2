import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Token list to track with custom gradient styles
const TOKENS = [
  { 
    symbol: 'FLR/USD', 
    name: 'Flare', 
    icon: '💧', 
    gradient: 'from-blue-500 to-cyan-400',
    iconClass: 'text-blue-500'
  },
  { 
    symbol: 'XRP/USD', 
    name: 'XRP', 
    icon: '🌊', 
    gradient: 'from-cyan-500 to-teal-400',
    iconClass: 'text-cyan-600'
  },
  { 
    symbol: 'BTC/USD', 
    name: 'Bitcoin', 
    icon: '🪙', 
    gradient: 'from-amber-400 to-orange-500',
    iconClass: 'text-amber-500'
  },
  { 
    symbol: 'ETH/USD', 
    name: 'Ethereum', 
    icon: '💎', 
    gradient: 'from-purple-500 to-indigo-500',
    iconClass: 'text-purple-600'
  }
];

const Dashboard = () => {
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const [refreshing, setRefreshing] = useState(false);

  // Function to fetch prices
  const fetchPrices = async () => {
    try {
      setRefreshing(true);
      
      // Use Flare API directly instead of ethers.js to avoid network issues
      const apiUrl = 'https://coston2-api.flare.network/ext/bc/C/rpc';
      
      // Create promises for each token price request
      const pricePromises = TOKENS.map(token => {
        // Prepare the JSON-RPC request to get price feed data
        const data = {
          jsonrpc: '2.0',
          method: 'eth_call',
          params: [
            {
              // This would typically be the FTSO Registry or specific price provider contract
              to: '0x0E20E7f2AD89A6181Fb4D51C8f4FC4Bf15573DF1', // Replace with actual FTSO Registry address
              data: '0x4e6eb6ba' // Function signature for 'getPrice(string)' + encoded token symbol
            },
            'latest'
          ],
          id: 1
        };
        
        return axios.post(apiUrl, data)
          .then(response => {
            // Mock successful response for demo
            // In production, we'd parse the actual response.result
            return {
              symbol: token.symbol,
              name: token.name,
              icon: token.icon,
              gradient: token.gradient,
              iconClass: token.iconClass,
              price: (Math.random() * 100 + 1).toFixed(2), // Mock price
              change: (Math.random() * 10 - 5).toFixed(2) // Mock 24h change
            };
          });
      });
      
      const results = await Promise.all(pricePromises);
      
      // Transform results into an object keyed by token symbol
      const priceData = {};
      results.forEach(result => {
        priceData[result.symbol] = result;
      });
      
      setPrices(priceData);
      setLastUpdated(new Date().toLocaleString());
      setError(null);
    } catch (err) {
      setError('Failed to fetch price data');
      console.error('Error fetching prices:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      // Reset countdown after fetch
      setCountdown(10);
    }
  };

  // Initial fetch on component mount
  useEffect(() => {
    fetchPrices();
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (!loading && !refreshing) {
      fetchPrices();
    }
    
    return () => clearTimeout(timer);
  }, [countdown, loading, refreshing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 py-6 flex flex-col justify-center sm:py-12 animated-bg">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1639762681057-408e52192e55')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
      <div className="relative z-10 py-3 sm:max-w-5xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-purple-400 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl opacity-50 glow-effect"></div>
        <div className="relative px-4 py-10 bg-white backdrop-blur-xl bg-opacity-80 shadow-lg sm:rounded-3xl sm:p-20 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 opacity-30"></div>
          <div className="max-w-5xl mx-auto relative">
            <div className="divide-y divide-gray-200">
              <div className="py-8 text-base leading-6 space-y-8 text-gray-700 sm:text-lg sm:leading-7">
                <div className="flex justify-between items-center">
                  <h1 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">Live Token Price Dashboard</h1>
                  
                  {/* Countdown Timer */}
                  <div className="flex items-center justify-center">
                    <div className={`w-16 h-16 flex items-center justify-center rounded-full ${
                      countdown <= 3 ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    } font-bold text-2xl border-4 ${
                      countdown <= 3 ? 'border-red-200' : 'border-blue-200'
                    } shadow-lg transition-colors duration-300`}>
                      {refreshing ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-solid border-current border-r-transparent"></div>
                      ) : (
                        countdown
                      )}
                    </div>
                  </div>
                </div>
                
                {loading && Object.keys(prices).length === 0 ? (
                  <div className="text-center py-10">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-solid border-purple-500 border-t-transparent shadow-lg"></div>
                    <p className="mt-2 shimmer inline-block px-4 py-2 rounded-lg">Loading latest prices...</p>
                  </div>
                ) : error ? (
                  <div className="text-center text-red-500 py-10 bg-red-50 rounded-lg shadow-inner p-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p className="font-medium text-lg">{error}</p>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {TOKENS.map(token => {
                        const tokenPrice = prices[token.symbol];
                        const priceChange = tokenPrice?.change || 0;
                        const isPositive = parseFloat(priceChange) >= 0;
                        
                        return (
                          <div 
                            key={token.symbol} 
                            className={`group overflow-hidden p-6 bg-gradient-to-br from-white to-blue-50 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 glow-effect border border-gray-100 ${
                              countdown === 0 || refreshing ? 'animate-pulse' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3 mb-4">
                              <span className={`text-3xl p-2 rounded-full bg-gradient-to-br ${tokenPrice?.gradient || token.gradient} bg-opacity-10`}>{tokenPrice?.icon || token.icon}</span>
                              <h2 className="text-xl font-bold">{token.name}</h2>
                            </div>
                            <p className="text-4xl font-extrabold mb-2 text-gray-800">
                              ${tokenPrice?.price || '-.--'}
                            </p>
                            <div className="flex items-center justify-between mb-3">
                              <p className={`text-sm font-medium px-3 py-1 rounded-full inline-flex items-center ${isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {isPositive ? '↑' : '↓'} {Math.abs(parseFloat(priceChange))}%
                              </p>
                              <span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-mono">
                                {token.symbol}
                              </span>
                            </div>
                            <div className="h-2 w-full bg-gray-100 mt-4 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${isPositive ? 'bg-green-500' : 'bg-red-500'} transition-all duration-500`} 
                                style={{ width: `${Math.min(Math.abs(parseFloat(priceChange) * 10), 100)}%` }}
                              ></div>
                            </div>
                            <div className="mt-4 pt-2 border-t border-gray-100">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-500">24h Change</span>
                                <span className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                                  {isPositive ? '+' : ''}{priceChange}%
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <div className="text-center mt-12">
                      <div className="inline-flex items-center gap-2 bg-blue-50 py-2 px-6 rounded-full shadow-inner">
                        <span className="animate-pulse inline-block h-3 w-3 rounded-full bg-blue-500"></span>
                        <span className="text-sm text-gray-600">
                          Last updated: <span className="font-medium">{lastUpdated}</span>
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500">
                        Next update in {countdown} seconds
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;