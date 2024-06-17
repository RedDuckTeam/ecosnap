import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import type { ZodType } from 'zod';
import { z } from 'zod';

import { Button } from '../ui/button';
import { Input } from '../ui/input';

import usePhotoStore from '@/store/photo';

export interface TakePhotoForm {
  title: string;
  description: string;
}

export const takePhotoSchema: ZodType<TakePhotoForm> = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
});

export const TakePhotoForm = () => {
  const { filesAfter, filesBefore } = usePhotoStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
    reset,
  } = useForm<TakePhotoForm>({
    resolver: zodResolver(takePhotoSchema),
  });

  const onSubmit = useCallback((data: TakePhotoForm) => {
    console.log(data);
  }, []);

  return (
    <form action="" className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col gap-2">
        <p>Title</p>
        <Controller
          name="title"
          control={control}
          render={({ field }) => <Input placeholder="Title" {...field} id="title" />}
        />
        <div className="text-red-500">{errors.title?.message}</div>
      </div>
      <div className="flex flex-col gap-2">
        <p>Title</p>
        <Controller
          name="description"
          control={control}
          render={({ field }) => <Input placeholder="Description" {...field} id="description" />}
        />
        <div className="text-red-500">{errors.description?.message}</div>
      </div>
      <Button type="submit" disabled={filesAfter.length === 0 || filesBefore.length === 0}>
        Post!
      </Button>
    </form>
  );
};
