export default function AdBanner({ slot = "bottom", className = "" }) {
  return (
    <div
      className={`w-full h-16 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl ${className}`}
      aria-label="Espacio publicitario"
    >
      {/*
        codigo de publicidad
      */}
      <span className="text-xs text-gray-400 font-medium tracking-widest select-none uppercase">
        Publicidad
      </span>
    </div>
  );
}
