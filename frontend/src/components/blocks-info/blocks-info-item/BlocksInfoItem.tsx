import { PropsWithChildren, useContext } from 'react';
import { Link } from 'react-router-dom';

import { cellWith } from '@/components/blocks-info/constants';
import Copyable from '@/components/copyable/Copyable';
import Svg, { SvgNames } from '@/components/images/Svg';
import { TimeContext } from '@/contexts/TimeContext';
import { formatHash } from '@/utils/formatter';

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

export interface MasterNode {
  type: 'master-node';
  number: number;
  account: string;
  role: MasterNodeRoles;
  // activity: boolean;
  // latestParticipateBlock: number;
}

type MasterNodeRoles = 'MASTERNODE' | 'CANDIDATE' | 'PENALTY';

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
        <BlockCell className={cellWith.recentBlocks.height}>
          <Link to={`/checker/${data.number}`}>{data.number}</Link>
        </BlockCell>
        <BlockCell className={cellWith.recentBlocks.hash}>
          <Copyable copyText={data.hash}>
            <Link to={`/checker/${data.hash}`}>
              {formatHash(data.hash)}
            </Link>
          </Copyable>
        </BlockCell>
        <BlockCell className={cellWith.recentBlocks.proposedBy}>
          <Copyable copyText={data.miner}>
            {formatHash(data.miner)}
          </Copyable>
        </BlockCell>
        <BlockImageCell className={cellWith.recentBlocks.status}>
          <BlockConfirmStatus committedInSubnet={data.committedInSubnet} committedInParentChain={data.committedInParentChain} />
        </BlockImageCell>
        <BlockCell className={cellWith.recentBlocks.time}>{getTimeDiff(data.timestamp)} ago</BlockCell>
      </div>
    );
  }

  return (
    <div className='flex'>
      <BlockCell className={cellWith.masterNodes.number}>{data.number}</BlockCell>
      <BlockCell className={cellWith.masterNodes.account}>
        <Copyable copyText={data.account}>
          {formatHash(data.account)}
        </Copyable>
      </BlockCell>
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
    <div className={`group px-2 py-2.5 leading-tight ${className}`}>{children}</div>
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
  if (role === 'CANDIDATE') {
    return <Svg svgName={SvgNames.Standby} />;
  }
  else if (role === 'PENALTY') {
    return <Svg svgName={SvgNames.Penalty} />;
  }

  return <Svg svgName={SvgNames.Miner} />;
}
