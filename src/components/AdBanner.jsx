export default function AdBanner({ slot = "bottom", className = "" }) {
  return (
    <div
      className={`w-full h-16 flex items-center justify-center bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl ${className}`}
      aria-label="Espacio publicitario"
    >
      {/*
        ── REEMPLAZA ESTE BLOQUE CON TU PROVEEDOR DE ADS ──────────────────
        Google AdSense:  <ins className="adsbygoogle" ...>
        Meta Audience:   <div id="fb-ad-container" ...>
        ───────────────────────────────────────────────────────────────────
      */}
      <span className="text-xs text-gray-400 font-medium tracking-widest select-none uppercase">
        Publicidad
      </span>
    </div>
  );
}
