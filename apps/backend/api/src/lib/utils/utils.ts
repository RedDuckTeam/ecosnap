export const getFileExtensionFromFile = (fileName: string) => {
  const fileNameSplitted = fileName.split('.');
  fileNameSplitted.shift();

  return fileNameSplitted.length ? fileNameSplitted[fileNameSplitted.length - 1] : '';
};
