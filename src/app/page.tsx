export const metadata = {
  title: "Freshers Party 2026 - Mechanical Engineering",
  description: "Official Mechanical Engineering Freshers Party 2026 Invitation in Black & Gold",
};

export default function HomePage() {
  return (
    <main
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        background: "#000",
        margin: 0,
        padding: 0,
        overflow: "hidden",
      }}
    >
      <iframe
        src="/invitation.html"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        allow="autoplay; accelerometer; gyroscope; clipboard-write"
        title="Freshers Party 2026 Black & Gold Invitation"
      />
    </main>
  );
}
