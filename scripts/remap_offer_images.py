# -*- coding: utf-8 -*-
"""Give every offer a unique photo file and rewrite data-postgres.sql."""
from __future__ import annotations

import re
import shutil
from pathlib import Path

from PIL import Image, ImageEnhance, ImageOps

ROOT = Path(__file__).resolve().parents[1]
SQL = ROOT / "src" / "main" / "resources" / "data-postgres.sql"
ASSETS = Path(r"C:\Users\Laslo Uri\.cursor\projects\c-Users-Laslo-Uri-Desktop-my-projects\assets")
OFFER_DIR = ROOT / "src" / "main" / "resources" / "static" / "images" / "offers"
HOME_DIR = ROOT / "src" / "main" / "resources" / "static" / "images"

GENERATED = {
    1: "offer-1-nikos.png",
    2: "offer-2-shrek.png",
    3: "offer-3-fiona.png",
    4: "offer-4-azure.png",
    5: "offer-5-pine.png",
    6: "offer-6-lagoon.png",
    7: "offer-7-coral.png",
    8: "offer-8-olive.png",
    9: "offer-9-seaglass.png",
    10: "offer-10-amber.png",
    11: "offer-11-cypress.png",
    12: "offer-12-pearl.png",
    13: "offer-13-sunset.png",
    14: "offer-14-harbor.png",
    15: "offer-15-willow.png",
    16: "offer-16-adriatic.png",
    91: "offer-91-titanik.png",
    92: "offer-92-marlin.png",
    93: "offer-93-breeze.png",
    95: "offer-95-hook.png",
    96: "offer-96-dawn.png",
    97: "offer-97-wave.png",
    98: "offer-98-nautilus.png",
    99: "offer-99-pelican.png",
    100: "offer-100-hopper.png",
    101: "offer-101-coral.png",
    102: "offer-102-petrel.png",
    103: "offer-103-net.png",
    181: "offer-181-hippos.png",
    182: "offer-182-dawncast.png",
    183: "offer-183-kids.png",
    184: "offer-184-spin.png",
    185: "offer-185-fly.png",
    186: "offer-186-night.png",
    187: "offer-187-kayak.png",
    188: "offer-188-release.png",
    189: "offer-189-reef.png",
    190: "offer-190-drift.png",
    191: "offer-191-troll.png",
    192: "offer-192-pier.png",
    17: "offer-17-moonlit.png",
    18: "offer-18-fisherman.png",
    19: "offer-19-nikos2.png",
    20: "offer-20-shrek2.png",
    21: "offer-21-fiona2.png",
    22: "offer-22-azure2.png",
    23: "offer-23-pine2.png",
    24: "offer-24-lagoon2.png",
    25: "offer-25-coral2.png",
    45: "offer-45-seaglass3.png",
    65: "offer-65-cypress4.png",
    67: "offer-67-sunset4.png",
    89: "offer-89-moonlit5.png",
    94: "offer-94-pride.png",
    113: "offer-113-hook2.png",
    129: "offer-129-breeze3.png",
    135: "offer-135-pelican3.png",
    157: "offer-157-luckynet4.png",
    179: "offer-179-skipjack5.png",
    193: "offer-193-jigging.png",
    203: "offer-203-fly2.png",
    225: "offer-225-reef3.png",
    247: "offer-247-jig4.png",
    269: "offer-269-ice5.png",
}

POOL = {
    0: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 45, 65, 67, 89],
    1: [91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 113, 129, 135, 157, 179],
    2: [181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 203, 225, 247, 269],
}


def parse_offers(sql: str) -> dict[int, int]:
    out = {}
    for line in sql.splitlines():
        if "INSERT INTO public.offer(" not in line:
            continue
        ident = re.search(r"values\((\d+),", line)
        tail = re.search(
            r", ([012]), ([0-9]+\.[0-9]+), '.*', ([0-9]+\.[0-9]+), (\d+), (\d+)\);\s*$",
            line,
        )
        if ident and tail:
            out[int(ident.group(1))] = int(tail.group(1))
    return out


