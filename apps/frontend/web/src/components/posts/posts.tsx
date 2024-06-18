import { useMemo } from 'react';
import { NavLink } from 'react-router-dom';

import { Post } from './post';

import { NewPost } from '../icons/new-post';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

import { routes } from '@/router';

const config = [
  {
    isMy: true,
    address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7',
  },
  {
    isMy: false,
    address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7',
  },
  {
    isMy: false,
    address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7',
  },
  {
    isMy: false,
    address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7',
  },
];

export const PostsTabs = () => {
  const myPosts = useMemo(() => {
    return config.filter((post) => post.isMy);
  }, []);

  const discoverPosts = useMemo(() => {
    return config.filter((post) => !post.isMy);
  }, []);

  return (
    <Tabs defaultValue="my-posts" className="w-full  flex items-center flex-col">
      <TabsList className="mx-auto">
        <TabsTrigger value="my-posts">My posts</TabsTrigger>
        <TabsTrigger value="discover">Discover</TabsTrigger>
      </TabsList>

      <TabsContent value="my-posts">
        {myPosts.map((post, i) => (
          <div className="flex flex-col ">
            <Post isMy={post.isMy} address={post.address} />
            {i < myPosts.length - 1 && <div className="w-full h-[1px] my-4 bg-gray-blue" />}
          </div>
        ))}
      </TabsContent>
      <TabsContent value="discover">
        {discoverPosts.map((post, i) => (
          <div className="flex flex-col ">
            <Post isMy={post.isMy} address={post.address} />
            {i < discoverPosts.length - 1 && <div className="w-full h-[1px] my-4 bg-gray-blue" />}
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
