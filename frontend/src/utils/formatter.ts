export function formatHash(hash: string): string {
  if (hash?.length >= 15) {
    return `${hash.slice(0, 6)}...${hash.slice(-6)}`;
  }
  return '';
}