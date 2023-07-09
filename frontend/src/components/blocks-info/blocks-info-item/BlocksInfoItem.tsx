import { PropsWithChildren, useContext } from 'react';

import { cellWith } from '@/components/blocks-info/constants';
import Svg, { SvgNames } from '@/components/images/Svg';
import { formatHash } from '@/utils/formatter';
import { TimeContext } from '@/contexts/timeContext';

export type BlocksInfoItem = RecentBlock | MasterNode;
type BlocksInfoItemProps = BlocksInfoItem;

interface RecentBlock {
  type: 'recent-block';
  number: number;
  hash: string;
  miner: string;
  committedInSubnet: boolean;
  committedInParentChain: boolean;
  timestamp: number;
}

interface MasterNode {
  type: 'master-node';
  number: number;
  account: string;
  role: MasterNodeRoles;
  activity: boolean;
  latestParticipateBlock: number;
}

type MasterNodeRoles = 'master-node' | 'candidate' | 'penalty';

export function BlocksInfoItem(data: BlocksInfoItemProps) {
  const { currentUnixTime } = useContext(TimeContext);

  function getTimeDiff(timestamp: number): string {
    const timeDiff = Math.floor(currentUnixTime - timestamp);
    if (timeDiff < 60) {
      return `${timeDiff}s`;
    } else if (timeDiff < 60 * 60) {
      return `${Math.floor(timeDiff / 60)}m`;
    }

    return '>1hr';
  }

  if (data.type === 'recent-block') {

    return (
      <div className='flex'>
        <BlockCell className={cellWith.recentBlocks.height}>{data.number}</BlockCell>
        <BlockCell className={cellWith.recentBlocks.hash}>{formatHash(data.hash)}</BlockCell>
        <BlockCell className={cellWith.recentBlocks.proposedBy}>{formatHash(data.miner)}</BlockCell>
        <BlockImageCell className={cellWith.recentBlocks.status}>
          <BlockConfirmStatus committedInSubnet={data.committedInSubnet} committedInParentChain={data.committedInParentChain} />
        </BlockImageCell>
        <BlockCell className={cellWith.recentBlocks.time}>{getTimeDiff(data.timestamp)}</BlockCell>
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
}

interface BlockCellProps extends PropsWithChildren {
  className: string;
}

export function BlockCell({ className, children }: BlockCellProps) {
  return (
    <div className={`px-2 py-2.5 leading-tight ${className}`}>{children}</div>
  );
}

export function BlockImageCell({ className, children }: BlockCellProps) {
  return (
    <div className={`flex items-center px-2 py-[7px] leading-tight ${className}`}>{children}</div>
  );
}

interface BlockConfirmStatusProps {
  committedInSubnet: boolean;
  committedInParentChain: boolean;
}

function BlockConfirmStatus({ committedInSubnet, committedInParentChain }: BlockConfirmStatusProps) {
  return (
    <div className='flex items-center'>
      {committedInSubnet ? <Svg svgName={SvgNames.Check} /> : <Svg svgName={SvgNames.Cross} />}
      /
      {committedInParentChain ? <Svg svgName={SvgNames.Check} /> : <Svg svgName={SvgNames.Cross} />}
    </div>
  );
}

interface MasterNodeRoleProps {
  role: MasterNodeRoles;
}

function MasterNodeRole({ role }: MasterNodeRoleProps) {
  if (role === 'candidate') {
    return <Svg svgName={SvgNames.Standby} />;
  }
  else if (role === 'penalty') {
    return <Svg svgName={SvgNames.Penalty} />;
  }

  return <Svg svgName={SvgNames.Miner} />;
}