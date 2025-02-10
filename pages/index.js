export default function Home() {
  return (
    <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
      <h1>Pump Trends</h1>
      <p>Tracking trending words on Pump.fun</p>
      <a href="/api/trending" style={{ color: "blue", textDecoration: "underline" }}>
        Check API Trending Data
      </a>
    </div>
  );
}
