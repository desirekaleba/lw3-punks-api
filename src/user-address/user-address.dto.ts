import { IsEnum, IsString } from 'class-validator';

export enum SupportedChain {
  POLYGON = 'matic',
  ETHEREUM = 'ethereum',
}

export class UserAddressQuery {
  @IsEnum(SupportedChain)
  chain: SupportedChain = SupportedChain.POLYGON;

  @IsString()
  address: string;
}
