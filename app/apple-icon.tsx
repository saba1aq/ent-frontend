import { ImageResponse } from "next/og";

export const size = { width: 360, height: 360 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f5f3ef",
        }}
      >
        <svg width="248" height="248" viewBox="0 0 32 32" fill="none">
          <path d="M8 14v4a6 6 0 0 0 12 0v-4" stroke="#071e2e" strokeWidth="4" strokeLinecap="round" />
          <path d="M20 15V10" stroke="#ff5f00" strokeWidth="4" />
          <path d="M20 5 25 11H15z" fill="#ff5f00" stroke="#ff5f00" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    size,
  );
}
