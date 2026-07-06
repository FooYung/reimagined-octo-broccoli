interface ProductImageProps {
  name: string;
}

// Seeded product `imageUrl` paths point to files that don't exist, so rather than rendering an
// <img> that's guaranteed to 404, this always renders a branded placeholder tile. Real product
// imagery can replace this component later.
function ProductImage({ name }: ProductImageProps) {
  return (
    <div
      role="img"
      aria-label={name}
      className="relative flex aspect-square w-full items-center justify-center rounded bg-gradient-to-br from-slate-700 to-slate-900"
    >
      <span className="text-4xl font-bold text-white">{name.charAt(0).toUpperCase()}</span>
      <span className="absolute bottom-2 inset-x-0 text-center text-[10px] font-medium tracking-wide text-blue-300 opacity-70">
        ByteCore
      </span>
    </div>
  );
}

export default ProductImage;
