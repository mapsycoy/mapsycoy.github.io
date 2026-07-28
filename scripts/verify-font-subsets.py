#!/usr/bin/env python3
"""Verify site characters in subset WOFF2 fonts."""
import argparse
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
sys.stdout.reconfigure(encoding=bytes([117, 116, 102, 45, 56]).decode())
ROOT = Path(__file__).resolve().parents[1]
STEMS = ("EBSHunminjeongeumR", "EBSHunminjeongeumSB", "EBSHunminjeongeumL")
SOURCE_SERIF_FILES = (
    "SourceSerif4-Regular-latin.woff2",
    "SourceSerif4-Italic-latin.woff2",
    "SourceSerif4-Semibold-latin.woff2",
)
SOURCE_SERIF_REQUIRED = set(range(0x20, 0x7F)) | {
    0x00A0, 0x00E9, 0x00F3, 0x00F4, 0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026
}
EXTS = {".astro", ".css", ".html", ".js", ".json", ".jsx", ".md", ".mdx", ".mjs", ".ts", ".tsx", ".txt", ".yml", ".yaml"}
def chars():
    paths = [p for p in (ROOT / "src").rglob("*") if p.is_file() and p.suffix.lower() in EXTS]
    paths += [p for p in ROOT.rglob("*.md") if "node_modules" not in p.parts]
    return {ord(c) for p in set(paths) for c in p.read_text(encoding="utf-8") if not c.isspace()}
def cmap(path):
    with TTFont(path, lazy=True) as font:
        return set(font.getBestCmap())
def show(points):
    points = sorted(points)
    text = " ".join(f"{chr(cp)}(U+{cp:04X})" for cp in points[:30])
    return text + (f" ... +{len(points)-30} more" if len(points) > 30 else "")
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", type=Path)
    args = parser.parse_args()
    used, failed = chars(), False
    for stem in STEMS:
        subset = cmap(ROOT / "public" / "fonts" / f"{stem}.woff2")
        source = cmap(args.source_dir / f"{stem}.ttf") if args.source_dir else subset
        required, unsupported = used & source, used - source
        missing = required - subset
        print(f"{stem}: {len(subset)} mappings; {len(required)} required; {len(missing)} missing")
        if unsupported: print(f"  unsupported by original ({len(unsupported)}): {show(unsupported)}")
        if missing:
            print(f"  missing after subsetting: {show(missing)}")
            failed = True
    for filename in SOURCE_SERIF_FILES:
        mappings = cmap(ROOT / "public" / "fonts" / filename)
        missing = SOURCE_SERIF_REQUIRED - mappings
        print(f"{filename}: {len(mappings)} mappings; {len(missing)} required Latin mappings missing")
        if missing:
            print(f"  missing after subsetting: {show(missing)}")
            failed = True
    return int(failed)
if __name__ == "__main__":
    raise SystemExit(main())
