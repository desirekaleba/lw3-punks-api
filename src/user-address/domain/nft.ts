import { SupportedChain } from '../user-address.dto';

export interface INFT {
  name: string;
  imageUrl: string;
  tokenId: string;
  contractAddress: string;
  chain: SupportedChain;
  owner: string;
  creator: string;
}
