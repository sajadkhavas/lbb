import { useEffect, useState } from "react";

export function DecodedCardImage({
  src,
  alt,
  priority,
}: {
  src: string;
  alt: string;
  priority: boolean;
}) {
  const [current, setCurrent] = useState(src);
  const [ready, setReady] = useState<string | null>(null);
  const incoming = src !== current ? src : null;
  const revealed = incoming !== null && incoming === ready;

  useEffect(() => {
    if (!revealed || !incoming) return;
    const timer = window.setTimeout(() => {
      setCurrent(incoming);
      setReady(null);
    }, 300);
    return () => window.clearTimeout(timer);
  }, [incoming, revealed]);

  const imageClass = "absolute inset-0 w-full object-cover";
  return (
    <>
      <img
        key={current}
        src={current}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        width={1024}
        height={1280}
        style={{ height: "100%" }}
        className={imageClass}
      />
      {incoming && (
        <img
          key={incoming}
          src={incoming}
          alt=""
          aria-hidden="true"
          width={1024}
          height={1280}
          decoding="async"
          onLoad={async (event) => {
            const image = event.currentTarget;
            try {
              await image.decode();
              if (image.isConnected) setReady(incoming);
            } catch {
              // Keep the current photo if the incoming image cannot be decoded.
            }
          }}
          style={{ height: "100%", opacity: revealed ? 1 : 0 }}
          className={imageClass + " pointer-events-none motion-reduce:transition-none"}
        />
      )}
    </>
  );
}
