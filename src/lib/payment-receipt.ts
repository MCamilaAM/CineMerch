export const maxReceiptBytes = 5 * 1024 * 1024;

export const receiptPaymentMethods = ["WOMPI_BRE_B", "WOMPI_PSE", "WOMPI_BANCOLOMBIA", "WOMPI_NEQUI"] as const;

export function requiresPaymentReceipt(method?: string) {
  return receiptPaymentMethods.some((value) => value === method);
}

export function isReceiptFilename(name: string) {
  return /\.jpe?g$/i.test(name);
}
