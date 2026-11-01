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
          color: "#38BDF8",
          fontFamily: "sans-serif",
        }}
      >
        {/* Safe-zone inner emblem (within center 80% circle for Android Adaptive Icons) */}
        <div
          style={{
            width: 340,
            height: 340,
            borderRadius: 84,
            background: "rgba(11, 31, 53, 0.55)",
            border: "10px solid rgba(56, 189, 248, 0.4)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              fontSize: 150,
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
                width: 30,
                height: 30,
                borderRadius: 9999,
                background: "#38BDF8",
                marginLeft: 10,
              }}
            />
          </div>
          <div
            style={{
              marginTop: 8,
              fontSize: 34,
              fontWeight: 700,
              letterSpacing: "0.16em",
              color: "#7DD3FC",
            }}
          >
            WISHPIX
          </div>
        </div>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
