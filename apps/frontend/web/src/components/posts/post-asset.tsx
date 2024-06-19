import { Play } from 'lucide-react';
import { useState } from 'react';

import { Dialog, DialogContent } from '../ui/dialog';

type Props = {
  type: 'image' | 'video';
  src: string;
};

export const PostAsset = ({ src, type }: Props) => {
  const [assetClicked, setAssetClicked] = useState<null | { type: 'image' | 'video'; src: string }>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  return (
    <>
      <Dialog open={Boolean(assetClicked)} onOpenChange={(val) => setAssetClicked(val ? assetClicked : null)}>
        <DialogContent className="[&_path]:stroke-white p-4">
          {assetClicked && assetClicked.type === 'image' ? (
            <img src={assetClicked?.src} alt="" className="rounded-[16px] w-full" />
          ) : (
            <video src={assetClicked?.src} controls className="rounded-[16px] w-full" />
          )}
        </DialogContent>
      </Dialog>
      <button onClick={() => setAssetClicked({ src, type })}>
        <div
          className={`relative group rounded-[16px] h-auto aspect-square ${isLoading || isError ? 'bg-gray-blue' : ''}  max-h-full`}
        >
          {type === 'image' ? (
            <img
              onLoad={() => {
                setIsLoading(false);
                setIsError(false);
              }}
              onError={() => {
                setIsLoading(false);
                setIsError(true);
              }}
              src={src}
              className={`h-auto rounded-[16px] ${isLoading || isError ? 'hidden' : 'block'} aspect-square max-w-full`}
              alt=""
            />
          ) : (
            <>
              <video
                onCanPlay={() => {
                  setIsLoading(false);
                  setIsError(false);
                }}
                onLoad={() => {
                  setIsLoading(false);
                  setIsError(false);
                }}
                onError={() => {
                  setIsLoading(false);
                  setIsError(true);
                }}
                src={src}
                preload="metadata"
                className={`h-auto  relative flex justify-center items-center rounded-[16px] ${isLoading || isError ? 'hidden' : 'block'} aspect-square object-cover max-w-full`}
              />

              <Play className="absolute fill-light transition-all group-hover:scale-110 top-1/2 left-1/2 w-10 h-10 -translate-x-1/2 -translate-y-1/2" />
            </>
          )}
        </div>
      </button>
    </>
  );
};
