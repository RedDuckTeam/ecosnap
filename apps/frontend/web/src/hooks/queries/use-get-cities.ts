import { useQuery } from '@tanstack/react-query';

import { getEvents } from '@/api/get/events';

export type City = {
  id: string;
  name: string;
};

// const cities: City[] = [
//   {
//     id: '1',
//     name: 'Kharkiv, Ukraine',
//   },
//   {
//     id: '2',
//     name: 'Kyiv, Ukraine',
//   },
//   {
//     id: '3',
//     name: 'Lviv, Ukraine',
//   },
//   {
//     id: '4',
//     name: 'Odessa, Ukraine',
//   },
//   {
//     id: '5',
//     name: 'Dnipro, Ukraine',
//   },
//   {
//     id: '6',
//     name: 'Donetsk, Ukraine',
//   },
//   {
//     id: '7',
//     name: 'Zaporizhzhia, Ukraine',
//   },
//   {
//     id: '8',
//     name: 'Kryvyi Rih, Ukraine',
//   },
//   {
//     id: '9',
//     name: 'Mykolaiv, Ukraine',
//   },
//   {
//     id: '10',
//     name: 'Mariupol, Ukraine',
//   },
// ];

export const useGetCities = () => {
  return useQuery({
    queryKey: ['cities'],
    queryFn: async () => {
      const events = await getEvents();

      return Array.from(new Set(events.data?.events.map((event) => event.city)));
    },
  });
};
