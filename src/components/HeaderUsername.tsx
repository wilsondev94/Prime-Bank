export default function HeaderName({
  type = "title",
  title,
  subtext,
  user,
}: HeaderUserBoxProps) {
  return (
    <div className="header-user">
      <h1 className="header-user-title">
        {title}
        {type === "greeting" && (
          <span className="text-bankGradient"> {user}</span>
        )}
      </h1>
      <p className="header-user-subtext">{subtext}</p>
    </div>
  );
}
