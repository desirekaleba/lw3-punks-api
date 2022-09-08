export interface ITokenBalance {
  tokenName: string;
  tokenSymbol: string;
  tokenDecimal: number;
  tokenAddress: string;
  coin: number;
  type: string;
  balance: number;
  balanceInUSD: number;
  quote: number;
  quoteRate: number;
  tokenLogoUrl: string;
  quoteRate24h: string;
  quotePctChange24h: number;
}
