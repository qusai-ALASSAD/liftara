import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-royal-600 text-white hover:bg-royal-700 active:bg-royal-800 shadow-lift disabled:bg-royal-300',
  secondary: 'bg-sand-100 text-navy-900 hover:bg-sand-200 dark:bg-navy-700 dark:text-white dark:hover:bg-navy-600',
  ghost: 'bg-transparent hover:bg-sand-100 dark:hover:bg-navy-800',
  danger: 'bg-red-600 text-white hover:bg-red-700'
};

export function Button({
  variant = 'primary', size = 'md', loading, className = '', children, ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' | 'lg'; loading?: boolean }) {
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2.5 text-[15px]', lg: 'px-5 py-3.5 text-base' };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function Card({ className = '', children, as: As = 'div' }: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'li' }) {
  return <As className={`card p-4 ${className}`}>{children}</As>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-2 mt-6 flex items-center justify-between gap-3">
      <h2 className="text-[17px] font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function Chip({ active, children, onClick, disabled, title }: { active?: boolean; children: ReactNode; onClick?: () => void; disabled?: boolean; title?: string }) {
  const base = 'rounded-full border px-3 py-1.5 text-[13px] font-medium transition disabled:opacity-40';
  const state = active
    ? 'border-royal-600 bg-royal-600 text-white'
    : 'hairline border bg-transparent hover:border-royal-400';
  if (!onClick) return <span className={`${base} ${state}`} title={title}>{children}</span>;
  return (
    <button type="button" aria-pressed={!!active} disabled={disabled} onClick={onClick} className={`${base} ${state}`} title={title}>
      {children}
    </button>
  );
}

export function Progress({ value, label, tone = 'brand' }: { value: number; label?: string; tone?: 'brand' | 'accent' | 'warn' }) {
  const colors = { brand: 'bg-royal-600', accent: 'bg-moss-500', warn: 'bg-amber-500' };
  return (
    <div className="w-full">
      <div className="h-2 w-full overflow-hidden rounded-full bg-sand-200 dark:bg-navy-700" role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div className={`h-full rounded-full transition-[width] duration-500 ${colors[tone]}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: string; error?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="mb-3">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-medium">{label}</label>
      {children}
      {hint && !error && <p className="mt-1 text-xs muted">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
    </div>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`field ${props.className ?? ''}`} />;
}

export function Select({ children, ...rest }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...rest} className={`field ${rest.className ?? ''}`}>{children}</select>;
}

export function Toggle({ checked, onChange, label, description, id }: { checked: boolean; onChange: (v: boolean) => void; label: string; description?: string; id?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        {description && <p className="mt-0.5 text-xs muted">{description}</p>}
      </div>
      <button
        id={id} type="button" role="switch" aria-checked={checked} aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${checked ? 'bg-royal-600' : 'bg-sand-300 dark:bg-navy-700'}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${checked ? 'start-[1.375rem]' : 'start-0.5'}`} />
      </button>
    </div>
  );
}

export function EmptyState({ title, text, action, icon }: { title: string; text?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-8 text-center">
      {icon && <div className="mb-1 text-royal-500">{icon}</div>}
      <p className="font-semibold">{title}</p>
      {text && <p className="max-w-sm text-sm muted">{text}</p>}
      {action}
    </div>
  );
}

export function Dialog({ open, title, children, onClose, footer }: { open: boolean; title: string; children: ReactNode; onClose: () => void; footer?: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-navy-950/50 p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 cursor-default" aria-label="close" onClick={onClose} tabIndex={-1} />
      <div className="card relative z-10 max-h-[85vh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-b-none sm:rounded-3xl">
        <h3 className="mb-3 text-lg font-semibold">{title}</h3>
        <div className="text-sm">{children}</div>
        {footer && <div className="mt-5 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Stat({ label, value, sub }: { label: string; value: ReactNode; sub?: ReactNode }) {
  return (
    <div className="card p-3">
      <p className="text-xs muted">{label}</p>
      <p className="mt-0.5 font-display text-xl font-semibold">{value}</p>
      {sub && <p className="text-xs muted">{sub}</p>}
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'brand' | 'accent' | 'warn' }) {
  const tones = {
    neutral: 'bg-sand-100 text-navy-800 dark:bg-navy-700 dark:text-sand-100',
    brand: 'bg-royal-50 text-royal-700 dark:bg-royal-900/40 dark:text-royal-200',
    accent: 'bg-moss-50 text-moss-700 dark:bg-moss-700/30 dark:text-moss-100',
    warn: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200'
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}
