import {
  BlockCell, BlocksInfoItem
} from '@/components/blocks-info/blocks-info-item/BlocksInfoItem';
import { cellWith } from '@/components/blocks-info/constants';
import { MasterNodeTitle } from '@/components/blocks-info/master-node-title/MasterNodeTitle';
import RecentBlocksTitle from '@/components/blocks-info/recent-blocks-title/RecentBlocksTitle';
import ErrorState from '@/components/error-state/ErrorState';
import InfiniteList from '@/components/infinite-list/InfiniteList';

// import Tooltip from '@/components/tooltip/Tooltip';

interface BlocksInfoProps {
  title: string;
  data?: BlocksInfoItem[];
  setData?: React.Dispatch<React.SetStateAction<BlocksInfoItem[]>>;
  fetchMoreData?: () => void;
  enableInfinite?: boolean;
  isFetchingMore?: boolean;
  isReachApiEnd?: boolean;
  isLoading?: boolean;
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function BlocksInfo({ title, data, setData, fetchMoreData, isFetchingMore, isReachApiEnd, isLoading, setIsLoading }: BlocksInfoProps) {
  if (!data || !data.length) {
    return <ErrorState title={title} />;
  }

  return (
    <div>
      {(title === 'Master Nodes') ? (
        <MasterNodeTitle title={title} />
      ) : (
        <RecentBlocksTitle
          title={title}
          setData={setData}
          setIsLoading={setIsLoading}
        />
      )}
      <div className='mt-0 h-[400px] overflow-hidden hover:overflow-auto relative dark:text-text-dark-100'>
        <table>
          <BlocksInfoHeading type={data[0].type} />
          <tbody>
            {fetchMoreData ? (
              <InfiniteList
                data={data}
                fetchData={fetchMoreData}
                isFetchingMore={isFetchingMore}
                isReachApiEnd={isReachApiEnd}
                isLoading={isLoading}
              >
                <BlocksInfoItems data={data} title={title} />
              </InfiniteList>
            ) : (
              <BlocksInfoItems data={data} title={title} />
            )}
          </tbody>
        </table>
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
      <thead className='flex dark:bg-bg-dark-800 bg-white sticky top-0 items-center'>
        <tr>
          <BlockCell className={cellWith.recentBlocks.height}>Height</BlockCell>
          <BlockCell className={cellWith.recentBlocks.hash}>Hash</BlockCell>
          <BlockCell className={cellWith.recentBlocks.proposedBy}>Proposed By</BlockCell>
          <BlockCell className={cellWith.recentBlocks.status}>Confirmation Status</BlockCell>
          <BlockCell className={cellWith.recentBlocks.time}>
            Time
            {/* <div className='inline-flex'>Time <Tooltip text='The time passed after the block get confirmed.' buttonClassName='ml-1' /></div> */}
          </BlockCell>
        </tr>
      </thead>
    );
  }

  return (
    <thead>
      <tr className='flex'>
        <BlockCell className={cellWith.masterNodes.number}>Number</BlockCell>
        <BlockCell className={cellWith.masterNodes.account}>Account</BlockCell>
        <BlockCell className={cellWith.masterNodes.role}>Role</BlockCell>
        {/* <BlockCell className={cellWith.masterNodes.activity}>Activity</BlockCell> */}
        {/* <BlockCell className={cellWith.masterNodes.lastedParticipatedBlock}>Latest Participated Block</BlockCell> */}
      </tr>
    </thead>
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
          <tr
            className={`flex border-b-2 border-text-white-400 dark:border-opacity-40 dark:border-text-dark-400
              ${index === 0 ? 'border-t-2' : ''}`
            }
            key={`${title}-${d.number}`}
          >
            <BlocksInfoItem {...d} />
          </tr>
        ))
      }
    </>
  );
}
