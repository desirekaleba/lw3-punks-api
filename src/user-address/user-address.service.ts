import 'dotenv/config';
import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { SupportedChain } from './user-address.dto';
import { ITokenBalance } from './domain/token-balance';
import { ethers } from 'ethers';
import { IAccountTransaction } from './domain/account-transaction';
import { INFT } from './domain/nft';
import { formatIPFSImageLink } from 'src/utils';
import { ISSUER_ADDRESSES } from 'src/constants';

const {
  UNMARSHAL_BASE_API_URL = 'https://api.unmarshal.com/v1',
  UNMARSHAL_API_KEY = 'pNzqmRTuzY30eg8IEbk9E9OsXDRZigFC9ws9oiDo',
  COVALENTHQ_BASE_API_URL = 'https://api.covalenthq.com/v1',
  COVALENTHQ_API_KEY = 'ckey_81df6d33d2bf4ab5b4622c604b1',
} = process.env;

@Injectable()
export class UserAddressService {
  constructor(private readonly httpService: HttpService) {}

  async fetchTokenBalances({
    chain,
    address,
  }: {
    chain: SupportedChain;
    address: string;
  }): Promise<ITokenBalance[]> {
    try {
      const { data }: { data: any[] } = await firstValueFrom(
        this.httpService.get(
          `${UNMARSHAL_BASE_API_URL}/${chain}/${address}/assets?auth_key=${UNMARSHAL_API_KEY}`,
        ),
      );

      return data.map<ITokenBalance>((tokenBalance) => {
        const balance = Number(ethers.utils.formatEther(tokenBalance.balance));
        return {
          tokenName: tokenBalance.contract_name,
          tokenSymbol: tokenBalance.contract_ticker_symbol,
          tokenDecimal: tokenBalance.contract_decimals,
          tokenAddress: tokenBalance.contract_address,
          coin: tokenBalance.coin,
          type: tokenBalance.type,
          balance,
          balanceInUSD: tokenBalance.quote_rate * balance,
          quote: tokenBalance.quote,
          quoteRate: tokenBalance.quote_rate,
          tokenLogoUrl: tokenBalance.logo_url,
          quoteRate24h: tokenBalance.quote_rate_24h,
          quotePctChange24h: tokenBalance.quote_pct_change_24h,
        };
      });
    } catch (error) {
      Logger.error('UNMARSHAL_ERROR LOADING TOKEN_BALANCE', error);
      return null;
    }
  }

  async fetchNFT({
    chain,
    address,
  }: {
    chain: SupportedChain;
    address: string;
  }): Promise<INFT[]> {
    try {
      const { data }: { data: any[] } = await firstValueFrom(
        this.httpService.get(
          `${UNMARSHAL_BASE_API_URL}/${chain}/address/${address}/nft-assets?page=1&pageSize=50&auth_key=${UNMARSHAL_API_KEY}`,
        ),
      );
      return data
        .map<INFT>((nft) => {
          return {
            name: nft?.issuer_specific_data?.name,
            imageUrl: formatIPFSImageLink(nft?.issuer_specific_data?.image_url),
            tokenId: nft.token_id,
            contractAddress: nft.asset_contract,
            chain:
              chain === SupportedChain.ETHEREUM
                ? SupportedChain.ETHEREUM
                : SupportedChain.POLYGON,
            owner: nft.owner,
            creator: nft.creator,
          };
        })
        .filter(
          (nft) =>
            nft.imageUrl &&
            nft.name &&
            ISSUER_ADDRESSES.includes(nft.contractAddress),
        );
    } catch (error) {
      Logger.error('UNMARSHAL_ERROR LOADING NFT_METADATA', error);
      return null;
    }
  }

  async fetchDexData({
    chain,
    dexName,
  }: {
    chain: SupportedChain;
    dexName: string;
  }): Promise<any> {
    try {
      const chainId = chain === SupportedChain.ETHEREUM ? 1 : 137;
      const { data }: { data: any } = await firstValueFrom(
        this.httpService.get(
          `${COVALENTHQ_BASE_API_URL}/${chainId}/xy=k/${dexName}/ecosystem/?quote-currency=USD&format=JSON&key=${COVALENTHQ_API_KEY}`,
        ),
      );
      return data.data?.items[0];
    } catch (error) {
      Logger.error('UNMARSHAL_ERROR LOADING ACCOUNT_TRANSACTION', error);
      return null;
    }
  }

  async fetchAccountTransaction({
    chain,
    address,
  }: {
    chain: SupportedChain;
    address: string;
  }): Promise<IAccountTransaction[]> {
    try {
      const { data }: { data: IAccountTransaction[] } = await firstValueFrom(
        this.httpService.get(
          `${UNMARSHAL_BASE_API_URL}/${chain}/address/${address}/transactions?auth_key=${UNMARSHAL_API_KEY}`,
        ),
      );
      return data;
    } catch (error) {
      Logger.error('UNMARSHAL_ERROR LOADING ACCOUNT_TRANSACTION', error);
      return null;
    }
  }
}
