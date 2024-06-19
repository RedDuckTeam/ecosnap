import { httpClient } from '../client';

const POST_CREATE_POST = 'api/gc';

export type PostCreatePostParams = {
  description: string;
  files: File[];
  jwt: string;
};

export const postCreatePost = async ({ files, description, jwt }: PostCreatePostParams) => {
  const formData = new FormData();
  formData.append('description', description);
  for (const file of files) {
    if (file.type.startsWith('image/')) {
      formData.append('photos', file);
    } else if (file.type.startsWith('video/')) {
      formData.append('videos', file);
    }
  }

  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }
  const response = await httpClient.post(`${POST_CREATE_POST}`, formData, {
    Authorization: 'Bearer ' + jwt,
  });

  if (response.status !== 201) {
    console.error(response.data);
    throw new Error('Failed to create post');
  }

  return response.data;
};
