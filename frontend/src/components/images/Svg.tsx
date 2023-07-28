import Check from '@/assets/check.svg';
import Cross from '@/assets/cross.svg';
import InfoDark from '@/assets/info-dark.svg';
import Info from '@/assets/info.svg';
import Loading from '@/assets/loading.svg';
import Menu from '@/assets/menu.svg';
import Miner from '@/assets/miner.svg';
import NoResultDark from '@/assets/no-results-dark.svg';
import NoResult from '@/assets/no-results.svg';
import Penalty from '@/assets/penalty.svg';
import Refresh from '@/assets/refresh.svg';
import Rhombus from '@/assets/rhombus.svg';
import Search from '@/assets/search.svg';
import Standby from '@/assets/standby.svg';
import Logo from '@/assets/xdc-logo.svg';

interface GeneralSvgProps {
  colour: string;
  strokeColour?: string;
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

function Copy({ colour }: GeneralSvgProps) {
  return (
    <svg width="16px" height="16px" className={colour} viewBox="0 -0.5 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
      <g id="SVGRepo_iconCarrier">
        <path d="M8.25005 8.5C8.25005 8.91421 8.58584 9.25 9.00005 9.25C9.41426 9.25 9.75005 8.91421 9.75005 8.5H8.25005ZM9.00005 8.267H9.75006L9.75004 8.26283L9.00005 8.267ZM9.93892 5.96432L10.4722 6.49171L9.93892 5.96432ZM12.2311 5V4.24999L12.2269 4.25001L12.2311 5ZM16.269 5L16.2732 4.25H16.269V5ZM18.5612 5.96432L18.0279 6.49171V6.49171L18.5612 5.96432ZM19.5 8.267L18.75 8.26283V8.267H19.5ZM19.5 12.233H18.75L18.7501 12.2372L19.5 12.233ZM18.5612 14.5357L18.0279 14.0083L18.5612 14.5357ZM16.269 15.5V16.25L16.2732 16.25L16.269 15.5ZM16 14.75C15.5858 14.75 15.25 15.0858 15.25 15.5C15.25 15.9142 15.5858 16.25 16 16.25V14.75ZM9.00005 9.25C9.41426 9.25 9.75005 8.91421 9.75005 8.5C9.75005 8.08579 9.41426 7.75 9.00005 7.75V9.25ZM8.73105 8.5V7.74999L8.72691 7.75001L8.73105 8.5ZM6.43892 9.46432L6.97218 9.99171L6.43892 9.46432ZM5.50005 11.767H6.25006L6.25004 11.7628L5.50005 11.767ZM5.50005 15.734L6.25005 15.7379V15.734H5.50005ZM8.73105 19L8.72691 19.75H8.73105V19ZM12.769 19V19.75L12.7732 19.75L12.769 19ZM15.0612 18.0357L14.5279 17.5083L15.0612 18.0357ZM16 15.733H15.25L15.2501 15.7372L16 15.733ZM16.75 15.5C16.75 15.0858 16.4143 14.75 16 14.75C15.5858 14.75 15.25 15.0858 15.25 15.5H16.75ZM9.00005 7.75C8.58584 7.75 8.25005 8.08579 8.25005 8.5C8.25005 8.91421 8.58584 9.25 9.00005 9.25V7.75ZM12.7691 8.5L12.7732 7.75H12.7691V8.5ZM15.0612 9.46432L15.5944 8.93694V8.93694L15.0612 9.46432ZM16.0001 11.767L15.2501 11.7628V11.767H16.0001ZM15.2501 15.5C15.2501 15.9142 15.5858 16.25 16.0001 16.25C16.4143 16.25 16.7501 15.9142 16.7501 15.5H15.2501ZM9.75005 8.5V8.267H8.25005V8.5H9.75005ZM9.75004 8.26283C9.74636 7.60005 10.0061 6.96296 10.4722 6.49171L9.40566 5.43694C8.65985 6.19106 8.24417 7.21056 8.25006 8.27117L9.75004 8.26283ZM10.4722 6.49171C10.9382 6.02046 11.5724 5.75365 12.2352 5.74999L12.2269 4.25001C11.1663 4.25587 10.1515 4.68282 9.40566 5.43694L10.4722 6.49171ZM12.2311 5.75H16.269V4.25H12.2311V5.75ZM16.2649 5.74999C16.9277 5.75365 17.5619 6.02046 18.0279 6.49171L19.0944 5.43694C18.3486 4.68282 17.3338 4.25587 16.2732 4.25001L16.2649 5.74999ZM18.0279 6.49171C18.494 6.96296 18.7537 7.60005 18.7501 8.26283L20.25 8.27117C20.2559 7.21056 19.8402 6.19106 19.0944 5.43694L18.0279 6.49171ZM18.75 8.267V12.233H20.25V8.267H18.75ZM18.7501 12.2372C18.7537 12.8999 18.494 13.537 18.0279 14.0083L19.0944 15.0631C19.8402 14.3089 20.2559 13.2894 20.25 12.2288L18.7501 12.2372ZM18.0279 14.0083C17.5619 14.4795 16.9277 14.7463 16.2649 14.75L16.2732 16.25C17.3338 16.2441 18.3486 15.8172 19.0944 15.0631L18.0279 14.0083ZM16.269 14.75H16V16.25H16.269V14.75ZM9.00005 7.75H8.73105V9.25H9.00005V7.75ZM8.72691 7.75001C7.6663 7.75587 6.65146 8.18282 5.90566 8.93694L6.97218 9.99171C7.43824 9.52046 8.07241 9.25365 8.73519 9.24999L8.72691 7.75001ZM5.90566 8.93694C5.15985 9.69106 4.74417 10.7106 4.75006 11.7712L6.25004 11.7628C6.24636 11.1001 6.50612 10.463 6.97218 9.99171L5.90566 8.93694ZM4.75005 11.767V15.734H6.25005V11.767H4.75005ZM4.75006 15.7301C4.73847 17.9382 6.51879 19.7378 8.72691 19.75L8.7352 18.25C7.35533 18.2424 6.2428 17.1178 6.25004 15.7379L4.75006 15.7301ZM8.73105 19.75H12.769V18.25H8.73105V19.75ZM12.7732 19.75C13.8338 19.7441 14.8486 19.3172 15.5944 18.5631L14.5279 17.5083C14.0619 17.9795 13.4277 18.2463 12.7649 18.25L12.7732 19.75ZM15.5944 18.5631C16.3402 17.8089 16.7559 16.7894 16.75 15.7288L15.2501 15.7372C15.2537 16.3999 14.994 17.037 14.5279 17.5083L15.5944 18.5631ZM16.75 15.733V15.5H15.25V15.733H16.75ZM9.00005 9.25H12.7691V7.75H9.00005V9.25ZM12.7649 9.24999C13.4277 9.25365 14.0619 9.52046 14.5279 9.99171L15.5944 8.93694C14.8486 8.18282 13.8338 7.75587 12.7732 7.75001L12.7649 9.24999ZM14.5279 9.99171C14.994 10.463 15.2537 11.1001 15.2501 11.7628L16.75 11.7712C16.7559 10.7106 16.3402 9.69106 15.5944 8.93694L14.5279 9.99171ZM15.2501 11.767V15.5H16.7501V11.767H15.2501Z"></path>
      </g>
    </svg>
  );
}

function Arrow({ colour }: GeneralSvgProps) {
  return (
    <svg className={colour} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M11.9758 8.6252C12.0758 8.6252 12.1674 8.64186 12.2508 8.6752C12.3341 8.70853 12.4174 8.76686 12.5008 8.8502L17.4508 13.8002C17.6008 13.9502 17.6758 14.1252 17.6758 14.3252C17.6758 14.5252 17.6008 14.7002 17.4508 14.8502C17.3008 15.0002 17.1216 15.0752 16.9133 15.0752C16.7049 15.0752 16.5258 15.0002 16.3758 14.8502L11.9758 10.4502L7.57578 14.8502C7.42578 15.0002 7.25078 15.0752 7.05078 15.0752C6.85078 15.0752 6.67578 15.0002 6.52578 14.8502C6.37578 14.7002 6.30078 14.521 6.30078 14.3127C6.30078 14.1044 6.37578 13.9252 6.52578 13.7752L11.4508 8.8502C11.5341 8.76686 11.6174 8.70853 11.7008 8.6752C11.7841 8.64186 11.8758 8.6252 11.9758 8.6252Z" />
    </svg>
  );
}

interface InlineSvgProps {
  svgName: InlineSvgNames;
  colour?: InlineSvgColours;
  strokeColour?: InlineSvgStrokeColours;
  className?: string;
}

export function InlineSvg({ svgName, colour, className, strokeColour }: InlineSvgProps) {
  let SvgComponent: (props: GeneralSvgProps) => JSX.Element;

  switch (svgName) {
    case InlineSvgNames.Moon:
      SvgComponent = Moon;
      break;

    case InlineSvgNames.Sun:
      SvgComponent = Sun;
      break;

    case InlineSvgNames.Copy:
      SvgComponent = Copy;
      break;

    case InlineSvgNames.Arrow:
      SvgComponent = Arrow;
      break;

    default:
      SvgComponent = Fallback;
      break;

  }

  let strokeColourClass = '';

  switch (strokeColour) {
    case (InlineSvgStrokeColours.Default): {
      strokeColourClass = 'stroke-text-dark-600 dark:stroke-text-white';
      break;
    }
  }

  let fillColour = '';

  switch (colour) {
    case (InlineSvgColours.Default): {
      fillColour = 'fill-text-dark-600 dark:fill-text-white';
      break;
    }
    case (InlineSvgColours.Primary): {
      fillColour = 'fill-primary';
      break;
    }
    case (InlineSvgColours.Grey): {
      fillColour = 'fill-text-dark-600';
      break;
    }
    case (InlineSvgColours.White): {
      fillColour = 'fill-text-white';
      break;
    }
  }

  return (
    <div className={className ? className : ''}>
      <SvgComponent colour={fillColour} strokeColour={strokeColourClass} />
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

    case SvgNames.Menu:
      SvgComponent = Menu;
      alt = 'Menu';
      break;

    case SvgNames.Refresh:
      SvgComponent = Refresh;
      alt = 'Refresh';
      break;
  }

  return (
    <img className={`inline-block ${sizeClass ? sizeClass : ''} ${className ? className : ''}`} src={SvgComponent} alt={alt} />
  );
}

export enum InlineSvgColours {
  Default = 'Default',
  Primary = 'Primary',
  Grey = 'Grey',
  White = 'White',
}

export enum InlineSvgStrokeColours {
  Default = 'Default',
}

export enum InlineSvgNames {
  Moon = 'Moon',
  Sun = 'Sun',
  Copy = 'Copy',
  Arrow = 'Arrow',
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
  Menu = 'Menu',
  Refresh = 'Refresh',
}
