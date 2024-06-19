import { useWallet } from '@solana/wallet-adapter-react';
import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import { Post } from './post';

import { Message } from '../icons/message';
import { NewPost } from '../icons/new-post';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

import { useGetUserGcs } from '@/hooks/queries/use-get-user-gcs.ts';
import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';
import { routes } from '@/router';
import { useGetGcs } from '@/hooks/queries/use-get-gcs.ts';

export const PostsTabs = () => {
  const { publicKey } = useWallet();
  const posts = useGetGcs();
  const userPosts = useGetUserGcs();

  const allPosts = useMemo(() => {
    return posts?.data?.gcs ?? [];
  }, [posts]);

  const discoverPosts = useMemo(() => {
    return userPosts?.data?.gcs ?? [];
  }, [userPosts]);

  return (
    <Tabs defaultValue="my-posts" className="w-full  flex items-center flex-col">
      <TabsList className="mx-auto">
        <TabsTrigger value="my-posts">My posts</TabsTrigger>
        <TabsTrigger value="discover">Discover</TabsTrigger>
      </TabsList>

      <TabsContent value="my-posts" className="gap-10 flex flex-col">
        <div className="w-full rounded-[24px] p-6 flex bg-gray-blue flex-col gap-4">
          <div className="flex items-center gap-2">
            {generateBlockies(publicKey, 14)}
            <p>{shortenAddress(publicKey?.toString() || '')}</p>
          </div>
          <div className="flex gap-6 items-center">
            <div className="flex items-center gap-1">
              <Message className="w-4 h-4 [&_path]:fill-primary" />
              <p className="font-medium text-[16px] text-gray">Posts</p>
              <p className="font-semibold text-[16px]">15</p>
            </div>
            <div className="flex items-center gap-1">
              <img src="/images/star.png" alt="star" />
              <p className="font-medium text-[16px] text-gray">Points</p>
              <p className="font-semibold text-[16px]">1452</p>
            </div>
          </div>
        </div>
        {discoverPosts.map((post, i) => (
          <div className="flex flex-col ">
            <Post gcs={post} isMy={false} />
            {i < allPosts.length - 1 && <div className="w-full h-[1px] my-4 bg-gray-blue" />}
          </div>
        ))}
      </TabsContent>
      <TabsContent value="discover">
        {allPosts.map((post, i) => (
          <div className="flex flex-col ">
            <Post key={i} gcs={post} isMy={false} />
            {i < allPosts.length - 1 && <div className="w-full h-[1px] my-4 bg-gray-blue" />}
          </div>
        ))}
      </TabsContent>
      <NavLink to={routes.newPost}>
        <Button className="rounded-full xl:hidden fixed bottom-[150px] lg:right-[20%] right-[10%]  p-3 shadow-glow">
          <NewPost />
        </Button>
      </NavLink>
    </Tabs>
  );
};
