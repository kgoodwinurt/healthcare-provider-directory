type Props = {
  photo: string;
  photoPos: string;
  name: string;
  className?: string;
};

/**
 * Provider headshots are cropped out of a 2x2 contact sheet using
 * background-position, so each quadrant fills a square frame identically.
 */
export function ProviderAvatar({ photo, photoPos, name, className = "" }: Props) {
  return (
    <div
      role="img"
      aria-label={`Headshot of ${name}`}
      className={`avatar shrink-0 overflow-hidden ${className}`}
      style={{
        backgroundImage: `url(${photo})`,
        backgroundPosition: photoPos,
      }}
    />
  );
}
