import { Controller, Get, Query } from '@nestjs/common';
import { ETHEREUM_DEX, BSC_DEX } from 'src/constants';
import { SupportedChain, UserAddressQuery } from './user-address.dto';
import { UserAddressService } from './user-address.service';

@Controller('user-address')
export class UserAddressController {
  constructor(private readonly userAddressService: UserAddressService) {}

  @Get('/token-balance')
  async getTokenBalances(@Query() { chain, address }: UserAddressQuery) {
    const data = await this.userAddressService.fetchTokenBalances({
      chain,
      address,
    });
    return {
      statusCode: 200,
      data,
    };
  }

  @Get('/account-transaction')
  async getAccountTransaction(@Query() { chain, address }: UserAddressQuery) {
    const data = await this.userAddressService.fetchAccountTransaction({
      chain,
      address,
    });
    return {
      statusCode: 200,
      data,
    };
  }

  @Get('/nfts')
  async getNFT(@Query() { chain, address }: UserAddressQuery) {
    const data = await this.userAddressService.fetchNFT({
      chain,
      address,
    });
    return {
      statusCode: 200,
      data,
    };
  }

  @Get('/dex-stats')
  async getDexStat(@Query() { chain }: { chain: SupportedChain }) {
    const supportedDex =
      chain === SupportedChain.ETHEREUM ? ETHEREUM_DEX : BSC_DEX;
    const data = await Promise.all(
      supportedDex.map((dexName) =>
        this.userAddressService.fetchDexData({ chain, dexName }),
      ),
    );
    return {
      statusCode: 200,
      data,
    };
  }
}
