

const Dakuten = String.fromCodePoint(0x3099);
const Handakuten = String.fromCodePoint(0x309a);

function hasDakuten(s: string): boolean {
  return s.normalize("NFD").includes(Dakuten);
}

function hasHandakuten(s: string): boolean {
  return s.normalize("NFD").includes(Handakuten);
}

function hasAny(s: string): boolean {
  const norm = s.normalize("NFD");
  return norm.includes(Dakuten) || norm.includes(Handakuten);
}

export {hasDakuten, hasHandakuten, hasAny}