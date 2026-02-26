export default async function PingPage() {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL;
  const res = await fetch(`${base}/api/skills`, {
    cache: "no-store",
  });

  const text = await res.text();

  return (
    <main style={{ padding: 24 }}>
      <h1>Ping</h1>

      <p>
        <b>URL:</b> {base}/api/ping
      </p>
      <p>
        <b>Status:</b> {res.status}
      </p>

      <pre
        style={{
          background: "#111",
          color: "#0f0",
          padding: 16,
          borderRadius: 8,
        }}
      >
        {text}
      </pre>
    </main>
  );
}
