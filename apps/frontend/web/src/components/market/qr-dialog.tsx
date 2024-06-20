import QRCode from 'react-qr-code';

import type { MyItemCardProps } from './my-item-card';

import { Dialog, DialogContent } from '../ui/dialog';

export interface QrDialogProps extends Omit<MyItemCardProps, 'setMyItem'> {
  open: boolean;
}

export const QrDialog = ({ myItem, open, setOpen }: QrDialogProps) => {
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogContent className="p-[32px] max-w-[440px] gap-[24px] flex flex-col items-center">
        <div className="text-[24px] leading-[30px] tracking-[-0.5px] font-semibold">{myItem.description}</div>
        <div className="max-w-[295px] max-h-[295px] w-full h-full rounded-[19px] bg-background flex items-center justify-center">
          <QRCode
            value={myItem.id}
            className="rounded-[19px]"
            size={295}
            viewBox="0 0 295 295"
            style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
            bgColor="#252945"
            fgColor="#28CCAF"
          />
        </div>
        <div className="text-[16px] leading-[22px] tracking-[-0.5px] text-gray text-center font-medium">
          Here&apos;s your QR code. Please scan it in the shop to make a purchase.
        </div>
      </DialogContent>
    </Dialog>
  );
};
