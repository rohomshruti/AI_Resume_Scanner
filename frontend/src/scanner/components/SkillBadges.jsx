export default function SkillBadges({ skills = [] }) {
  return (
    <div className="rs-badges">
      {skills.map((skill, i) => (
        <span
          key={skill}
          className={`rs-badge ${i % 2 ? "rs-badge--green" : ""}`}
          style={{ animationDelay: `${i * 45}ms` }}
        >
          <i>◆</i>
          {skill}
        </span>
      ))}
    </div>
  );
}
