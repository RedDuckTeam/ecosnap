import { create } from 'zustand';

interface PhotoStore {
  filesBefore: File[];
  filesAfter: File[];
  setFilesBefore: (files: File[]) => void;
  setFilesAfter: (files: File[]) => void;
}

const usePhotoStore = create<PhotoStore>((set) => ({
  filesBefore: [],
  filesAfter: [],
  setFilesBefore: (files: File[]) => set({ filesBefore: files }),
  setFilesAfter: (files: File[]) => set({ filesAfter: files }),
}));

export default usePhotoStore;
