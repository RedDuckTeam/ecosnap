import { restrictions, single, team } from './config';
import { PointsItem } from './points-item';

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';

export const RewardSystem = () => {
  return (
    <div className="flex  xl:max-w-[430px] xl:rounded-[16px] xl:p-6 right-4 bg-gray-blue top-0 flex-col gap-4">
      <h1 className="font-semibold text-[18px]">Reward system</h1>
      <h2 className="text-[16px] font-semibold">Points</h2>
      <div className="grid grid-cols-2 gap-4">
        <PointsItem label="First 10 garbage/day" value={'25'} />
        <PointsItem label="Every next garbage" value={'10'} />
        <PointsItem label="Team participation" value={'200'} />
      </div>
      <h2 className="text-[16px] font-semibold">NFTs</h2>
      <div className="flex items-center gap-4">
        <img src="/images/bayc.png" alt="BAYC" />
        <p className="font-medium text-[14px]">
          With every Level Up you can get random NFT which is selected by our system :{')'}
        </p>
      </div>
      <Accordion type="multiple">
        <AccordionItem value="item-1">
          <AccordionTrigger>How to earn points?</AccordionTrigger>
          <AccordionContent className="gap-4 flex flex-col">
            <div>
              <Badge>Single</Badge>
            </div>
            <ul className="px-0.5">
              {single.map((item, i) => (
                <li key={item} className="font-medium leading-[20px] text-[14px]">
                  {i + 1}. {item}
                </li>
              ))}
            </ul>
            <div>
              <Badge>Team</Badge>
            </div>
            <ul className="px-0.5">
              {team.map((item, i) => (
                <li key={item} className="font-medium leading-[20px] text-[14px]">
                  {i + 1}. {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Restrictions</AccordionTrigger>
          <AccordionContent>
            <ul className="px-0.5">
              {restrictions.map((item, i) => (
                <li key={item} className="font-medium leading-[20px] text-[14px]">
                  {i + 1}. {item}
                </li>
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
