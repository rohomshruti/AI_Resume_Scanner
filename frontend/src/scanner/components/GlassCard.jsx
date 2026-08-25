export default function GlassCard({ title, subtitle, icon, className = "", style, children }) {
  return (
    <section className={`rs-card ${className}`} style={style}>
      {title ? (
        <h3 className="rs-card-title">
          {icon}
          {title}
        </h3>
      ) : null}
      {subtitle ? <p className="rs-card-sub">{subtitle}</p> : null}
      {children}
    </section>
  );
}
