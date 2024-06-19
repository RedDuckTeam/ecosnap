import { useWallet } from '@solana/wallet-adapter-react';
import { useMutation } from '@tanstack/react-query';

import type { PostCreatePostParams } from '@/api/post/create-post';
import { postCreatePost } from '@/api/post/create-post';
import { useAuth } from '@/hooks/mutations/use-auth';

export const useCreatePost = () => {
  const { publicKey } = useWallet();
  const { mutateAsync: auth } = useAuth();

  return useMutation({
    mutationFn: async ({ description, files }: Omit<PostCreatePostParams, 'jwt'>) => {
      if (!publicKey) {
        throw new Error('No public key');
      }

      const jwt = await auth();
      return await postCreatePost({ description, files, jwt });
    },
  });
};
