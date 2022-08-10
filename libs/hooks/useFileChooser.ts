export default function useFileChooser() {
  return () =>
    new Promise<FileList | null>((resolve) => {
      const input = document.createElement("input");
      input.type = "file";
      input.onchange = () => resolve(input.files);
      input.click();
    });
}
