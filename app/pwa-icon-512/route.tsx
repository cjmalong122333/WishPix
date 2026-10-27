import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0B1F35 0%, #085081 100%)",
          borderRadius: 112,
          border: "14px solid rgba(56, 189, 248, 0.35)",
          color: "#38BDF8",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 210,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            color: "#FFFFFF",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>WP</span>
          <span
            style={{
              width: 42,
              height: 42,
              borderRadius: 9999,
              background: "#38BDF8",
              marginLeft: 14,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 12,
            fontSize: 48,
            fontWeight: 700,
            letterSpacing: "0.16em",
            color: "#7DD3FC",
          }}
        >
          WISHPIX
        </div>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
