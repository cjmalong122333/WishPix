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
          borderRadius: 42,
          border: "6px solid rgba(196, 181, 253, 0.4)",
          color: "#DDD6FE",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 78,
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
              width: 16,
              height: 16,
              borderRadius: 9999,
              background: "#DDD6FE",
              marginLeft: 6,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 18,
            fontWeight: 700,
            letterSpacing: "0.14em",
            color: "#EDE7FC",
          }}
        >
          WISHPIX
        </div>
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  );
}
