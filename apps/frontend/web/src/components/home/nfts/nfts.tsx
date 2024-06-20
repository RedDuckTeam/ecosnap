import { useWallet } from '@solana/wallet-adapter-react';

import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGetUserAchievements } from '@/hooks/queries/use-get-user-achievements';
import { useMintAchievement } from '@/hooks/mutations/solana/use-mint-achievement';

export const NFTs = () => {
  const { publicKey } = useWallet();
  const { data } = useGetUserAchievements();
  const { mutateAsync } = useMintAchievement();

  console.log('nftData', { data });
  return (
    <div className="flex flex-col gap-4 w-full">
      <h2 className="text-light font-semibold text-[16px]">NFT’s Earned</h2>
      <div className={`${publicKey ? '' : 'grayscale-[95%]'} grid grid-cols-2 gap-y-4`}>
        {data &&
          data.map((nft) =>
            nft.isMinted ? (
              <div key={nft.id} className="flex items-end">
                <img src={nft.achievement.imageUrl} alt="girl" className="w-full odd:-translate-x-[15%]" />
              </div>
            ) : (
              <Popover key={nft.id}>
                <PopoverTrigger>
                  <div className="flex items-end">
                    <img
                      src={nft.achievement.imageUrl}
                      alt="girl"
                      className="w-full odd:-translate-x-[15%] grayscale"
                    />
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
                              mutateAsync({
                                achievementId: nft.achievement.id,
                                merkleTreeId: nft.merkleTreeId,
                                proofs: nft.proofs,
                              });
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
            )
          )}
      </div>
    </div>
  );
};
