import { useQuery } from '@tanstack/react-query';

import type { Item } from '@/hooks/queries/use-get-items';
import { timeout } from '@/lib/timeout';

export type MyItem = Item & {
  isRedeemed: boolean;
};

const myItems: MyItem[] = [
  {
    id: '3',
    name: 'Eco leather backpack',
    description: 'A cup of coffee',
    price: 1077,
    imageUrl: 'https://i.imgur.com/N3xZiLL.png',
    isRedeemed: false,
  },
  {
    id: '1',
    name: 'Cup of coffee',
    description: 'A cup of coffee',
    price: 20,
    imageUrl: 'https://i.imgur.com/0eYvKNy.png',
    isRedeemed: true,
  },
];

export const useGetMyItems = () => {
  return useQuery({
    queryKey: ['my-items'],
    queryFn: async () => {
      await timeout(1000);
      return myItems;
    },
  });
};
