// import { RewardSystem } from '@/components/home/reward-system/reward-system';
import { PostsTabs } from '@/components/posts/posts';

export default function Posts() {
  return (
    <div className="flex gap-[88px]">
      <main className={`flex flex-1 container xl:ml-[268px] max-w-[560px] flex-col items-center gap-6 p-4`}>
        <PostsTabs />
      </main>
      {/* <div className="max-xl:hidden xl:mr-4">
        <RewardSystem />
      </div> */}
    </div>
  );
}
