import Button from "@/components/ui/button";

export interface DifficultyOption<T extends string> {
  value: T;
  label: string;
  /** Short qualifier shown after the label, e.g. "10 pairs". */
  hint?: string;
}

interface Props<T extends string> {
  options: DifficultyOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Announced to assistive tech; each game names its own scale. */
  label?: string;
}

/** The difficulty pill row shared by matching and hide & seek. */
function DifficultyPills<T extends string>({
  options,
  value,
  onChange,
  label = "Difficulty",
}: Props<T>) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-3">
      {options.map((opt) => (
        <Button
          key={opt.value}
          size="md"
          selected={value === opt.value}
          onClick={() => onChange(opt.value)}
          className="capitalize"
        >
          {opt.label}
          {opt.hint && (
            <span className="font-normal opacity-70">({opt.hint})</span>
          )}
        </Button>
      ))}
    </div>
  );
}

export default DifficultyPills;
