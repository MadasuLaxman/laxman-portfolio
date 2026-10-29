import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { cacheLife } from "next/cache";
import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };

// Cached so the social images stay static: reading a file is uncached I/O under Cache Components.
async function portraitDataUrl() {
  "use cache";
  cacheLife("max");
  const file = await readFile(join(process.cwd(), "src/assets/og-portrait.jpg"));
  return `data:image/jpeg;base64,${file.toString("base64")}`;
}

// Shared social-card layout for the site and each case study.
// Satori renders it: every element with several children needs display: flex.
export async function renderOgCard({
  eyebrow,
  title,
  subtitle,
  stages,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  stages: string[];
}) {
  const portrait = await portraitDataUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          background: "#07080c",
          backgroundImage:
            "radial-gradient(circle at 80% 10%, rgba(124,149,255,0.22), transparent 50%), radial-gradient(circle at 100% 100%, rgba(183,148,255,0.12), transparent 45%)",
          color: "#e9ebf1",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 48 }}>
          <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", fontSize: 20, color: "#a1a9b8", letterSpacing: 3, textTransform: "uppercase" }}>
              {eyebrow}
            </div>
            <div style={{ display: "flex", marginTop: 26, fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
              {title}
            </div>
            <div style={{ display: "flex", marginTop: 24, fontSize: 30, lineHeight: 1.35, color: "#a1a9b8", maxWidth: 700 }}>
              {subtitle}
            </div>
          </div>
          <div
            style={{
              display: "flex",
              padding: 5,
              borderRadius: 9999,
              backgroundImage: "linear-gradient(135deg, #7c95ff, #b794ff)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- Satori needs a plain img */}
            <img
              src={portrait}
              width={260}
              height={260}
              alt=""
              style={{ borderRadius: 9999, border: "6px solid #07080c", objectFit: "cover" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 12, fontSize: 20 }}>
          {stages.map((stage, index) => (
            <div key={stage} style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  display: "flex",
                  padding: "10px 16px",
                  borderRadius: 10,
                  border: "1px solid #2b3242",
                  background: "#0d1016",
                  color: "#e9ebf1",
                }}
              >
                {stage}
              </div>
              {index < stages.length - 1 ? <div style={{ display: "flex", color: "#7c95ff" }}>→</div> : null}
            </div>
          ))}
        </div>
      </div>
    ),
    ogSize,
  );
}
