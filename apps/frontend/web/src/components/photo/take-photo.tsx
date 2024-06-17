import { X } from 'lucide-react';
import type { ChangeEvent } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useToast } from '../ui/use-toast';
import usePhotoStore from '@/store/photo';
import { Input } from '../ui/input';

type Props = {
  isBefore: boolean;
};

export const TakePhoto = ({ isBefore }: Props) => {
  const { filesAfter, filesBefore, setFilesAfter, setFilesBefore } = usePhotoStore();

  const currentFiles = useMemo(() => {
    return isBefore ? filesBefore : filesAfter;
  }, [isBefore, filesBefore, filesAfter]);

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

    loadPreviews();
  }, [currentFiles]);

  const { toast } = useToast();

  const handleUpload = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;

      if (!files) return;

      if (currentFiles.length + files.length > 10) {
        toast({
          title: 'You can only upload up to 10 files.',
        });
        return;
      }

      const callback = isBefore ? setFilesBefore : setFilesAfter;
      const filesToAdd = Array.from(files);

      callback([...currentFiles, ...filesToAdd]);
    },
    [currentFiles, isBefore, setFilesBefore, setFilesAfter, toast]
  );

  const handleDelete = useCallback(
    (index: number) => {
      const callback = isBefore ? setFilesBefore : setFilesAfter;
      const updatedFiles = currentFiles.filter((_, i) => i !== index);
      callback(updatedFiles);
    },
    [currentFiles, isBefore, setFilesBefore, setFilesAfter]
  );

  return (
    <div className="flex flex-col gap-3">
      <p>
        {isBefore ? 'Take photo before' : 'Take photo after'} {'(max 10)'}
      </p>
      <Input type="file" onChange={handleUpload} multiple accept="image/*,video/*" />
      <div className="mt-2 flex flex-wrap gap-2">
        {previews.map((preview, index) => (
          <div key={index} className="relative">
            {preview.startsWith('data:image/') ? (
              <img
                src={preview}
                alt={`Uploaded preview ${index + 1}`}
                width={100}
                height={100}
                className="h-auto max-w-full"
              />
            ) : (
              <video src={preview} controls width={100} height={100} className="h-auto max-w-full" />
            )}
            <button onClick={() => handleDelete(index)} className="absolute right-0 top-0">
              <X className="h-5 w-5 text-red-500" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
