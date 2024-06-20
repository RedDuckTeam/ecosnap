import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { PointsItem } from './points-item';

import { RewardSystem } from '../reward-system/reward-system';

import { Help } from '@/components/icons/help';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { useGetUser } from '@/hooks/queries/use-get-user';
import { routes } from '@/router';

export const Points = () => {
  const navigate = useNavigate();
  const [isDesctiptionOpen, setDescriptionOpen] = useState(false);
  const user = useGetUser();

  console.log('user', { user });
  return (
    <>
      <Dialog open={isDesctiptionOpen} onOpenChange={setDescriptionOpen}>
        <DialogContent className="max-h-[calc(100vh-80px)] overflow-y-visible">
          <RewardSystem />
        </DialogContent>
      </Dialog>
      <div className="flex flex-col gap-4 w-full">
        <div className="flex items-center gap-2.5">
          <h2 className="text-light font-semibold text-[16px]">Points earned</h2>
          <button className="xl:hidden" onClick={() => setDescriptionOpen(true)}>
            <Help />
          </button>
        </div>
        <div className="flex gap-2">
          <PointsItem
            label="Earned Points"
            value={
              <div className="flex items-center gap-1">
                <img src="/images/star.png" alt="star" />
                <p>{user.data?.points ?? 0}</p>
              </div>
            }
          />
          <PointsItem label="Garbage" value={(user.data?.garbageCollects ?? 0).toString()} />
          <PointsItem label="Level" value={Math.floor((user?.data?.points ?? 0) / 100).toString()} />
        </div>
        <div className="flex items-center gap-8">
          <div className="flex gap-2 flex-col w-full">
            <div className="flex items-center justify-between gap-3.5  text-[16px] font-medium">
              <p className="text-gray">Today removed</p>
              <p>0/10</p>
            </div>
            <Progress value={0} />
          </div>
          <div className="flex gap-2 flex-col w-full">
            <div className="flex items-center justify-between gap-3.5  text-[16px] font-medium">
              <p className="text-gray">Lvl up</p>
              <p>{(user?.data?.points ?? 0) - Math.floor((user?.data?.points ?? 0) / 100) * 100}/100</p>
            </div>
            <Progress value={(user?.data?.points ?? 0) - Math.floor((user?.data?.points ?? 0) / 100) * 100} />
          </div>
        </div>
      </div>
      <div className="flex justify-center">
        <Button onClick={() => navigate(routes.events)} className="px-6 py-4">
          Earn points
        </Button>
      </div>
    </>
  );
};
