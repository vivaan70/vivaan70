import { AnimatePresence, motion, useDragControls } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Opt } from '../options';
import type { Profile } from '../types';

export function Chip({
  active,
  onClick,
  children,
  small,
}: {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  small?: boolean;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      className={`chip ${active ? 'chip-active' : ''} ${small ? 'chip-sm' : ''}`}
      onClick={onClick}
      aria-pressed={active}
    >
      {children}
    </motion.button>
  );
}

type ChipOpt = Opt | string;
const optId = (o: ChipOpt) => (typeof o === 'string' ? o : o.id);

export function ChipGroup({
  options,
  value,
  onChange,
  multi,
  max,
}: {
  options: ChipOpt[];
  value: string[];
  onChange: (v: string[]) => void;
  multi?: boolean;
  max?: number;
}) {
  const toggle = (id: string) => {
    if (!multi) return onChange(value[0] === id ? [] : [id]);
    if (value.includes(id)) return onChange(value.filter((v) => v !== id));
    if (max && value.length >= max) return;
    onChange([...value, id]);
  };
  return (
    <div className="chips">
      {options.map((o) => {
        const id = optId(o);
        return (
          <Chip key={id} active={value.includes(id)} onClick={() => toggle(id)}>
            {typeof o !== 'string' && o.emoji && <span className="chip-emoji">{o.emoji}</span>}
            {typeof o === 'string' ? o : o.label}
          </Chip>
        );
      })}
    </div>
  );
}

export function Toggle({ checked, onChange, label, hint }: { checked: boolean; onChange: (v: boolean) => void; label: ReactNode; hint?: ReactNode }) {
  return (
    <label className="toggle-row">
      <span>
        <span className="toggle-label">{label}</span>
        {hint && <span className="toggle-hint">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        className={`switch ${checked ? 'on' : ''}`}
        onClick={() => onChange(!checked)}
      >
        <motion.span layout transition={{ type: 'spring', stiffness: 600, damping: 35 }} className="knob" />
      </button>
    </label>
  );
}

export function Field({ label, hint, children }: { label: ReactNode; hint?: ReactNode; children: ReactNode }) {
  return (
    <div className="field">
      <div className="field-label">
        {label}
        {hint && <span className="field-hint">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export function RangeSlider({
  min,
  max,
  low,
  high,
  onChange,
}: {
  min: number;
  max: number;
  low: number;
  high: number;
  onChange: (low: number, high: number) => void;
}) {
  const pct = (v: number) => ((v - min) / (max - min)) * 100;
  return (
    <div className="range">
      <div className="range-values">
        <span>{low}</span>
        <span>–</span>
        <span>{high === max ? `${max}+` : high}</span>
      </div>
      <div className="range-track">
        <div className="range-fill" style={{ left: `${pct(low)}%`, right: `${100 - pct(high)}%` }} />
        <input
          type="range"
          min={min}
          max={max}
          value={low}
          aria-label="Minimum age"
          onChange={(e) => onChange(Math.min(+e.target.value, high - 1), high)}
        />
        <input
          type="range"
          min={min}
          max={max}
          value={high}
          aria-label="Maximum age"
          onChange={(e) => onChange(low, Math.max(+e.target.value, low + 1))}
        />
      </div>
    </div>
  );
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: ReactNode; children: ReactNode }) {
  const controls = useDragControls();
  const root = document.getElementById('overlay-root');
  const sheet = (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="sheet"
            role="dialog"
            aria-modal
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            drag="y"
            dragControls={controls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 120 || info.velocity.y > 600) onClose();
            }}
          >
            <div className="sheet-handle" onPointerDown={(e) => controls.start(e)}>
              <div className="sheet-grabber" />
            </div>
            <div className="sheet-head" onPointerDown={(e) => controls.start(e)}>
              <h2>{title}</h2>
              <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
                <X size={20} />
              </button>
            </div>
            <div className="sheet-body">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
  return root ? createPortal(sheet, root) : sheet;
}

/** Stand-in "photo": a soft gradient portrait. Real uploads would replace this. */
export function Photo({ profile, size, className = '' }: { profile: Pick<Profile, 'photo' | 'name'>; size?: number; className?: string }) {
  const { hue, emoji } = profile.photo;
  const style = {
    '--h': hue,
    width: size,
    height: size,
    fontSize: size ? size * 0.45 : undefined,
  } as React.CSSProperties;
  return (
    <div className={`photo ${className}`} style={style} aria-label={`${profile.name}'s photo`} role="img">
      <span className="photo-emoji">{emoji}</span>
    </div>
  );
}
