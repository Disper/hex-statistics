export function FooterAuthorAttribution() {
  const isPl =
    typeof navigator !== "undefined" &&
    navigator.language.toLowerCase().startsWith("pl");
  const template = isPl ? "Apka od \u0000" : "App made by \u0000";
  const parts = template.split("\u0000");
  return (
    <>
      {parts[0]}
      <a
        href="https://disper.github.io/"
        target="_blank"
        rel="noopener noreferrer"
        className="text-stone-300 underline decoration-stone-600 underline-offset-2 transition-colors hover:text-amber-300 hover:decoration-amber-400/70"
      >
        Disper
      </a>
      {parts[1] ?? ""}
    </>
  );
}
