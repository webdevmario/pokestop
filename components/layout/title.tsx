interface Props {
  name: string;
}

function Title({ name }: Props) {
  return (
    <div className="flex justify-center items-center mb-12 mt-12">
      <h3 className="font-bold tracking-widest text-3xl uppercase">{name}</h3>
    </div>
  );
}

export default Title;
