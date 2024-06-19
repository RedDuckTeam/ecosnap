import { useQuery } from '@tanstack/react-query';

import { timeout } from '@/lib/timeout';

const participants = [
  { address: '2WtZPexHzuSineMWbibn9dfCNwd1NRFApBZoZjiN3XRf' },
  { address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7' },
  { address: '2bzqNjoUqFEDouaBK3PXHDWzWz3FW9QWbFZoNKrkoB7z' },
  { address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7' },
  { address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7' },
  { address: '2hgvG2nXLYTd1paibNbFUSWKBSUxGtJcWRwEEfgjcyEX' },
  { address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7' },
  { address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7' },
  { address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7' },
  { address: '9KHATfhmNJKRjW1P7aUn8GGaA3cijxXBCFtZkBhM6we1' },
  { address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7' },
  { address: 'F7bVLTpjkhR79R1oooGxhMDenKvuM8SZs9NUCCmmTCF7' },
];

export const useGetParticipants = (eventId: string | undefined) => {
  return useQuery({
    queryKey: ['participants', eventId],
    enabled: !!eventId,
    queryFn: async () => {
      await timeout(1000);
      if (!eventId) return null;
      return participants;
    },
  });
};
