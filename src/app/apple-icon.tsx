import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";

export const size = { width: 180, height: 180 };
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
          background: "#07080c",
          color: "#7c95ff",
          fontSize: 76,
          fontWeight: 700,
          letterSpacing: -2,
        }}
      >
        {profile.initials}
      </div>
    ),
    size,
  );
}
