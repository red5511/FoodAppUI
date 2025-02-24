export function decodeListOfBase64(encodedList: string[]): Uint8Array[] {
  const decodedByteArrays: Uint8Array[] = encodedList.map((encodedStr) => {
    const decodedStr = atob(encodedStr);
    const byteNumbers = new Array(decodedStr.length);
    for (let i = 0; i < decodedStr.length; i++) {
      byteNumbers[i] = decodedStr.charCodeAt(i);
    }
    return new Uint8Array(byteNumbers);
  });
  return decodedByteArrays;
}
