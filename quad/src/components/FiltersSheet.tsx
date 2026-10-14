import { FILTER_OPTIONS } from '../options';
import { emptyFilters } from '../matching';
import type { FilterKey, Filters } from '../types';
import { ChipGroup, Field, RangeSlider, Sheet, Toggle } from './ui';

const ORDER: FilterKey[] = ['intentions', 'relationshipStyle', 'religion', 'faithPractice', 'pace', 'drinking', 'smoking', 'diet', 'kids'];

export function FiltersSheet({
  open,
  onClose,
  filters,
  onChange,
  resultCount,
}: {
  open: boolean;
  onClose: () => void;
  filters: Filters;
  onChange: (f: Filters) => void;
  resultCount: number;
}) {
  const setRule = (k: FilterKey, patch: Partial<Filters['rules'][FilterKey]>) =>
    onChange({ ...filters, rules: { ...filters.rules, [k]: { ...filters.rules[k], ...patch } } });

  return (
    <Sheet open={open} onClose={onClose} title="Preferences">
      <p className="muted small">
        Preferences boost people up your deck. Flip on <strong>Dealbreaker</strong> to hide everyone else. Their dealbreakers apply to you too.
      </p>

      <Field label="Age">
        <RangeSlider min={18} max={35} low={filters.ageMin} high={filters.ageMax} onChange={(ageMin, ageMax) => onChange({ ...filters, ageMin, ageMax })} />
      </Field>
      <Toggle checked={filters.sameCampusOnly} onChange={(v) => onChange({ ...filters, sameCampusOnly: v })} label="My campus only" hint="Otherwise includes nearby schools" />
      <Toggle checked={filters.verifiedOnly} onChange={(v) => onChange({ ...filters, verifiedOnly: v })} label="Verified students only" />

      {ORDER.map((k) => {
        const rule = filters.rules[k];
        const def = FILTER_OPTIONS[k];
        return (
          <div className="filter-block" key={k}>
            <div className="filter-head">
              <span className="field-label">{def.title}</span>
              {rule.values.length > 0 && (
                <button
                  type="button"
                  className={`db-toggle ${rule.dealbreaker ? 'on' : ''}`}
                  onClick={() => setRule(k, { dealbreaker: !rule.dealbreaker })}
                  aria-pressed={rule.dealbreaker}
                >
                  {rule.dealbreaker ? '🔒 Dealbreaker' : 'Make dealbreaker'}
                </button>
              )}
            </div>
            <ChipGroup multi options={def.options} value={rule.values} onChange={(values) => setRule(k, { values, dealbreaker: values.length ? rule.dealbreaker : false })} />
          </div>
        );
      })}

      <div className="sheet-foot">
        <button className="btn btn-ghost" onClick={() => onChange(emptyFilters())}>
          Reset
        </button>
        <button className="btn btn-primary" onClick={onClose}>
          Show {resultCount} {resultCount === 1 ? 'person' : 'people'}
        </button>
      </div>
    </Sheet>
  );
}
