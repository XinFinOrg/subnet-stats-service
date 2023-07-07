import {
    BlockCell, BlocksInfoItem
} from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';
import { cellWith } from '@/components/blocks-info/constants';
import { MasterNodeTitle } from '@/components/blocks-info/master-node-title/MasterNodeTitle';
import InfiniteList from '@/components/infinite-list/InfiniteList';
import Title from '@/components/title/Title';

interface BlocksInfoProps {
  title: string;
  data: BlocksInfoItem[];
  fetchMoreData?: () => void;
  enableInfinite?: boolean;
}

export default function BlocksInfo({ title, data, fetchMoreData }: BlocksInfoProps) {
  if (!data || !data.length) {
    return <></>;
  }

  return (
    <div>
      {(title === 'Master Nodes') ? (
        <MasterNodeTitle title={title} />
      ) : (
        <Title title={title} />
      )}
      <div className='mt-6 h-[400px] overflow-hidden hover:overflow-auto relative dark:text-text-dark-100'>
        <>
          <BlocksInfoHeading type={data[0].type} />
          {fetchMoreData ? (
            <InfiniteList data={data} fetchData={fetchMoreData}>
              <BlocksInfoItems data={data} />
            </InfiniteList>
          ) : (
            <BlocksInfoItems data={data} />
          )}
        </>
      </div>
    </div>
  );
}

type ItemTypes = 'recent-block' | 'master-node';

interface BlocksInfoHeadingProps {
  type: ItemTypes;
}

function BlocksInfoHeading({ type }: BlocksInfoHeadingProps) {
  if (type === 'recent-block') {
    return (
      <div className='flex dark:bg-bg-dark-800 bg-white sticky top-0'>
        <BlockCell className={cellWith.recentBlocks.height}>Height</BlockCell>
        <BlockCell className={cellWith.recentBlocks.hash}>Hash</BlockCell>
        <BlockCell className={cellWith.recentBlocks.proposedBy}>Proposed By</BlockCell>
        <BlockCell className={cellWith.recentBlocks.status}>Status</BlockCell>
        <BlockCell className={cellWith.recentBlocks.time}>Time</BlockCell>
      </div>
    );
  }

  return (
    <div className='flex'>
      <BlockCell className={cellWith.masterNodes.number}>Number</BlockCell>
      <BlockCell className={cellWith.masterNodes.account}>Account</BlockCell>
      <BlockCell className={cellWith.masterNodes.role}>Role</BlockCell>
      {/* <BlockCell className={cellWith.masterNodes.activity}>Activity</BlockCell> */}
      {/* <BlockCell className={cellWith.masterNodes.lastedParticipatedBlock}>Latest Participated Block</BlockCell> */}
    </div>
  );
}

interface BlocksInfoItemsProps {
  data: BlocksInfoItem[];
}

function BlocksInfoItems({ data }: BlocksInfoItemsProps) {
  return (
    <>
      {
        data.map((d, index) => (
          <div
            className={`flex border-b-2 border-text-white-400 dark:border-opacity-40 dark:border-text-dark-400
              ${index === 0 ? 'border-t-2' : ''}`
            }
            key={d.number}
          >
            <BlocksInfoItem {...d} />
          </div>
        ))
      }
    </>
  );
}
