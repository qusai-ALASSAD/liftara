import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react';
import { Loader2 } from 'lucide-react';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline';

const VARIANTS: Record<Variant, string> = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-cta disabled:bg-brand-200 disabled:shadow-none',
  secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-ink-800 dark:text-brand-300 dark:hover:bg-ink-700',
  outline: 'border border-ink-200 bg-white text-ink-900 hover:border-brand-300 hover:text-brand-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-100',
  ghost: 'bg-transparent text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-ink-800',
  danger: 'bg-red-600 text-white hover:bg-red-700'
};

export function Button({
  variant = 'primary', size = 'md', loading, className = '', children, ...rest
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: 'sm' | 'md' | 'lg'; loading?: boolean }) {
  // Große Touch-Ziele: im Gym wird mit schwitzigen Fingern getippt.
  const sizes = {
    sm: 'min-h-[38px] px-3.5 py-2 text-[13px]',
    md: 'min-h-[46px] px-4 py-2.5 text-[15px]',
    lg: 'min-h-[54px] px-6 py-3.5 text-base'
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-2xl font-semibold transition active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60 ${VARIANTS[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {children}
    </button>
  );
}

export function Card({
  className = '', children, as: As = 'div', padded = true
}: { className?: string; children: ReactNode; as?: 'div' | 'section' | 'li' | 'article'; padded?: boolean }) {
  return <As className={`card ${padded ? 'p-4' : ''} ${className}`}>{children}</As>;
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 mt-7 flex items-center justify-between gap-3">
      <h2 className="text-[17px] font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function Chip({
  active, children, onClick, disabled, title, size = 'md'
}: { active?: boolean; children: ReactNode; onClick?: () => void; disabled?: boolean; title?: string; size?: 'sm' | 'md' }) {
  const base = `inline-flex items-center gap-1.5 rounded-full border font-medium transition ${
    size === 'sm' ? 'px-2.5 py-1 text-[12px]' : 'px-3.5 py-2 text-[13px]'
  } disabled:opacity-40`;
  const state = active
    ? 'border-brand-500 bg-brand-500 text-white shadow-cta'
    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-600 dark:border-ink-700 dark:bg-ink-800 dark:text-ink-200';
  if (!onClick) return <span className={`${base} ${state}`} title={title}>{children}</span>;
  return (
    <button type="button" aria-pressed={!!active} disabled={disabled} onClick={onClick} className={`${base} ${state}`} title={title}>
      {children}
    </button>
  );
}

export function Progress({ value, label, tone = 'brand' }: { value: number; label?: string; tone?: 'brand' | 'accent' | 'warn' }) {
  const colors = { brand: 'bg-brand-500', accent: 'bg-success-500', warn: 'bg-warn-500' };
  return (
    <div className="w-full">
      <div
        className="h-2.5 w-full overflow-hidden rounded-full bg-ink-100 dark:bg-ink-800"
        role="progressbar" aria-valuenow={Math.round(value)} aria-valuemin={0} aria-valuemax={100} aria-label={label}
      >
        <div className={`h-full rounded-full transition-[width] duration-500 ${colors[tone]}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
      </div>
    </div>
  );
}

export function Field({ label, hint, error, children, htmlFor }: { label: string; hint?: string; error?: string; children: ReactNode; htmlFor?: string }) {
  return (
    <div className="mb-4">
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold">{label}</label>
      {children}
      {hint && !error && <p className="mt-1.5 text-xs muted">{hint}</p>}
      {error && <p className="mt-1.5 text-xs font-medium text-red-600" role="alert">{error}</p>}
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
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex-1">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        {description && <p className="mt-0.5 text-xs muted">{description}</p>}
      </div>
      <button
        id={id} type="button" role="switch" aria-checked={checked} aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700'}`}
      >
        <span className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${checked ? 'start-6' : 'start-1'}`} />
      </button>
    </div>
  );
}

export function EmptyState({ title, text, action, icon }: { title: string; text?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="card flex flex-col items-center gap-2 p-10 text-center">
      {icon && <div className="mb-1 flex h-14 w-14 items-center justify-center rounded-2xl tint text-brand-500">{icon}</div>}
      <p className="font-semibold">{title}</p>
      {text && <p className="max-w-sm text-sm muted">{text}</p>}
      {action}
    </div>
  );
}

export function Dialog({ open, title, children, onClose, footer }: { open: boolean; title: string; children: ReactNode; onClose: () => void; footer?: ReactNode }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink-950/45 p-0 backdrop-blur-sm sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <button className="absolute inset-0 cursor-default" aria-label="close" onClick={onClose} tabIndex={-1} />
      <div className="card relative z-10 max-h-[88vh] w-full max-w-lg animate-fade-up overflow-y-auto rounded-b-none p-5 sm:rounded-3xl">
        <h3 className="mb-3 text-lg font-semibold">{title}</h3>
        <div className="text-sm">{children}</div>
        {footer && <div className="mt-6 flex flex-wrap justify-end gap-2">{footer}</div>}
      </div>
    </div>
  );
}

export function Stat({ label, value, sub, icon }: { label: string; value: ReactNode; sub?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="card p-3.5">
      <div className="flex items-center gap-2">
        {icon && <span className="text-brand-500">{icon}</span>}
        <p className="text-xs font-medium muted">{label}</p>
      </div>
      <p className="mt-1 font-display text-xl font-semibold">{value}</p>
      {sub && <p className="mt-0.5 text-xs muted">{sub}</p>}
    </div>
  );
}

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'brand' | 'accent' | 'warn' }) {
  const tones = {
    neutral: 'bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200',
    brand: 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-200',
    accent: 'bg-success-50 text-success-700 dark:bg-success-700/25 dark:text-success-100',
    warn: 'bg-warn-50 text-warn-600 dark:bg-warn-500/20 dark:text-warn-100'
  };
  return <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${tones[tone]}`}>{children}</span>;
}
