#!/usr/bin/env python3
"""Build the self-hosted Source Serif 4 Latin WOFF2 files.

Download the two variable TTFs from the Google Fonts repository:
https://github.com/google/fonts/tree/main/ofl/sourceserif4

Then run:
    python scripts/build-source-serif-subsets.py --source-dir <download-directory>
"""

import argparse
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "public" / "fonts"
UNICODES = (
    "U+0020-007E,U+00A0,U+00E9,U+00F3-00F4,"
    "U+2013-2014,U+2018-201D,U+2026"
)
FONTS = (
    ("SourceSerif4-Roman-VF.ttf", "SourceSerif4-Regular-latin.woff2", 400),
    ("SourceSerif4-Italic-VF.ttf", "SourceSerif4-Italic-latin.woff2", 400),
    ("SourceSerif4-Roman-VF.ttf", "SourceSerif4-Semibold-latin.woff2", 600),
)


def build(source: Path, destination: Path, weight: int) -> None:
    font = TTFont(source)
    font = instantiateVariableFont(
        font,
        {"opsz": 16, "wght": weight},
        inplace=True,
        optimize=True,
    )

    options = subset.Options()
    options.flavor = "woff2"
    options.layout_features = ["kern", "liga", "clig", "calt"]
    options.notdef_glyph = True
    options.recommended_glyphs = True

    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=subset.parse_unicodes(UNICODES))
    subsetter.subset(font)
    destination.parent.mkdir(parents=True, exist_ok=True)
    font.save(destination)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--source-dir", required=True, type=Path)
    args = parser.parse_args()

    for source_name, output_name, weight in FONTS:
        destination = OUTPUT_DIR / output_name
        build(args.source_dir / source_name, destination, weight)
        print(f"{output_name}: {destination.stat().st_size} bytes")


if __name__ == "__main__":
    main()
