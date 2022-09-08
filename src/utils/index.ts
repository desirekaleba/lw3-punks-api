export const formatIPFSImageLink = (img_url) => {
  if (img_url.startsWith('ipfs')) {
    img_url = img_url.substr(7);
    return 'https://unmarshal.mypinata.cloud/ipfs/' + img_url;
  }
  return img_url;
};
