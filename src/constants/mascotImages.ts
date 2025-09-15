// Mapping for mascot moods to asset paths. Add new moods by importing the file and inserting below.
// The images are located in src/assets.

export type MascotMood =
  | "normal"
  | "smiling"
  | "lookdown"
  | "lookdown2"
  | "dogeza"
  | "dogeza2"
  | "ojigi"
  | "ojigi2"
  | "pray";

// Using import assertions ensures Vite processes the assets and returns URLs.
import majin_normal from "@/assets/majin_normal.png";
import majin_smiling from "@/assets/majin_smiling.png";
import majin_lookdown from "@/assets/majin_lookdown.png";
import majin_lookdown2 from "@/assets/majin_lookdown2.png";
import majin_dogeza from "@/assets/majin_dogeza.png";
import majin_dogeza2 from "@/assets/majin_dogeza2.png";
import majin_ojigi from "@/assets/majin_ojigi.png";
import majin_ojigi2 from "@/assets/majin_ojigi2.png";
import majin_pray from "@/assets/majin_pray.png";

export const MASCOT_IMAGE_MAP: Record<MascotMood, string> = {
  normal: majin_normal,
  smiling: majin_smiling,
  lookdown: majin_lookdown,
  lookdown2: majin_lookdown2,
  dogeza: majin_dogeza,
  dogeza2: majin_dogeza2,
  ojigi: majin_ojigi,
  ojigi2: majin_ojigi2,
  pray: majin_pray,
};

const moodList = Object.keys(MASCOT_IMAGE_MAP) as MascotMood[];

export function getRandomMascotMood(
  exclude?: MascotMood | MascotMood[]
): MascotMood {
  const ex = exclude ? (Array.isArray(exclude) ? exclude : [exclude]) : [];
  const filtered = moodList.filter((m) => !ex.includes(m));
  if (!filtered.length) return "normal";
  return filtered[Math.floor(Math.random() * filtered.length)];
}

export function getMascotImage(mood: MascotMood): string {
  return MASCOT_IMAGE_MAP[mood] ?? majin_normal;
}
