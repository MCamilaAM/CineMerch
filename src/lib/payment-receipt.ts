export const maxReceiptBytes = 5 * 1024 * 1024;

export function isReceiptFilename(name: string) {
  return /\.jpe?g$/i.test(name);
}
