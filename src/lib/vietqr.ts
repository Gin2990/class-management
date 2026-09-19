/**
 * VietQR Image URL generator
 * Format: https://img.vietqr.io/image/<BANK_ID>-<ACCOUNT_NO>-<TEMPLATE>.png?amount=<AMOUNT>&addInfo=<DESCRIPTION>&accountName=<ACCOUNT_NAME>
 */

export interface VietQRParams {
  bankId: string;       // e.g. "MB", "VCB", "TCB", "ICB"
  accountNo: string;    // e.g. "0901234567"
  accountName: string;  // e.g. "NGUYEN DINH LINH"
  amount: number;       // e.g. 7200000
  memo: string;         // e.g. "Yen Ngoc hoc phi IELTS dot 2"
  template?: 'compact2' | 'compact' | 'qr_only' | 'print';
}

export function generateVietQRUrl({
  bankId,
  accountNo,
  accountName,
  amount,
  memo,
  template = 'compact2',
}: VietQRParams): string {
  const cleanBank = bankId.trim().toUpperCase();
  const cleanAcc = accountNo.trim();
  const cleanName = encodeURIComponent(accountName.trim().toUpperCase());
  const cleanMemo = encodeURIComponent(memo.trim());

  return `https://img.vietqr.io/image/${cleanBank}-${cleanAcc}-${template}.png?amount=${Math.round(amount)}&addInfo=${cleanMemo}&accountName=${cleanName}`;
}
