import { HomeLoaderData } from '@/types/loaderData';

/**
 * Iterate each item in new array
 * if it exists in old array, update old array value and discord the item 
 * if it does not exist in old array, concat it in the end of old array
 * @param oldArray old array
 * @param newArray new array
 */
export function uniqReplaceByName(oldArray: any[], newArray: any[]) {
  const copyOfOldArray = [...oldArray];
  for (let i = 0; i < newArray.length; i++) {
    const newArrayElement = newArray[i];
    if (!('number' in newArrayElement)) {
      return [];
    }

    const duplicateIndex = oldArray.findIndex(oldArrayElement => oldArrayElement['number'] === newArrayElement['number']);

    if (duplicateIndex === -1) {
      copyOfOldArray.push(newArrayElement);
    }

    copyOfOldArray[duplicateIndex] = newArrayElement;
  }

  return copyOfOldArray;
}

export function getSortedRecentBlocks(blocks?: HomeLoaderData.Blocks.Block[]): BlocksInfoItem[] {
  if (!blocks) {
    return [];
  }

  return blocks.sort((a, b) => b.number - a.number).map<BlocksInfoItem>(block => ({
    ...block,
    type: 'recent-block',
  }));
}