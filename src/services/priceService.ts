import { ethers } from 'ethers';
import { TokenPrice } from '../types';

const FTSO_REGISTRY_ADDRESS = '0x4C54FA38F0a792A0C8E457C7BB95C10E9F52A497'; // Coston2 testnet
const RPC_URL = 'https://coston2-api.flare.network/ext/C/rpc';

const FTSO_REGISTRY_ABI = [
  'function getCurrentPrice(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp)',
  'function getCurrentPriceWithDecimals(string memory _symbol) external view returns (uint256 _price, uint256 _timestamp, uint256 _decimals)'
];

class PriceService {
  private provider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    this.contract = new ethers.Contract(FTSO_REGISTRY_ADDRESS, FTSO_REGISTRY_ABI, this.provider);
  }

  async getTokenPrice(symbol: string): Promise<TokenPrice> {
    try {
      const [price, timestamp, decimals] = await this.contract.getCurrentPriceWithDecimals(symbol);
      
      return {
        symbol,
        pair: `${symbol}/USD`,
        price: parseFloat(ethers.utils.formatUnits(price, decimals)),
        lastUpdate: new Date(timestamp.toNumber() * 1000)
      };
    } catch (error) {
      console.error(`Error fetching price for ${symbol}:`, error);
      throw error;
    }
  }

  async getAllPrices(symbols: string[]): Promise<TokenPrice[]> {
    return Promise.all(symbols.map(symbol => this.getTokenPrice(symbol)));
  }
}

export const priceService = new PriceService(); 