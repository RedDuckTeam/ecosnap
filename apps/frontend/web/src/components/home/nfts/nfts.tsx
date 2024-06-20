import { useWallet } from '@solana/wallet-adapter-react';

import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const nfts = [
  {
    id: 1,
    imageUrl: '/images/girl_01.png',
    isMinted: false,
  },
  {
    id: 2,
    imageUrl: '/images/girl_02.png',
    isMinted: true,
  },
  {
    id: 3,
    imageUrl: '/images/girl_03.png',
    isMinted: true,
  },
  {
    id: 4,
    imageUrl: '/images/girl_04.png',
    isMinted: false,
  },
];

export const NFTs = () => {
  const { publicKey } = useWallet();
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-light font-semibold text-[16px]">NFT’s Earned</h2>
      <div className={`${publicKey ? '' : 'grayscale-[95%]'} grid grid-cols-2 gap-y-4`}>
        {nfts.map((nft) =>
          nft.isMinted ? (
            <div key={nft.id} className="flex items-end">
              <img src={nft.imageUrl} alt="girl" className="w-full odd:-translate-x-[15%]" />
            </div>
          ) : (
            <Popover key={nft.id}>
              <PopoverTrigger>
                <div className="flex items-end">
                  <img src={nft.imageUrl} alt="girl" className="w-full odd:-translate-x-[15%] grayscale" />
                </div>
              </PopoverTrigger>
              <PopoverContent>
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <CommandItem value={nft.id.toString()} className="!bg-transparent">
                        <Button
                          className="w-full"
                          onClick={() => {
                            alert(nft.id);
                          }}
                        >
                          Mint
                        </Button>
                      </CommandItem>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          ),
        )}
      </div>
    </div>
  );
};
