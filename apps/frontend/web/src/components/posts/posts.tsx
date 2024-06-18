import { NewPost } from '../icons/new-post';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Post } from './post';

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
  return (
    <Tabs defaultValue="my-posts" className="w-full flex items-center flex-col">
      <TabsList className="mx-auto">
        <TabsTrigger value="my-posts">My posts</TabsTrigger>
        <TabsTrigger value="discover">Discover</TabsTrigger>
      </TabsList>
      <div className="relative">
        <TabsContent value="my-posts">
          {config.map((post, i) => (
            <div className="flex flex-col ">
              <Post isMy={post.isMy} address={post.address} />
              {i < config.length - 1 && <div className="w-full h-[1px] my-4 bg-gray-blue" />}
            </div>
          ))}
          <Button className="rounded-full fixed top-0 left-0 p-3 shadow-glow">
            <NewPost />
          </Button>
        </TabsContent>
        <TabsContent value="discover">Change your password here.</TabsContent>
      </div>
    </Tabs>
  );
};
