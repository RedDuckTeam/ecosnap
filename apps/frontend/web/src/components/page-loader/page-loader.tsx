import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface Props {
  screen?: boolean;
}

export const PageLoader = ({ screen }: Props) => {
  return (
    <div className={cn('flex-1 w-full flex items-center justify-center ', screen ? 'h-screen' : 'h-full')}>
      <Loader2 className="animate-spin transition-all w-10 h-10" />
    </div>
  );
};
