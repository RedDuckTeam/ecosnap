import { useWallet } from '@solana/wallet-adapter-react';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { AddPhoto } from '@/components/icons/add-photo';
import { ArrowCircleLeft } from '@/components/icons/arrow-circle-left';
import { Close } from '@/components/icons/close';
import { TakePhoto } from '@/components/icons/take-photo';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useCreatePost } from '@/hooks/mutations/use-create-post';
import { generateBlockies } from '@/lib/blockies';
import { shortenAddress } from '@/lib/utils';
import { routes } from '@/router';
import usePhotoStore from '@/store/photo';

export default function NewPost() {
  const { publicKey } = useWallet();

  const [isSuccessOpen, setSuccessOpen] = useState(false);

  const { mutateAsync: createPost, isPending } = useCreatePost();

  const { files: currentFiles, setFiles, comment, setComment } = usePhotoStore();

  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const loadPreviews = async () => {
      const previewPromises = currentFiles
        .filter((file) => file.type.startsWith('image/') || file.type.startsWith('video/'))
        .map((file) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
              resolve(reader.result as string);
            };
          });
        });
      const loadedPreviews = await Promise.all(previewPromises);
      setPreviews(loadedPreviews);
    };

    void loadPreviews();
  }, [currentFiles]);

  const { toast } = useToast();

  const handleUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files) return;

      if (currentFiles.length + files.length > 10) {
        toast({
          variant: 'destructive',
          title: 'You can only upload up to 10 files.',
        });
        return;
      }

      const filesToAdd = Array.from(files);

      setFiles([...currentFiles, ...filesToAdd]);
    },
    [currentFiles, setFiles, toast],
  );

  const handleDelete = useCallback(
    (index: number) => {
      const updatedFiles = currentFiles.filter((_, i) => i !== index);
      setFiles(updatedFiles);
    },
    [currentFiles, setFiles],
  );

  const navigate = useNavigate();

  const handleSuccessClose = useCallback(() => {
    setSuccessOpen(false);
    setComment('');
    setFiles([]);
    navigate(routes.posts);
  }, [navigate, setComment, setFiles]);

  const handlePost = useCallback(async () => {
    if (isPending) return;
    try {
      await createPost({ description: comment, files: currentFiles });
      setSuccessOpen(true);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to create post',
        description: error instanceof Error ? error.message : 'An error occurred',
      });
    }
  }, [comment, createPost, currentFiles, toast, isPending]);

  return (
    <div className="flex flex-col max-w-[560px] mx-auto px-4">
      <Dialog open={isSuccessOpen} onOpenChange={(val) => (val ? setSuccessOpen(val) : handleSuccessClose())}>
        <DialogContent className="text-center gap-2">
          <h1 className="font-semibold text-[16px]">Post created</h1>
          <p className="text-[14px] font-medium text-gray">
            Once your post gets more 👍 Likes than 👎 Dislikes you will receive Points (if it’s a single post) or NFT
            (if you participated in the event).
          </p>
          <p className="text-[14px] font-medium text-gray">Thank you for keeping the Earth clean 🥰</p>
          <DialogClose asChild>
            <Button className="py-3">Ok</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
      <div className="flex mb-8 items-center justify-between">
        <div className="w-[60px]">
          <NavLink to={routes.posts}>
            <ArrowCircleLeft />
          </NavLink>
        </div>
        <h1 className="text-[18px] font-semibold">New Post</h1>
        <Button onClick={handlePost} disabled={!comment || currentFiles.length === 0 || isPending}>
          {isPending ? 'Posting...' : 'Post'}
        </Button>
      </div>
      <div className="flex items-center mb-4 gap-2">
        {generateBlockies(publicKey)}
        <p>{shortenAddress(publicKey?.toString() ?? '')}</p>
      </div>
      <Textarea
        cols={4}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Comment..."
        className={`text-[14px] h-[120px] ${previews.length === 0 ? 'mb-16' : 'mb-10'} resize-none leading-5 font-medium`}
      />
      {previews.length > 0 && (
        <div className="grid md:grid-cols-3 grid-cols-2 mb-10 gap-2 relative">
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              {preview.startsWith('data:image/') ? (
                <img
                  src={preview}
                  alt={`Uploaded preview ${index + 1}`}
                  className="h-auto rounded-[16px] aspect-square max-w-full"
                />
              ) : (
                <video src={preview} controls className="h-auto rounded-[16px] aspect-square max-w-full" />
              )}
              <button
                onClick={() => handleDelete(index)}
                className="absolute left-1/2 -translate-x-1/2 shadow-glow rounded-full translate-y-1/2 bottom-0"
              >
                <Close className="w-6 h-6" />
              </button>
            </div>
          ))}
        </div>
      )}
      <label
        htmlFor="files"
        className="relative border border-dashed border-gray-blue cursor-pointer flex gap-4 rounded-[12px] p-6 flex-col items-center"
      >
        {previews.length === 0 ? (
          <>
            <div className="flex flex-col gap-1.5 items-center">
              <h2 className="text-[16px] font-semibold">Upload photo or video</h2>
              <p className="text-gray text-[12px] font-medium">up to 10 files</p>
            </div>
            <Button className="font-bold  pointer-events-none  w-[146px] py-3">Select files</Button>
            <Button variant="outline" className="font-bold  pointer-events-none   w-[146px] py-3">
              Take photo/video
            </Button>
          </>
        ) : (
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <AddPhoto />
              <p className="font-medium text-[16px]">Add files</p>
            </div>
            <div className="flex items-center gap-2">
              <TakePhoto />
              <p className="font-medium text-[16px]">Take photo</p>
            </div>
          </div>
        )}

        <Input
          id="files"
          type="file"
          onChange={handleUpload}
          multiple
          title="&nbsp;"
          className=" text-transparent hidden "
          accept="image/*,video/*"
        />
      </label>
    </div>
  );
}
