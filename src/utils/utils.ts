
// shorten the checksummed version of the input address to have 4 characters at start and end
export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export const parseParams = (querystring) => {
  const obj = {};

  var query = querystring.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');
      obj[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
  }
  return obj;
};