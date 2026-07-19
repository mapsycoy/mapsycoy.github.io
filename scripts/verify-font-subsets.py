#!/usr/bin/env python3
"""Verify site characters in subset WOFF2 fonts."""
import argparse
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
sys.stdout.reconfigure(encoding=bytes([117, 116, 102, 45, 56]).decode())
ROOT = Path(__file__).resolve().parents[1]
STEMS = ("EBSHunminjeongeumR", "EBSHunminjeongeumSB", "EBSHunminjeongeumL")
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
        source = cmap(args.source_dir / f"{stem}.ttf") if args.source_dir else used
        required, unsupported = used & source, used - source
        missing = required - subset
        print(f"{stem}: {len(subset)} mappings; {len(required)} required; {len(missing)} missing")
        if unsupported: print(f"  unsupported by original ({len(unsupported)}): {show(unsupported)}")
        if missing:
            print(f"  missing after subsetting: {show(missing)}")
            failed = True
    return int(failed)
if __name__ == "__main__":
    raise SystemExit(main())
