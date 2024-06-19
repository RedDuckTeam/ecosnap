import { PublicKey } from '@solana/web3.js';

import { PostAsset } from './post-asset';

import { Button } from '../ui/button';

import { generateBlockies } from '@/lib/blockies';
import { getMediaType, shortenAddress } from '@/lib/utils';
import { IGcsBody } from '@/api/get/gcs.ts';

export const Post = ({ gcs, isMy }: { gcs: IGcsBody; isMy: boolean }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {generateBlockies(new PublicKey(gcs.user))}
          <p>{shortenAddress(gcs.user)}</p>
        </div>
        <div className="flex items-center gap-3">
          <p className="text-[12px] font-medium text-gray">15 min</p>
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
        <Button variant="dark" className="text-primary">
          👍 {gcs.daoVotes.for}
        </Button>
        <Button variant="dark" className="text-danger">
          👎 {gcs.daoVotes.against}
        </Button>
      </div>
    </div>
  );
};
