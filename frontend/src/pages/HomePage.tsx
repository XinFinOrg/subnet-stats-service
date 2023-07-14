import InfoCards from '@/components/info-cards/InfoCards';
import BlockCards from '@/components/info-list/components/block-cards/BlockCards';

export default function HomePage() {

  return (
    <div className='grid gap-6 grid-col-1'>
      <BlockCards />
      <InfoCards />
    </div>
  );
}
