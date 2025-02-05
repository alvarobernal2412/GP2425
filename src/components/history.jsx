import { CirclePlus, Pencil, CircleMinus, Upload, Minus } from 'lucide-react';
import * as React from 'react';
import { cn } from '@/lib/utils';

export function hasRole(roles) {
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (!userData || !userData.roles) return false;
  return roles.some(role => userData.roles.includes(role));
}

export function CardDiv({ children }) {
  return (
    <div className="flex items-center justify-between rounded-lg shadow-sm" >
      {children}
    </div>
  );
}

export function CardActions({ children }) {
  return (
    <div className="flex items-center space-x-3 ml-auto">
      {children}
    </div>
  );
}

export function AddIcon({ onClick }) {
  if (!hasRole(['clinicadmin', 'doctor'])) return null;
  return (
    <button onClick={() => onClick()}>
      <CirclePlus className="min-h-7 min-w-7 hover:text-muted-foreground" />
    </button>
  );
}

export function RemoveConditionIcon({ onClick}) {
  if (!hasRole(['clinicadmin', 'doctor'])) return null;
  return (
    <button onClick={() => onClick()}>
      <CircleMinus className="min-h-4 min-w-4 bg-muted hover:text-muted-foreground" />
    </button>
  );
}

export function EditConditionIcon({ onClick}) {
  if (!hasRole(['clinicadmin', 'doctor'])) return null;
  return (
    <button onClick={() => onClick()}>
      <Pencil className="min-h-4 min-w-4 bg-muted hover:text-muted-foreground" />
    </button>
  );
}

export function EditIcon({ onClick}) {
  if (!hasRole(['clinicadmin', 'doctor'])) return null;
  return (
    <button onClick={() => onClick()}>
      <Pencil className="min-h-4 min-w-4 hover:text-muted-foreground" />
    </button>
  );
}

export function RemoveIcon({ onClick}) {
  if (!hasRole(['clinicadmin', 'doctor'])) return null;
  return (
    <button onClick={() => onClick()}>
      <CircleMinus className="min-h-4 min-w-4 hover:text-muted-foreground" />
    </button>
  );
}

export function UploadIcon({ onClick}) {
  if (!hasRole(['clinicadmin', 'doctor'])) return null;
  return (
    <button onClick={() => onClick()}>
      <Upload className="min-h-7 min-w-7 hover:text-muted-foreground" />
    </button>
  );
}

export function RemoveAllergyIcon({ onClick}) {
  if (!hasRole(['clinicadmin', 'doctor'])) return null;
  return (
    <button onClick={() => onClick()}>
      <Minus className="min-h-4 min-w-4 bg-muted hover:text-muted-foreground" />
    </button>
  );
}

const Textarea = React.forwardRef(({ className, rows = 3, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        'flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm resize-none',
        className
      )}
      ref={ref}
      rows={rows}
      {...props}
    />
  );
});
Textarea.displayName = 'Textarea';

export { Textarea };




