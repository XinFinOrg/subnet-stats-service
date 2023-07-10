import Check from '@/assets/check.svg';
import Cross from '@/assets/cross.svg';
import InfoDark from '@/assets/info-dark.svg';
import Info from '@/assets/info.svg';
import Loading from '@/assets/loading.svg';
import Miner from '@/assets/miner.svg';
import NoResultDark from '@/assets/no-results-dark.svg';
import NoResult from '@/assets/no-results.svg';
import Penalty from '@/assets/penalty.svg';
import Rhombus from '@/assets/rhombus.svg';
import Search from '@/assets/search.svg';
import Standby from '@/assets/standby.svg';
import Logo from '@/assets/xdc-logo.svg';

interface GeneralSvgProps {
  colour: string;
}

function Fallback({ colour }: GeneralSvgProps) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' className={colour}
      xmlns='http://www.w3.org/2000/svg'>
    </svg>
  );
}

/**
 * The following are inline-svg which needs to change colour base on theme
 */
function Moon({ colour }: GeneralSvgProps) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' className={colour}
      xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M11.01 3.05001C6.51 3.54001 3 7.36001 3 12C3 16.97 7.03 21 12 21C16.63 21 20.45 17.5 20.95 13C21.04 12.21 20.17 11.58 19.41 12.05C18.57 12.59 17.57 12.9 16.5 12.9C13.52 12.9 11.1 10.48 11.1 7.50001C11.1 6.44001 11.41 5.44001 11.94 4.61001C12.39 3.94001 11.9 2.98001 11.01 3.05001Z'
      />
    </svg>
  );
}

function Sun({ colour }: GeneralSvgProps) {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' className={colour} xmlns='http://www.w3.org/2000/svg'>
      <path d='M12 7C9.24 7 7 9.24 7 12C7 14.76 9.24 17 12 17C14.76 17 17 14.76 17 12C17 9.24 14.76 7 12 7ZM2 13H4C4.55 13 5 12.55 5 12C5 11.45 4.55 11 4 11H2C1.45 11 1 11.45 1 12C1 12.55 1.45 13 2 13ZM20 13H22C22.55 13 23 12.55 23 12C23 11.45 22.55 11 22 11H20C19.45 11 19 11.45 19 12C19 12.55 19.45 13 20 13ZM11 2V4C11 4.55 11.45 5 12 5C12.55 5 13 4.55 13 4V2C13 1.45 12.55 1 12 1C11.45 1 11 1.45 11 2ZM11 20V22C11 22.55 11.45 23 12 23C12.55 23 13 22.55 13 22V20C13 19.45 12.55 19 12 19C11.45 19 11 19.45 11 20ZM5.99 4.58C5.6 4.19 4.96 4.19 4.58 4.58C4.19 4.97 4.19 5.61 4.58 5.99L5.64 7.05C6.03 7.44 6.67 7.44 7.05 7.05C7.43 6.66 7.44 6.02 7.05 5.64L5.99 4.58ZM18.36 16.95C17.97 16.56 17.33 16.56 16.95 16.95C16.56 17.34 16.56 17.98 16.95 18.36L18.01 19.42C18.4 19.81 19.04 19.81 19.42 19.42C19.81 19.03 19.81 18.39 19.42 18.01L18.36 16.95ZM19.42 5.99C19.81 5.6 19.81 4.96 19.42 4.58C19.03 4.19 18.39 4.19 18.01 4.58L16.95 5.64C16.56 6.03 16.56 6.67 16.95 7.05C17.34 7.43 17.98 7.44 18.36 7.05L19.42 5.99ZM7.05 18.36C7.44 17.97 7.44 17.33 7.05 16.95C6.66 16.56 6.02 16.56 5.64 16.95L4.58 18.01C4.19 18.4 4.19 19.04 4.58 19.42C4.97 19.8 5.61 19.81 5.99 19.42L7.05 18.36Z' />
    </svg>
  );
}

interface InlineSvgProps {
  svgName: InlineSvgNames;
  colour?: InlineSvgColours;
  className?: string;
}

export function InlineSvg({ svgName, colour, className }: InlineSvgProps) {
  let SvgComponent: (props: GeneralSvgProps) => JSX.Element;

  switch (svgName) {
    case InlineSvgNames.Moon:
      SvgComponent = Moon;
      break;

    case InlineSvgNames.Sun:
      SvgComponent = Sun;
      break;

    default:
      SvgComponent = Fallback;
      break;

  }

  let fillColour = '';

  switch (colour) {
    case (InlineSvgColours.Primary): {
      fillColour = 'fill-primary';
      break;
    }
    case (InlineSvgColours.Grey): {
      fillColour = 'fill-text-dark-600';
      break;
    }
    default: {
      console.debug('warning: define fill colour');
      break;
    }
  }

  return (
    <div className={className ? className : ''}>
      <SvgComponent colour={fillColour} />
    </div>
  );
}

type SvgSizes = 'sm';

interface SvgProps {
  svgName: SvgNames;
  size?: SvgSizes;
  sizeClass?: string;
  className?: string;
}

export default function Svg({ svgName, size, sizeClass: userDefinedSizeClass, className }: SvgProps) {
  function getSizeClass(size?: SvgSizes) {
    switch (size) {
      case 'sm':
        return 'w-[14px] h-[14px]';

      default:
        return 'w-[20px] h-[20px]';
    }
  }

  const sizeClass = userDefinedSizeClass ?? getSizeClass(size);
  let SvgComponent = '';
  let alt = '';

  switch (svgName) {
    case SvgNames.Check:
      SvgComponent = Check;
      alt = 'Check';
      break;

    case SvgNames.Cross:
      SvgComponent = Cross;
      alt = 'Cross';
      break;

    case SvgNames.Standby:
      SvgComponent = Standby;
      alt = 'Standby';
      break;

    case SvgNames.Miner:
      SvgComponent = Miner;
      alt = 'Miner';
      break;

    case SvgNames.Penalty:
      SvgComponent = Penalty;
      alt = 'Penalty';
      break;

    case SvgNames.Rhombus:
      SvgComponent = Rhombus;
      alt = 'Rhombus';
      break;

    case SvgNames.Search:
      SvgComponent = Search;
      alt = 'Search';
      break;

    case SvgNames.Loading:
      SvgComponent = Loading;
      alt = 'Loading data';
      break;

    case SvgNames.NoResult:
      SvgComponent = NoResult;
      alt = 'No Result';
      break;

    case SvgNames.NoResultDark:
      SvgComponent = NoResultDark;
      alt = 'No Result';
      break;

    case SvgNames.Info:
      SvgComponent = Info;
      alt = 'Info';
      break;

    case SvgNames.InfoDark:
      SvgComponent = InfoDark;
      alt = 'Info';
      break;

    case SvgNames.Logo:
      SvgComponent = Logo;
      alt = 'XDO Logo';
      break;
  }

  return (
    <img className={`inline-block ${sizeClass} ${className}`} src={SvgComponent} alt={alt} />
  );
}

export enum InlineSvgColours {
  Primary = 'primary',
  Grey = 'grey'
}

export enum InlineSvgNames {
  Moon = 'Moon',
  Sun = 'Sun',
}

export enum SvgNames {
  Check = 'Check',
  Cross = 'Cross',
  Miner = 'Miner',
  Penalty = 'Penalty',
  Standby = 'Standby',
  Rhombus = 'Rhombus',
  Search = 'Search',
  Loading = 'Loading',
  NoResult = 'NoResult',
  NoResultDark = 'NoResultDark',
  Info = 'Info',
  InfoDark = 'InfoDark',
  Logo = 'Logo',
}
