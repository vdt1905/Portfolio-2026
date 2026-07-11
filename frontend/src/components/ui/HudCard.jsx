import Tilt from "./Tilt";

/**
 * Premium HUD console card — glowing angular frame, corner brackets, an
 * optional status badge, body, and a footer action bar. The site's flagship
 * container. Compose with `kicker`, `title`, `subtitle`, `badge`, `actions`.
 */
export default function HudCard({
  accent = "#00e5ff",
  kicker, title, subtitle, badge, actions, children,
  tilt = false, onClick, className = "",
}) {
  const card = (
    <div
      className="hud-card h-full"
      style={{ "--mc": accent }}
      onClick={onClick}
      data-cursor={onClick ? "hover" : undefined}
    >
      <div className="hud-card__panel holo-scan flex h-full flex-col">
        <div className="flex-1 p-5">
          {(kicker || title || badge) && (
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                {kicker && <div className="mono-id" style={{ color: accent }}>{kicker}</div>}
                {title && <h3 className="mt-1 font-display text-2xl font-semibold leading-tight">{title}</h3>}
                {subtitle && <div className="mt-0.5 text-sm text-muted">{subtitle}</div>}
              </div>
              {badge && <div className="shrink-0">{badge}</div>}
            </div>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>

        {actions?.length > 0 && (
          <div className="hud-foot">
            {actions.map((a, i) => {
              const Comp = a.href ? "a" : "button";
              return (
                <Comp
                  key={i}
                  href={a.href}
                  target={a.href ? "_blank" : undefined}
                  rel={a.href ? "noreferrer" : undefined}
                  onClick={(e) => { if (a.onClick) { e.stopPropagation(); a.onClick(e); } }}
                  data-cursor="hover"
                >
                  {a.label}
                  {a.icon}
                </Comp>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  if (tilt) {
    return <Tilt max={5} className={className}>{card}</Tilt>;
  }
  return <div className={className}>{card}</div>;
}
