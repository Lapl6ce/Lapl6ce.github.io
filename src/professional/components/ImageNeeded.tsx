/** Dashed stand-in for an image that hasn't been made yet, naming where it goes and its size. */
export default function ImageNeeded({ path, spec = "1600×1000 JPG, 16:10", square = false }: { path: string; spec?: string; square?: boolean }) {
  return (
    <div className={"image-needed" + (square ? " is-square" : "")}>
      <span className="image-needed-title">IMAGE NEEDED</span>
      <code>public{path}</code>
      <span>{spec}</span>
    </div>
  );
}
