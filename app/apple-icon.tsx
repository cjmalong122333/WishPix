import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function AppleIcon() {
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
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span>WP</span>
          <span
            style={{
              width: 14,
              height: 14,
              borderRadius: 9999,
              background: "#DDD6FE",
              marginLeft: 6,
            }}
          />
        </div>
        <div
          style={{
            marginTop: 4,
            fontSize: 16,
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
      ...size,
    }
  );
}
