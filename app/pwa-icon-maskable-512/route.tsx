import { ImageResponse } from "next/og";

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #231B3B 0%, #6D48DF 100%)",
        }}
      >
        {/* Safe-zone inner emblem (within center 80% circle for Android Adaptive Icons) */}
        <div
          style={{
            width: 340,
            height: 340,
            borderRadius: 84,
            background: "rgba(35, 27, 59, 0.55)",
            border: "10px solid rgba(196, 181, 253, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <svg
            width="210"
            height="210"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 2.75L14.72 8.26L20.8 9.14L16.4 13.43L17.44 19.49L12 16.63L6.56 19.49L7.6 13.43L3.2 9.14L9.28 8.26L12 2.75Z"
              stroke="#FFFFFF"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  );
}
