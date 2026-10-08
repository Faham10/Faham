import { useState } from "react";

export default function ThreeDImage({ src, alt, className = "", reducedMotion = false }) {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  function handlePointerMove(event) {
    if (reducedMotion || event.pointerType === "touch") return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    setRotation({ x: -y * 5, y: x * 7 });
  }

  return (
    <div
      className={`legacy-image-scene ${className}`}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setRotation({ x: 0, y: 0 })}
      style={{ "--scene-rotate-x": `${rotation.x}deg`, "--scene-rotate-y": `${rotation.y}deg` }}
    >
      <img src={src} alt={alt} loading={className.includes("legacy-hero-image") ? "eager" : "lazy"} />
      <span className="legacy-image-glint" aria-hidden="true" />
    </div>
  );
}
