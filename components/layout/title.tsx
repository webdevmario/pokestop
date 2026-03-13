interface Props {
  name: string;
  subtitle?: string;
}

function Title({ name, subtitle }: Props) {
  return (
    <div className="flex flex-col items-center mb-8 mt-8">
      <h1 className="font-bold tracking-widest text-3xl uppercase text-white">
        {name}
      </h1>
      {subtitle && (
        <p className="text-[var(--color-text-muted)] mt-2 text-sm">
          {subtitle}
        </p>
      )}
    </div>
  );
}

export default Title;
