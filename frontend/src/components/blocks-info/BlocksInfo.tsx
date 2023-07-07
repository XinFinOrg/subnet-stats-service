import { PropsWithChildren } from 'react';

import Svg, { SvgNames } from '@/components/images/Svg';
import InfiniteList from '@/components/infinite-list/InfiniteList';
import Title from '@/components/title/Title';

interface BlocksInfoProps {
  title: string;
  data: BlocksInfoItem[];
  fetchMoreData?: () => void;
  enableInfinite?: boolean;
}

const cellWith = {
  recentBlocks: {
    'height': 'w-[85px]',
    'hash': 'w-[144px]',
    'proposedBy': 'w-[144px]',
    'status': 'w-[75px]',
    'time': 'w-[50px]',
  },
  masterNodes: {
    'number': 'w-[64px]',
    'account': 'w-[144px]',
    'role': 'w-[290px]',
    'activity': 'w-[100px]',
    'lastedParticipatedBlock': 'w-[144px]',
  }
};

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
      <div className="mt-6 h-[400px] overflow-hidden hover:overflow-auto relative dark:text-text-dark-100">
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

interface MasterNodeTitleProps {
  title: string;
}

function MasterNodeTitle({ title }: MasterNodeTitleProps) {
  return (
    <div className='flex justify-between'>
      <Title title={title} />
      <div className='flex flex-col dark:text-text-dark-400'>
        <div className='flex'>
          <Svg svgName={SvgNames.Miner} />
          <span className="pl-2.5">Miner</span>
        </div>
        <div className='pt-2.5 flex'>
          <Svg svgName={SvgNames.Penalty} />
          <span className="pl-2.5">Penalty</span>
        </div>
        <div className='pt-2.5 flex'>
          <Svg svgName={SvgNames.Standby} />
          <span className="pl-2.5">Standby</span>
        </div>
      </div>
    </div>
  );
}

interface BlocksInfoItemsProps {
  data: BlocksInfoItem[];
}

function BlocksInfoItems({ data }: BlocksInfoItemsProps) {
  function getKey(d: BlocksInfoItem) {
    if (d.type === 'recent-block') {
      return d.height;
    }

    return d.number;
  }

  return (
    <>
      {
        data.map((d, index) => (
          <div className={`flex border-b-2 border-text-white-400 dark:border-opacity-40 dark:border-text-dark-400 ${index === 0 ? 'border-t-2' : ''}`} key={getKey(d)}>
            <BlocksInfoItem {...d} />
          </div>
        ))
      }
    </>
  );
}

interface BlocksInfoHeadingProps {
  type: ItemTypes;
}

function BlocksInfoHeading({ type }: BlocksInfoHeadingProps) {
  if (type === 'recent-block') {
    return (
      <div className='flex dark:bg-bg-dark-800 sticky top-0'>
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

export type BlocksInfoItem = RecentBlock | MasterNode;
type BlocksInfoItemProps = BlocksInfoItem;

type ItemTypes = 'recent-block' | 'master-node';

interface RecentBlock {
  type: 'recent-block';
  height: number;
  hash: string;
  proposedBy: string;
  subnetConfirmed: boolean;
  parentConfirmed: boolean;
  time: number;
}

interface MasterNode {
  type: 'master-node';
  number: number;
  account: string;
  role: MasterNodeRoles;
  activity: boolean;
  latestParticipateBlock: number;
}

type MasterNodeRoles = 'miner' | 'standby' | 'penalty';

function BlocksInfoItem(data: BlocksInfoItemProps) {
  if (data.type === 'recent-block') {
    return (
      <div className='flex'>
        <BlockCell className={cellWith.recentBlocks.height}>{data.height}</BlockCell>
        <BlockCell className={cellWith.recentBlocks.hash}>{data.hash}</BlockCell>
        <BlockCell className={cellWith.recentBlocks.proposedBy}>{data.proposedBy}</BlockCell>
        <BlockImageCell className={cellWith.recentBlocks.status}>
          <BlockConfirmStatus subnetConfirmed={data.subnetConfirmed} parentConfirmed={data.parentConfirmed} />
        </BlockImageCell>
        <BlockCell className={cellWith.recentBlocks.time}>{data.time}s</BlockCell>
      </div>
    );
  }

  return (
    <div className='flex'>
      <BlockCell className={cellWith.masterNodes.number}>{data.number}</BlockCell>
      <BlockCell className={cellWith.masterNodes.account}>{data.account}</BlockCell>
      <BlockImageCell className={cellWith.masterNodes.role}><MasterNodeRole role={data.role} /></BlockImageCell>
      {/* <BlockCell className={cellWith.masterNodes.activity}>{data.activity ? 'Active' : 'Inactive'}</BlockCell>
      <BlockCell className={cellWith.masterNodes.lastedParticipatedBlock}>{data.latestParticipateBlock}</BlockCell> */}
    </div>
  );

  return <>type not found</>;
}

interface BlockCellProps extends PropsWithChildren {
  className: string;
}

function BlockCell({ className, children }: BlockCellProps) {
  return (
    <div className={`px-2 py-2.5 leading-tight ${className}`}>{children}</div>
  );
}

function BlockImageCell({ className, children }: BlockCellProps) {
  return (
    <div className={`flex items-center px-2 py-[7px] leading-tight ${className}`}>{children}</div>
  );
}

interface BlockConfirmStatusProps {
  subnetConfirmed: boolean;
  parentConfirmed: boolean;
}

function BlockConfirmStatus({ subnetConfirmed, parentConfirmed }: BlockConfirmStatusProps) {
  return (
    <div className='flex items-center'>
      {subnetConfirmed ? <Svg svgName={SvgNames.Check} /> : <Svg svgName={SvgNames.Cross} />}
      /
      {parentConfirmed ? <Svg svgName={SvgNames.Check} /> : <Svg svgName={SvgNames.Cross} />}
    </div>
  );
}

interface MasterNodeRoleProps {
  role: MasterNodeRoles;
}

function MasterNodeRole({ role }: MasterNodeRoleProps) {
  if (role === 'standby') {
    return <Svg svgName={SvgNames.Standby} />;
  }
  else if (role === 'penalty') {
    return <Svg svgName={SvgNames.Penalty} />;
  }

  return <Svg svgName={SvgNames.Miner} />;
}
