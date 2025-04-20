export interface TokenPrice {
  symbol: string;
  pair: string;
  price: number;
  lastUpdate: Date;
}

export interface TokenCardProps {
  token: TokenPrice;
  isUpdating?: boolean;
} 