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
          background: "linear-gradient(135deg, #231B3B 0%, #6D48DF 100%)",
          borderRadius: 112,
          border: "14px solid rgba(196, 181, 253, 0.4)",
          color: "#DDD6FE",
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
              background: "#DDD6FE",
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
            color: "#EDE7FC",
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
