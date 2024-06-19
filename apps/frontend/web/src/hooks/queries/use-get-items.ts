import { useQuery } from '@tanstack/react-query';

import { timeout } from '@/lib/timeout';

export type Item = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

const items: Item[] = [
  {
    id: '1',
    name: 'Cup of coffee',
    description: 'A cup of coffee',
    price: 20,
    imageUrl: 'https://i.imgur.com/0eYvKNy.png',
  },
  {
    id: '2',
    name: '2 cinema tickets',
    description: 'A cup of coffee',
    price: 500,
    imageUrl: 'https://i.imgur.com/MwHJgo2.png',
  },
  {
    id: '3',
    name: 'Eco leather backpack',
    description: 'A cup of coffee',
    price: 1077,
    imageUrl: 'https://i.imgur.com/N3xZiLL.png',
  },
  {
    id: '4',
    name: '2 aquapark tickets',
    description: 'A cup of coffee',
    price: 1200,
    imageUrl: 'https://i.imgur.com/CdRXaCV.png',
  },
];

export const useGetItems = () => {
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      await timeout(1000);
      return items;
    },
  });
};
