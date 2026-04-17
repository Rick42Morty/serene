import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

// sRGB approximation of --primary: oklch(0.58 0.055 145) (sage green).
const PRIMARY = "#728f6b";
const PRIMARY_FG = "#fcfcfc";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: PRIMARY,
          borderRadius: "50%",
          color: PRIMARY_FG,
          fontSize: 22,
          fontWeight: 600,
          letterSpacing: "-1px",
          fontFamily: "system-ui, -apple-system, Segoe UI, sans-serif",
        }}
      >
        S
      </div>
    ),
    { ...size },
  );
}
