export default function useDownloadBlob() {
  return (filename: string, blob: Blob) => {
    if (typeof window === "undefined") return;

    // create file link in browser's memory
    const href = URL.createObjectURL(blob);

    // create "a" HTLM element with href to file & click
    const link = document.createElement("a");
    link.href = href;
    link.setAttribute("download", filename); //or any other extension
    document.body.appendChild(link);
    link.click();

    // clean up "a" element & remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };
}
