import { cn } from '../../utils/cn';

interface BrandMatrixIconProps {
  className?: string;
  dotClassName?: string;
}

/**
 * 3x3 Grid brand matrix icon as seen in the Portfos ecosystem design
 */
export const BrandMatrixIcon = ({
  className = 'h-5 w-5',
  dotClassName = 'rounded-[2.5px] bg-[#d2f865]',
}: BrandMatrixIconProps) => {
  return (
    <div className={cn('grid grid-cols-3 gap-[2.5px] p-0.5', className)} aria-hidden="true">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className={cn('aspect-square transition-colors', dotClassName)} />
      ))}
    </div>
  );
};
