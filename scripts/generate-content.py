# -*- coding: utf-8 -*-
"""Копирует правила и собирает каталог референсов для лендинга."""
from __future__ import annotations

import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
SITE = HERE.parent
WORK = SITE.parent
RULES_SRC = WORK / "правила"
RULES_DST = SITE / "src" / "content" / "rules"
REFS_SRC = WORK / "референсы-фракций"
CATALOG = SITE / "src" / "content" / "refs.json"
REFS_PUBLIC = SITE / "public" / "refs"
WEB_MAX_SIDE = 1280
JPEG_QUALITY = 82

FACTIONS = [
    {
        "id": "rode",
        "folder": "01-eskadra-Rode",
        "name": "Эскадра Роде",
        "short": "Каперы",
        "blurb": "Каперская эскадра Карстена Роде. Ядро сюжета: охота, царский патент, соблазн сбыта мимо Нарвы.",
    },
    {
        "id": "bornholm",
        "folder": "02-Bornholm",
        "name": "Борнхольм",
        "short": "Рённе",
        "blurb": "Датский остров под управлением Любека. Фактическая база флотилии: ремонт, набор команды, сбыт призов.",
    },
    {
        "id": "narva",
        "folder": "03-Narva",
        "name": "Нарва",
        "short": "Окно к царю",
        "blurb": "Единственная русская ключевая локация полигона. Через наместника капер держит связь с царём и сдаёт десятину.",
    },
    {
        "id": "kopenhagen",
        "folder": "04-Kopenhagen",
        "name": "Копенгаген",
        "short": "Датский двор",
        "blurb": "Покровительство Фредерика II — и риск ареста. Двор, Зундская пошлина, дипломатия Северной семилетней войны.",
    },
    {
        "id": "sweden",
        "folder": "05-Shveciya",
        "name": "Швеция",
        "short": "Ревель",
        "blurb": "Противник на море и в Эстляндии. Королевский сине-жёлтый цвет, ревельский контур, охота на каперов.",
    },
    {
        "id": "gdansk",
        "folder": "06-Gdansk",
        "name": "Гданьск",
        "short": "Данциг",
        "blurb": "Богатые караваны Речи Посполитой, ганзейский патрициат, охотничья цель эскадры и ответные конвои.",
    },
    {
        "id": "lubeck",
        "folder": "07-Ganza-Lyubek",
        "name": "Любек",
        "short": "Ганза",
        "blurb": "Контроль Борнхольма, торг, информация. Двойная лояльность: оборот призов и давление дворов.",
    },
]


def clean_role(cell: str) -> str:
    cell = re.sub(r"\*\*", "", cell).strip()
    if "→" in cell:
        cell = cell.split("→", 1)[1].strip()
    return cell


def parse_sostav(folder: Path) -> list[dict]:
    text = (folder / "SOSTAV.md").read_text(encoding="utf-8")
    parts = re.split(r"\n## ", text)
    groups = []
    for part in parts[1:]:
        lines = part.splitlines()
        title = lines[0].strip()
        items = []
        for line in lines[1:]:
            m = re.match(r"\|\s*([0-9]{2}-[^|]+\.png)\s*\|\s*(.+?)\s*\|", line)
            if not m:
                continue
            fname, role = m.group(1).strip(), clean_role(m.group(2))
            if not (folder / fname).exists():
                continue
            items.append({"file": fname, "role": role})
        if items:
            groups.append({"title": title, "items": items})
    return groups


def copy_rules() -> None:
    RULES_DST.mkdir(parents=True, exist_ok=True)
    for src in sorted(RULES_SRC.glob("*.md")):
        if src.name.startswith("00-"):
            continue
        raw = src.read_text(encoding="utf-8")
        kept = []
        for line in raw.splitlines():
            if line.startswith("←"):
                continue
            kept.append(line)
        body = "\n".join(kept)
        body = re.sub(r"\n---\n+", "\n\n", body, count=1).strip() + "\n"
        RULES_DST.joinpath(src.name).write_text(body, encoding="utf-8")


def write_catalog() -> None:
    out = []
    for meta in FACTIONS:
        folder = REFS_SRC / meta["folder"]
        groups = parse_sostav(folder)
        n = sum(len(g["items"]) for g in groups)
        out.append({**meta, "count": n, "groups": groups})
    CATALOG.parent.mkdir(parents=True, exist_ok=True)
    CATALOG.write_text(json.dumps(out, ensure_ascii=False, indent=2), encoding="utf-8")
    print("refs", sum(f["count"] for f in out), "images in catalog")


def write_web_image(src: Path, dst: Path) -> None:
    from PIL import Image

    dst.parent.mkdir(parents=True, exist_ok=True)
    with Image.open(src) as im:
        im = im.convert("RGB")
        w, h = im.size
        scale = WEB_MAX_SIDE / max(w, h)
        if scale < 1:
            im = im.resize((round(w * scale), round(h * scale)), Image.Resampling.LANCZOS)
        im.save(dst, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)


def copy_ref_images(catalog: list[dict]) -> None:
    n = 0
    bytes_out = 0
    for faction in catalog:
        folder = faction["folder"]
        src_dir = REFS_SRC / folder
        for group in faction["groups"]:
            for item in group["items"]:
                src = src_dir / item["file"]
                if not src.exists():
                    continue
                dst = REFS_PUBLIC / folder / item["file"]
                write_web_image(src, dst)
                bytes_out += dst.stat().st_size
                n += 1
    print(f"web refs {n} files -> {REFS_PUBLIC} ({bytes_out / 1e6:.1f} MB, jpeg in .png names)")


if __name__ == "__main__":
    if not RULES_SRC.exists():
        print("skip generate: no", RULES_SRC, "(ожидается соседняя папка проекта)")
        raise SystemExit(0)
    copy_rules()
    catalog = []
    for meta in FACTIONS:
        folder = REFS_SRC / meta["folder"]
        groups = parse_sostav(folder)
        n = sum(len(g["items"]) for g in groups)
        catalog.append({**meta, "count": n, "groups": groups})
    CATALOG.parent.mkdir(parents=True, exist_ok=True)
    CATALOG.write_text(json.dumps(catalog, ensure_ascii=False, indent=2), encoding="utf-8")
    print("refs", sum(f["count"] for f in catalog), "images in catalog")
    copy_ref_images(catalog)
    print("rules ->", RULES_DST)
    print("catalog ->", CATALOG)
