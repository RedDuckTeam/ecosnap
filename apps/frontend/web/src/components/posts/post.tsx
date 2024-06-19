import { useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useCallback, useMemo } from 'react';

import { PostAsset } from './post-asset';

import { Button } from '../ui/button';
import { useToast } from '../ui/use-toast';

import type { IGcsBody } from '@/api/get/gcs.ts';
import { CastVoteDirection } from '@/api/post/vote';
import { useDaoVote } from '@/hooks/mutations/use-dao-vote';
import { generateBlockies } from '@/lib/blockies';
import { formatDate, formatTime, getMediaType, shortenAddress } from '@/lib/utils';

export const Post = ({ gcs, isMy }: { gcs: IGcsBody; isMy: boolean }) => {
  const { mutateAsync: vote } = useDaoVote();
  const { publicKey } = useWallet();

  const { toast } = useToast();

  const handleVote = useCallback(
    async (voteDirection: CastVoteDirection) => {
      try {
        await vote({ gcId: gcs.id, voteDirection });
        toast({
          variant: 'success',
          title: 'Successfully voted',
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Failed to vote',
          description: error instanceof Error ? error.message : 'An error occurred',
        });
      }
    },
    [gcs.id, toast, vote]
  );

  const userVote = useMemo(() => {
    if (!publicKey) return null;
    console.log(gcs);

    return gcs.votes.find((vote) => new PublicKey(vote.user).toString() === publicKey.toString()) ?? null;
  }, [gcs.votes, publicKey]);
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {generateBlockies(new PublicKey(gcs.user))}
          <p>{shortenAddress(gcs.user)}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[12px] font-medium text-gray">
            {formatDate(gcs.createdAt)} {formatTime(gcs.createdAt.toString())}
          </p>
          {isMy && <Button className="p-2 h-4">...</Button>}
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <p className="font-medium">{gcs.description}</p>
        <div className="grid md:grid-cols-3 grid-cols-2 gap-2">
          {gcs.files.map((file) => {
            return <PostAsset src={`https://akrd.net/${file.uri}`} type={getMediaType(file.fileExtension.trim())} />;
          })}
        </div>
      </div>
      <div className="flex gap-1 items-center">
        <Button
          onClick={() => handleVote(CastVoteDirection.FOR)}
          disabled={!publicKey || !!userVote}
          variant={userVote?.direction === CastVoteDirection.FOR ? 'default' : 'dark'}
          className={`${userVote?.direction === CastVoteDirection.FOR ? 'rounded-md' : 'text-primary'}`}
        >
          👍 {gcs.daoVotes.for}
        </Button>
        <Button
          onClick={() => handleVote(CastVoteDirection.AGAINST)}
          disabled={!publicKey || !!userVote}
          variant={userVote?.direction === CastVoteDirection.AGAINST ? 'danger' : 'dark'}
          className={`${userVote?.direction === CastVoteDirection.AGAINST ? 'rounded-md' : 'text-danger'}`}
        >
          👎 {gcs.daoVotes.against}
        </Button>
      </div>
    </div>
  );
};
