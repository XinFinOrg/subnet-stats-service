import Blocks from "@/components/Blocks";
import Card from "@/components/card/Card";
import InfoCards from "@/components/info-cards/InfoCards";

export default function Home() {
  return (
    <div className='grid gap-6 grid-col-1'>
      <Card>
        <h1 className='pb-6 text-3xl font-bold'>Subnet Blockchain</h1>
        <Blocks />
      </Card>
      {/* <Card>
        <h1 className='pb-6 text-3xl font-bold'>Copy at the parent chain</h1>
        <Blocks />
      </Card> */}

      <InfoCards />
    </div>
  );
}