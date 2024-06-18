import { create } from 'zustand';

interface PhotoStore {
  comment: string;
  files: File[];
  setFiles: (files: File[]) => void;
  setComment: (comment: string) => void;
}

const usePhotoStore = create<PhotoStore>((set) => ({
  comment: '',
  files: [],
  setComment: (comment: string) => set({ comment }),
  setFiles: (files: File[]) => set({ files }),
}));

export default usePhotoStore;
