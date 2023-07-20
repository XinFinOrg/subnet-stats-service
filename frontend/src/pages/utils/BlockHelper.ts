import { BlocksInfoItem } from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';
import { HomeLoaderData } from '@/types/loaderData';

export function getSortedRecentBlocks(blocks?: HomeLoaderData.Blocks.Block[]): BlocksInfoItem[] {
  if (!blocks) {
    return [];
  }

  return blocks.sort((a, b) => b.number - a.number).map<BlocksInfoItem>(block => ({
    ...block,
    type: 'recent-block',
  }));
}