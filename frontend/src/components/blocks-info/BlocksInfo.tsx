import {
  BlockCell, BlocksInfoItem
} from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';
import { cellWith } from '@/components/blocks-info/constants';
import { MasterNodeTitle } from '@/components/blocks-info/master-node-title/MasterNodeTitle';
import ErrorState from '@/components/error-state/ErrorState';
import InfiniteList from '@/components/infinite-list/InfiniteList';
import Title from '@/components/title/Title';

// import Tooltip from '@/components/tooltip/Tooltip';

interface BlocksInfoProps {
  title: string;
  data?: BlocksInfoItem[];
  fetchMoreData?: () => void;
  enableInfinite?: boolean;
}

export default function BlocksInfo({ title, data, fetchMoreData }: BlocksInfoProps) {
  if (!data || !data.length) {
    return <ErrorState title={title} />;
  }

  return (
    <div>
      {(title === 'Master Nodes') ? (
        <MasterNodeTitle title={title} />
      ) : (
        <Title title={title} />
      )}
      <div className='mt-0 h-[400px] overflow-hidden hover:overflow-auto relative dark:text-text-dark-100'>
        <>
          <BlocksInfoHeading type={data[0].type} />
          {fetchMoreData ? (
            <InfiniteList data={data} fetchData={fetchMoreData}>
              <BlocksInfoItems data={data} title={title} />
            </InfiniteList>
          ) : (
            <BlocksInfoItems data={data} title={title} />
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
      <div className='flex dark:bg-bg-dark-800 bg-white sticky top-0 items-center'>
        <BlockCell className={cellWith.recentBlocks.height}>Height</BlockCell>
        <BlockCell className={cellWith.recentBlocks.hash}>Hash</BlockCell>
        <BlockCell className={cellWith.recentBlocks.proposedBy}>Proposed By</BlockCell>
        <BlockCell className={cellWith.recentBlocks.status}>Confirmation Status</BlockCell>
        <BlockCell className={cellWith.recentBlocks.time}>
          Time
          {/* <div className='inline-flex'>Time <Tooltip text='The time passed after the block get confirmed.' buttonClassName='ml-1' /></div> */}
        </BlockCell>
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
  title: string;
}

function BlocksInfoItems({ data, title }: BlocksInfoItemsProps) {
  return (
    <>
      {
        data.map((d, index) => (
          <div
            className={`flex border-b-2 border-text-white-400 dark:border-opacity-40 dark:border-text-dark-400
              ${index === 0 ? 'border-t-2' : ''}`
            }
            key={`${title}-${d.number}`}
          >
            <BlocksInfoItem {...d} />
          </div>
        ))
      }
    </>
  );
}