def parse_links(sql: str) -> dict[int, list[int]]:
    links: dict[int, list[int]] = {}
    for m in re.finditer(
        r"INSERT INTO public\.offer_images\(offer_id, images_id\) VALUES \((\d+), (\d+)\);",
        sql,
    ):
        links.setdefault(int(m.group(1)), []).append(int(m.group(2)))
    return links


def unique_variant(src: Path, dest: Path, salt: int) -> None:
    img = Image.open(src).convert("RGB")
    w, h = img.size
    # Distinct window into the photo so copies do not look like the same listing.
    left = (salt * 13) % 48
    top = (salt * 7) % 36
    right = w - ((salt * 11) % 48)
    bottom = h - ((salt * 5) % 36)
    if right - left < w // 2 or bottom - top < h // 2:
        left, top, right, bottom = 12, 12, w - 12, h - 12
    img = img.crop((left, top, right, bottom)).resize((w, h), Image.Resampling.LANCZOS)
    if salt % 2:
        img = ImageOps.mirror(img)
    if salt % 3 == 0:
        img = ImageOps.solarize(img, threshold=220)
        img = ImageEnhance.Color(img).enhance(1.15)
    r, g, b = img.split()
    chans = [r, g, b]
    order = [(0, 1, 2), (0, 2, 1), (1, 0, 2), (2, 1, 0)][salt % 4]
    if salt % 5 == 0:
        img = Image.merge("RGB", (chans[order[0]], chans[order[1]], chans[order[2]]))
    img = ImageEnhance.Color(img).enhance(0.80 + (salt % 9) * 0.06)
    img = ImageEnhance.Contrast(img).enhance(0.88 + (salt % 6) * 0.05)
    img = ImageEnhance.Brightness(img).enhance(0.86 + (salt % 8) * 0.04)
    dest.parent.mkdir(parents=True, exist_ok=True)
    img.save(dest, "PNG", optimize=True)


def main() -> None:
    OFFER_DIR.mkdir(parents=True, exist_ok=True)
    sql = SQL.read_text(encoding="utf-8")
    offers = parse_offers(sql)
    print("offers parsed", len(offers))

    for oid, name in GENERATED.items():
        src = ASSETS / name
        if not src.exists():
            raise SystemExit(f"missing generated asset {src}")
        shutil.copyfile(src, OFFER_DIR / f"{oid}.png")

    for name in ("homepage-bungalows.png", "homepage-boats.png", "homepage-courses.png"):
        src = ASSETS / name
        if src.exists():
            shutil.copyfile(src, HOME_DIR / name)
            print("homepage", name)

    missing = [oid for oid in offers if not (OFFER_DIR / f"{oid}.png").exists()]
    for oid in missing:
        otype = offers.get(oid, 0)
        pool = POOL.get(otype, POOL[0])
        src_id = pool[(oid - 1) % len(pool)]
        unique_variant(OFFER_DIR / f"{src_id}.png", OFFER_DIR / f"{oid}.png", oid)
    print("wrote unique files", len(offers))

    def repl_item(m: re.Match[str]) -> str:
        img_id = int(m.group(1))
        # find offer for this image
        return m.group(0)

    # Map image_id -> offer_id (first link wins)
    img_to_offer: dict[int, int] = {}
    for oid, imgs in parse_links(sql).items():
        for iid in imgs:
            img_to_offer.setdefault(iid, oid)

    def repl_path(m: re.Match[str]) -> str:
        iid = int(m.group(1))
        oid = img_to_offer.get(iid)
        if oid is None:
            return m.group(0)
        return (
            f"INSERT INTO public.image_item(id, is_deleted, name, filepath) VALUES "
            f"({iid}, false, '{m.group(2)}', 'images/offers/{oid}.png')"
        )

    new_sql, n = re.subn(
        r"INSERT INTO public\.image_item\(id, is_deleted, name, filepath\) VALUES "
        r"\((\d+), false, '([^']*)', 'images/bungalow-images/[^']+'\)",
        repl_path,
        sql,
    )
    SQL.write_text(new_sql, encoding="utf-8")
    print("rewrote image_item rows", n)


if __name__ == "__main__":
    main()
