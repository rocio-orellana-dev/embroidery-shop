import React from "react";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  wrapperClassName?: string;
  variant?: "light" | "dark";
  label?: string;
};

export default function WatermarkedImage({
  src,
  alt = "",
  className = "",
  wrapperClassName = "",
  variant = "light",
  label = "Vista previa – Matriz protegida © Bordados.Premium",
}: Props) {
  const wm = variant === "dark" ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.08)";

  return (
    <figure className={`wmPreview ${wrapperClassName}`}>
      <img
        src={src}
        alt={alt}
        className={className}
        draggable={false}
        onContextMenu={(e) => e.preventDefault()}
      />
      <div className="wmOverlay wmOverlayCenter" aria-hidden="true">
        <div className="wmBadge">
            <span className="wmBrand">Bordados.</span>
            <span className="wmPremium">Premium</span>
        </div>
        {label ? (
          <div className="wmCaptionOverlay" aria-hidden="true">
            {label}
          </div>
        ) : null}

        </div>
    </figure>
  );
}
