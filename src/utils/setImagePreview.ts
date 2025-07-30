// setterCallback으로 setting해주는 함수

export const setFilePreview = (
  imageFile: File,
  setterCallback: (
    value: React.SetStateAction<string | null | undefined>
  ) => void
) => {
  if (imageFile) {
    const reader = new FileReader();
    reader.onloadend = () => {
      setterCallback(reader.result as string);
    };
    reader.readAsDataURL(imageFile);
  } else {
    setterCallback(null);
  }
};
