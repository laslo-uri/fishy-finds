"""Generate a large ISA-aligned data-postgres.sql seed (>=200 entities)."""
from pathlib import Path
from datetime import datetime, timedelta

OUT = Path(__file__).resolve().parents[1] / "src" / "main" / "resources" / "data-postgres.sql"
# bcrypt for plaintext "password" (verified with BCryptPasswordEncoder)
PWD = "$2a$10$vDtWS1msA6l9gLeFeGkfsOldGTtQjWmP.PFEVmm3FVVJ9QHeLNz7i"

# Scale factor for users/offers/reservations/terms (demo accounts 1–8 stay fixed).
SCALE = 5

lines: list[str] = []


def add(s: str = "") -> None:
    lines.append(s)


def esc(s: str) -> str:
    return s.replace("'", "''")


def expand_names(base: list[str], target_min: int) -> list[str]:
    """Repeat base names with numeric suffixes until at least target_min entries."""
    out = list(base)
    n = 2
    while len(out) < target_min:
        for name in base:
            out.append(f"{name} {n}")
            if len(out) >= target_min:
                break
        n += 1
    return out


add("-- ============================================================")
add("-- FishyFinds mock seed (ISA-aligned, large demo dataset)")
add(f"-- Demo password for ALL users: password  |  SCALE={SCALE}")
add("-- Generated for local create-drop + data-postgres.sql")
add("-- ============================================================")
add("--AUTHORITIES BEGIN--")
for i, name in enumerate(
    [
        "ROLE_CUSTOMER",
        "ROLE_BUNGALOW",
        "ROLE_BOAT",
        "ROLE_INSTRUCTOR",
        "ROLE_ADMIN",
        "ROLE_COMMON",
    ],
    1,
):
    add(f"INSERT INTO authority values ({i}, '{name}');")
add("--AUTHORITIES END--")

locations = [
    ("Leptokaria", "Greece", 23.5, 44.5, "Portokalo", 4),
    ("Neos Marmaras", "Greece", 23.6, 40.1, "Harbor Road", 12),
    ("Thassos Town", "Greece", 24.7, 40.8, "Waterfront", 3),
    ("Zlatibor", "Serbia", 19.7, 43.7, "Ski Center", 8),
    ("Kotor", "Montenegro", 18.8, 42.4, "Old Town", 1),
    ("Split", "Croatia", 16.4, 43.5, "Riva", 22),
    ("Dubrovnik", "Croatia", 18.1, 42.6, "Ploce Gate", 5),
    ("Ohrid", "North Macedonia", 20.8, 41.1, "Lake Shore", 9),
    ("Herceg Novi", "Montenegro", 18.5, 42.5, "Pet Danica", 17),
    ("Pula", "Croatia", 13.8, 44.9, "Marina", 2),
    ("Budva", "Montenegro", 18.8, 42.3, "Slovenska", 11),
    ("Corfu", "Greece", 19.9, 39.6, "Kanoni", 6),
    ("Sutomore", "Montenegro", 19.0, 42.1, "Beach Blvd", 14),
    ("Novi Sad", "Serbia", 19.8, 45.3, "Danube Quay", 7),
    ("Belgrade", "Serbia", 20.5, 44.8, "Sava Promenade", 19),
    ("Hvar", "Croatia", 16.4, 43.2, "Port Street", 4),
    ("Lefkada", "Greece", 20.7, 38.8, "Nydri Bay", 10),
    ("Vodice", "Croatia", 15.8, 43.8, "Marina Lane", 3),
    ("Ulcinj", "Montenegro", 19.2, 41.9, "Old Bazaar", 8),
    ("Skiathos", "Greece", 23.5, 39.2, "Boat Harbor", 1),
]
# Extra locations for larger offer map coverage
_extra_loc_cities = [
    ("Tivat", "Montenegro", 18.7, 42.4, "Porto Montenegro", 1),
    ("Zadar", "Croatia", 15.2, 44.1, "Riva Nova", 6),
    ("Rovinj", "Croatia", 13.6, 45.1, "Harbor Walk", 9),
    ("Bar", "Montenegro", 19.1, 42.1, "Tophana", 3),
    ("Igoumenitsa", "Greece", 20.3, 39.5, "Ferry Quay", 2),
    ("Volos", "Greece", 22.9, 39.4, "Argonauts", 11),
    ("Subotica", "Serbia", 19.7, 46.1, "Palic Lake", 5),
    ("Kragujevac", "Serbia", 20.9, 44.0, "Sumarice", 7),
    ("Makarska", "Croatia", 17.0, 43.3, "Beach Promenade", 14),
    ("Cavtat", "Croatia", 18.2, 42.6, "Tiha Bay", 4),
]
for n in range(2, SCALE + 1):
    for city, country, lon, lat, street, num in _extra_loc_cities:
        locations.append(
            (f"{city} {n}", country, lon + 0.01 * n, lat + 0.01 * n, f"{street} {n}", num + n)
        )

add("--LOCATIONS BEGIN--")
for i, (city, country, lon, lat, street, num) in enumerate(locations, 1):
    add(
        f"INSERT INTO location values ({i}, '{esc(city)}', '{esc(country)}', {lon}, {lat}, '{esc(street)}', {num});"
    )
add("--LOCATIONS END--")
N_LOC = len(locations)
add("--LOYALTY PROGRAM BEGIN--")
loyalty = [
    (1, 0, "Unborn Shark", 0, 0),
    (2, 20, "Baby Shark", 0, 50),
    (3, 40, "Parent Shark", 5, 100),
    (4, 60, "Grandparent Shark", 10, 500),
]
for row in loyalty:
    add(
        f"INSERT INTO loyalty_program values ({row[0]}, {row[1]}, '{row[2]}', {row[3]},  {row[4]});"
    )
add("--LOYALTY PROGRAM END--")

customers = [
    (
        1,
        "Nikole Pasica 9",
        "Novi Sad",
        "Serbia",
        "mail@mail.com",
        "Miroslav",
        "Bozidarovic",
        "06234578",
    ),
]
customer_names = [
    ("Ana", "Petrovic", "ana.petrovic@mail.com", "06211101"),
    ("Marko", "Jovic", "marko.jovic@mail.com", "06211102"),
    ("Jelena", "Nikolic", "jelena.nikolic@mail.com", "06211103"),
    ("Stefan", "Ilic", "stefan.ilic@mail.com", "06211104"),
    ("Ivana", "Stojanovic", "ivana.stojanovic@mail.com", "06211105"),
    ("Nikola", "Djordjevic", "nikola.dj@mail.com", "06211106"),
    ("Milica", "Pavlovic", "milica.pavlovic@mail.com", "06211107"),
    ("Luka", "Simic", "luka.simic@mail.com", "06211108"),
    ("Sara", "Kostic", "sara.kostic@mail.com", "06211109"),
    ("Petar", "Vasic", "petar.vasic@mail.com", "06211110"),
    ("Teodora", "Milenkovic", "teo.milenkovic@mail.com", "06211111"),
    ("David", "Ristic", "david.ristic@mail.com", "06211112"),
    ("Elena", "Tomic", "elena.tomic@mail.com", "06211113"),
    ("Filip", "Savic", "filip.savic@mail.com", "06211114"),
    ("Nina", "Zoric", "nina.zoric@mail.com", "06211115"),
    ("Aleksa", "Popovic", "aleksa.popovic@mail.com", "06211116"),
    ("Maja", "Lazic", "maja.lazic@mail.com", "06211117"),
    ("Vuk", "Marinkovic", "vuk.marinkovic@mail.com", "06211118"),
    ("Sofija", "Andjelkovic", "sofija.andjel@mail.com", "06211119"),
]
# Scale customers: generate additional synthetic guests (keep mail@mail.com as id=1)
_base_customers = list(customer_names)
for batch in range(2, SCALE + 1):
    for i, (fn, ln, email, phone) in enumerate(_base_customers):
        local, domain = email.split("@", 1)
        customer_names.append(
            (fn, ln, f"{local}.b{batch}@{domain}", f"{int(phone) + batch * 1000}")
        )
cid = 9
for fn, ln, email, phone in customer_names:
    customers.append(
        (
            cid,
            f"Street {cid}",
            "Novi Sad" if cid % 2 else "Belgrade",
            "Serbia",
            email,
            fn,
            ln,
            phone,
        )
    )
    cid += 1

bungalow_owners = [
    (
        2,
        "Zorana Radmilovica 6",
        "Novi Sad",
        "Serbia",
        "zokaMagic@mail.com",
        "Zorica",
        "Randjelovic",
        "06345678",
        "Family bungalows near quiet beaches",
    ),
    (
        3,
        "Boska Buhe 2",
        "Novi Sad",
        "Serbia",
        "petarParkerovic@mail.com",
        "Petar",
        "Parkerovic",
        "06145678",
        "Mountain and lakeside cabins",
    ),
]
bo_extra = [
    ("Milan", "Kabina", "milan.kabina@mail.com", "06320001", "Eco bungalows with boat dock"),
    ("Dragana", "Sumadija", "dragana.sumadija@mail.com", "06320002", "Traditional wood cabins"),
    ("Igor", "More", "igor.more@mail.com", "06320003", "Luxury seaside bungalows"),
    ("Tamara", "Planina", "tamara.planina@mail.com", "06320004", "Alpine weekend retreats"),
]
_bo_base = list(bo_extra)
for batch in range(2, SCALE + 1):
    for fn, ln, email, phone, reason in _bo_base:
        local, domain = email.split("@", 1)
        bo_extra.append((fn, ln, f"{local}.b{batch}@{domain}", f"{int(phone) + batch * 10}", reason))
uid = max(c[0] for c in customers) + 1
for fn, ln, email, phone, reason in bo_extra:
    bungalow_owners.append(
        (uid, f"Owner Ave {uid}", "Novi Sad", "Serbia", email, fn, ln, phone, reason)
    )
    uid += 1

boat_owners = [
    (
        4,
        "Bulevar Oslobodjenja 4",
        "Novi Sad",
        "Serbia",
        "zokiSumi@mail.com",
        "Zoran",
        "Sumadin",
        "06545678",
        "Fleet of fishing and leisure boats",
    ),
    (
        5,
        "Papa Pavla 4",
        "Novi Sad",
        "Serbia",
        "pavlaPapa@mail.com",
        "Pavle",
        "Pap",
        "06745678",
        "Charter boats with skipper option",
    ),
]
bt_extra = [
    ("Goran", "Kapetan", "goran.kapetan@mail.com", "06530001", "Speedboats and day charters"),
    ("Veselin", "Sidro", "veselin.sidro@mail.com", "06530002", "Sailboats for coastal tours"),
    ("Bojana", "Talas", "bojana.talas@mail.com", "06530003", "Family pontoon boats"),
    ("Rade", "Kompas", "rade.kompas@mail.com", "06530004", "Deep-sea fishing vessels"),
]
_bt_base = list(bt_extra)
for batch in range(2, SCALE + 1):
    for fn, ln, email, phone, reason in _bt_base:
        local, domain = email.split("@", 1)
        bt_extra.append((fn, ln, f"{local}.b{batch}@{domain}", f"{int(phone) + batch * 10}", reason))
for fn, ln, email, phone, reason in bt_extra:
    boat_owners.append(
        (
            uid,
            f"Marina {uid}",
            "Split" if uid % 2 else "Kotor",
            "Croatia" if uid % 2 else "Montenegro",
            email,
            fn,
            ln,
            phone,
            reason,
        )
    )
    uid += 1

instructors = [
    (
        6,
        "Kamenicki put 6a",
        "Novi Sad",
        "Serbia",
        "vesnaVuki@mail.com",
        "Vesna",
        "Vukelic",
        "06645699",
        "Certified fishing guide on lakes and sea",
        "Beginner to advanced angling courses",
    ),
    (
        7,
        "Zmaj Jovina 15",
        "Novi Sad",
        "Serbia",
        "woderwoman@mail.com",
        "Zeljana",
        "Cudesnic",
        "06345111",
        "Fly fishing and catch-and-release ethics",
        "Weekend clinics and private lessons",
    ),
]
ins_extra = [
    (
        "Nemanja",
        "Udica",
        "nemanja.udica@mail.com",
        "06640001",
        "Spinning techniques on Adriatic",
        "Small group sea fishing",
    ),
    (
        "Kristina",
        "Mreza",
        "kristina.mreza@mail.com",
        "06640002",
        "Kids introduction to fishing",
        "Safe riverside workshops",
    ),
    (
        "Ognjen",
        "Mamac",
        "ognjen.mamac@mail.com",
        "06640003",
        "Night fishing and lure craft",
        "Advanced night sessions",
    ),
    (
        "Sanja",
        "Plovilo",
        "sanja.plovilo@mail.com",
        "06640004",
        "Kayak fishing courses",
        "Quiet cove expeditions",
    ),
]
_ins_base = list(ins_extra)
for batch in range(2, SCALE + 1):
    for fn, ln, email, phone, bio, reason in _ins_base:
        local, domain = email.split("@", 1)
        ins_extra.append(
            (fn, ln, f"{local}.b{batch}@{domain}", f"{int(phone) + batch * 10}", bio, reason)
        )
for fn, ln, email, phone, bio, reason in ins_extra:
    instructors.append(
        (
            uid,
            f"Guide St {uid}",
            "Ohrid" if uid % 2 else "Thassos Town",
            "North Macedonia" if uid % 2 else "Greece",
            email,
            fn,
            ln,
            phone,
            bio,
            reason,
        )
    )
    uid += 1

admins = [
    (
        8,
        "Admina Adminovica 15",
        "Admingrad",
        "Adminia",
        "admin@admin.com",
        "Adam",
        "Adminovic",
        "06445348",
        5.0,
    ),
    (
        uid,
        "Second Admin 1",
        "Belgrade",
        "Serbia",
        "admin2@admin.com",
        "Ana",
        "Adminovic",
        "06445349",
        5.0,
    ),
]
uid += 1

add("--USERS BEGIN--")
add("-- Demo password for ALL seeded users (bcrypt): password")

points_cycle = [0, 15, 55, 120, 520]
loyalty_for_points = [1, 1, 2, 3, 4]
penalties = [0, 0, 1, 2, 0, 3, 0, 1]

for idx, (id_, addr, city, country, email, fn, ln, phone) in enumerate(customers):
    add(
        "INSERT INTO public.users(id, address, city, country, email, first_name, is_activated, is_deleted, last_name, last_password_reset_date, number_of_log_ins, password, phone_number, user_type, verification_code) "
        f"VALUES ({id_}, '{esc(addr)}', '{esc(city)}', '{esc(country)}', '{esc(email)}', '{esc(fn)}', true, false, '{esc(ln)}', '01-01-0001', {idx % 5}, '{PWD}', '{phone}', 0, '');"
    )
    pens = penalties[idx % len(penalties)]
    pts = points_cycle[idx % len(points_cycle)]
    if id_ == 1 and pts == 0:
        pts = 15
    loy = loyalty_for_points[idx % len(loyalty_for_points)]
    add(f"INSERT INTO customer values ({pts}, {pens}, {id_}, {loy});")
    if pens:
        add(f"INSERT INTO public.penal(id, customer, number) VALUES({id_}, {id_}, {pens});")

for id_, addr, city, country, email, fn, ln, phone, reason in bungalow_owners:
    add(
        "INSERT INTO public.users(id, address, city, country, email, first_name, is_activated, is_deleted, last_name, last_password_reset_date, number_of_log_ins, password, phone_number, user_type, verification_code) "
        f"VALUES ({id_}, '{esc(addr)}', '{esc(city)}', '{esc(country)}', '{esc(email)}', '{esc(fn)}', true, false, '{esc(ln)}', '01-01-0001', 0, '{PWD}', '{phone}', 1, '');"
    )
    loy = 2 if id_ % 2 == 0 else 3
    add(f"INSERT INTO bungalow_owner values ('{esc(reason)}',1, {id_}, {loy});")

for id_, addr, city, country, email, fn, ln, phone, reason in boat_owners:
    add(
        "INSERT INTO public.users(id, address, city, country, email, first_name, is_activated, is_deleted, last_name, last_password_reset_date, number_of_log_ins, password, phone_number, user_type, verification_code) "
        f"VALUES ({id_}, '{esc(addr)}', '{esc(city)}', '{esc(country)}', '{esc(email)}', '{esc(fn)}', true, false, '{esc(ln)}', '01-01-0001', 0, '{PWD}', '{phone}', 2, '');"
    )
    loy = 2 if id_ % 2 == 0 else 3
    add(f"INSERT INTO boat_owner values ('{esc(reason)}',1, {id_}, {loy});")

for id_, addr, city, country, email, fn, ln, phone, bio, reason in instructors:
    add(
        "INSERT INTO public.users(id, address, city, country, email, first_name, is_activated, is_deleted, last_name, last_password_reset_date, number_of_log_ins, password, phone_number, user_type, verification_code) "
        f"VALUES ({id_}, '{esc(addr)}', '{esc(city)}', '{esc(country)}', '{esc(email)}', '{esc(fn)}', true, false, '{esc(ln)}', '01-01-0001', 0, '{PWD}', '{phone}', 3, '');"
    )
    loy = 2 if id_ % 2 == 0 else 3
    add(f"INSERT INTO instructor values ('{esc(bio)}','{esc(reason)}',1, {id_}, {loy});")

for id_, addr, city, country, email, fn, ln, phone, pct in admins:
    add(
        "INSERT INTO public.users(id, address, city, country, email, first_name, is_activated, is_deleted, last_name, last_password_reset_date, number_of_log_ins, password, phone_number, user_type, verification_code) "
        f"VALUES ({id_}, '{esc(addr)}', '{esc(city)}', '{esc(country)}', '{esc(email)}', '{esc(fn)}', true, false, '{esc(ln)}', '01-01-0001', 0, '{PWD}', '{phone}', 4, '');"
    )
    add(f"INSERT INTO admin values ({pct}, {id_});")

pending_id = uid
add(
    "INSERT INTO public.users(id, address, city, country, email, first_name, is_activated, is_deleted, last_name, last_password_reset_date, number_of_log_ins, password, phone_number, user_type, verification_code) "
    f"VALUES ({pending_id}, 'Pending St 1', 'Novi Sad', 'Serbia', 'pending.owner@mail.com', 'Pending', false, false, 'Owner', '01-01-0001', 0, '{PWD}', '06999999', 1, 'verify-pending');"
)
add(f"INSERT INTO bungalow_owner values ('New bungalow business registration',0, {pending_id}, 1);")
uid += 1
add("--USERS END--")

add("--ENGINES BEGIN--")
engines = list(range(1, 15 * SCALE + 1))
for i in engines:
    add(
        f"INSERT INTO public.engine(id, max_speed, number_of_engines, power) VALUES ({i}, {30 + i * 5}, {(i % 3) + 1}, {80 + i * 20});"
    )
add("--ENGINES END--")

bungalow_owner_ids = [b[0] for b in bungalow_owners]
boat_owner_ids = [b[0] for b in boat_owners]
instructor_ids = [i[0] for i in instructors]

bungalow_names = [
    "Nikos",
    "Shrek house",
    "Fiona",
    "Azure Cabin",
    "Pine Haven",
    "Lagoon Nest",
    "Coral Retreat",
    "Olive Grove Lodge",
    "Seaglass Cottage",
    "Amber Dock House",
    "Cypress Rest",
    "Pearl Bungalow",
    "Sunset Loft",
    "Harbor Nest",
    "Willow Cabin",
    "Adriatic Nest",
    "Moonlit Lodge",
    "Fisherman Hut",
]
bungalow_names = expand_names(bungalow_names, 18 * SCALE)
boat_names = [
    "Titanik",
    "Blue Marlin",
    "Sea Breeze",
    "Captain's Pride",
    "Silver Hook",
    "Dawn Runner",
    "Wave Dancer",
    "Nautilus Day",
    "Pelican Scout",
    "Island Hopper",
    "Coral Drift",
    "Storm Petrel",
    "Lucky Net",
    "Horizon Line",
    "Salt & Scale",
    "Bay Whisper",
    "Skipjack",
    "Compass Rose",
]
boat_names = expand_names(boat_names, 18 * SCALE)
course_names = [
    "Racing with the hippos",
    "Dawn Shore Casting",
    "Kids First Catch",
    "Spinning Masterclass",
    "Fly Fishing Intro",
    "Night Lure Clinic",
    "Kayak Angling Basics",
    "Catch and Release Ethics",
    "Reef Bottom Fishing",
    "River Drift Workshop",
    "Trolling Essentials",
    "Pier Fishing Weekend",
    "Advanced Jigging",
    "Family Lake Outing",
    "Saltwater Baitcraft",
    "Women's Fishing Circle",
    "Winter Ice Prep",
    "Guide Shadow Day",
]
course_names = expand_names(course_names, 18 * SCALE)

add("--OFFERS BEGIN--")
offer_id = 1
bungalow_ids: list[int] = []
boat_ids: list[int] = []
course_ids: list[int] = []

policies = [
    "Cancellation up to 48h returns full price",
    "Cancellation returns half of the price",
    "No refunds within 24h of start",
    "Full refund if weather cancels the trip",
]
rules = [
    "Quiet hours 22:00-07:00",
    "No smoking indoors",
    "Must wear life jackets on deck",
    "Children under 12 supervised at all times",
    "Catch-and-release only unless stated",
    "No glass bottles on boats",
]

for i, name in enumerate(bungalow_names):
    owner = bungalow_owner_ids[i % len(bungalow_owner_ids)]
    loc = (i % N_LOC) + 1
    price = round(25 + (i % 10) * 7.5, 1)
    rating = round(3.5 + (i % 15) * 0.1, 1)
    beds = 2 + (i % 4)
    rooms = 1 + (i % 3)
    cap = beds + 1
    desc = f"{name}: seaside/mountain bungalow with {rooms} rooms and {beds} beds. Walk to water or trail."
    add(
        "INSERT INTO public.offer(id, cancellation_policy, description, max_customer_capacity, offer_name, offer_type, rating, rules_of_conduct, unit_price, users, location) "
        f"values({offer_id}, '{esc(policies[i % 4])}', '{esc(desc)}', {cap}, '{esc(name)}', 0, {rating}, '{esc(rules[i % 6])}', {price}, {owner}, {loc});"
    )
    add(
        f"INSERT INTO public.bungalow(number_of_beds, number_of_rooms, id) VALUES({beds}, {rooms}, {offer_id});"
    )
    bungalow_ids.append(offer_id)
    offer_id += 1

for i, name in enumerate(boat_names):
    owner = boat_owner_ids[i % len(boat_owner_ids)]
    loc = ((i + 3) % N_LOC) + 1
    price = round(40 + (i % 8) * 12.5, 1)
    rating = round(3.8 + (i % 12) * 0.1, 1)
    length = round(5.5 + (i % 10) * 0.7, 1)
    btype = ["fishing skiff", "cabin cruiser", "sailboat", "pontoon", "speedboat", "trawler"][
        i % 6
    ]
    eng = engines[i % len(engines)]
    cap = 2 + (i % 6)
    desc = f"{name}: {btype} ({length}m) for coastal fishing and leisure. Engine #{eng}."
    add(
        "INSERT INTO public.offer(id, cancellation_policy, description, max_customer_capacity, offer_name, offer_type, rating, rules_of_conduct, unit_price, users, location) "
        f"values({offer_id}, '{esc(policies[i % 4])}', '{esc(desc)}', {cap}, '{esc(name)}', 1, {rating}, '{esc(rules[(i + 2) % 6])}', {price}, {owner}, {loc});"
    )
    add(
        f"INSERT INTO public.boat(boat_length, boat_type, id, engine) VALUES({length},'{esc(btype)}', {offer_id}, {eng});"
    )
    boat_ids.append(offer_id)
    offer_id += 1

for i, name in enumerate(course_names):
    owner = instructor_ids[i % len(instructor_ids)]
    loc = ((i + 7) % N_LOC) + 1
    price = round(18 + (i % 9) * 6.0, 1)
    rating = round(4.0 + (i % 10) * 0.1, 1)
    cap = 2 + (i % 5)
    desc = f"{name}: instructor-led fishing adventure suitable for {cap} guests. Gear briefing included."
    add(
        "INSERT INTO public.offer(id, cancellation_policy, description, max_customer_capacity, offer_name, offer_type, rating, rules_of_conduct, unit_price, users, location) "
        f"values({offer_id}, '{esc(policies[i % 4])}', '{esc(desc)}', {cap}, '{esc(name)}', 2, {rating}, '{esc(rules[(i + 1) % 6])}', {price}, {owner}, {loc});"
    )
    add(f"INSERT INTO public.course(id) VALUES ({offer_id});")
    course_ids.append(offer_id)
    offer_id += 1

all_offer_ids = bungalow_ids + boat_ids + course_ids
add("--OFFERS END--")

add("-- ADDITIONAL SERVICES START --")
services = [
    (1, "Wi-fi", "ADDITIONAL_SERVICE"),
    (2, "Parking", "ADDITIONAL_SERVICE"),
    (3, "Nets", "FISHING_TOOL"),
    (4, "Hooks", "FISHING_TOOL"),
    (5, "Traps", "FISHING_TOOL"),
    (6, "GPS", "NAVIGATIONAL_TOOL"),
    (7, "Compass", "NAVIGATIONAL_TOOL"),
    (8, "Auto Pilot", "NAVIGATIONAL_TOOL"),
    (9, "Breakfast", "ADDITIONAL_SERVICE"),
    (10, "Pet friendly", "ADDITIONAL_SERVICE"),
    (11, "Life jackets", "ADDITIONAL_SERVICE"),
    (12, "Fish finder", "NAVIGATIONAL_TOOL"),
]
for sid, name, typ in services:
    add(f"INSERT INTO additional_service(id, name, type) VALUES ({sid}, '{name}', '{typ}');")

for oid in all_offer_ids:
    base = ((oid - 1) % 8) + 1
    add(
        f"INSERT INTO offer_additional_service(offer_id, additional_service_id) VALUES({oid},{base});"
    )
    add(
        f"INSERT INTO offer_additional_service(offer_id, additional_service_id) VALUES({oid},{((base) % 12) + 1});"
    )
    if oid % 3 == 0:
        add(
            f"INSERT INTO offer_additional_service(offer_id, additional_service_id) VALUES({oid},{((base + 3) % 12) + 1});"
        )
add("-- ADDITIONAL SERVICES END --")

add("--TERMS START--")
term_id = 1
base_date = datetime(2025, 6, 1, 10, 0, 0)
for oid in all_offer_ids:
    for k in range(3 + (SCALE // 2)):  # more available terms per offer at higher scale
        start = base_date + timedelta(days=30 * k + (oid % 7))
        end = start + timedelta(days=20 + (oid % 5))
        add(
            f"INSERT INTO public.term(id, start_date, end_date, offer, version) values({term_id}, '{start.isoformat(timespec='seconds')}',  '{end.isoformat(timespec='seconds')}' , {oid}, 1);"
        )
        term_id += 1
add("--TERMS END--")

customer_ids = [c[0] for c in customers]
add("--RESERVATIONS START--")
reservation_id = 1
service_names = ["Wi-Fi", "Parking", "Nets", "Hooks", "GPS", "Breakfast", "Life jackets"]
res_meta: list[tuple] = []


def add_res(start, end, status, rtype, customer, offer, people, price, discount, has_c, has_f, svc, duration):
    global reservation_id
    cust_sql = "null" if customer is None else str(customer)
    add(
        "INSERT INTO public.reservation(id, start_date, end_date, reservation_status, reservation_type, customer, offer, number_of_people, total_price, discount, has_complaint, has_feedback, additional_services, duration, version) "
        f"values({reservation_id}, '{start}',  '{end}' , {status}, {rtype}, {cust_sql},{offer},{people},{price}, {discount}, {'true' if has_c else 'false'}, {'true' if has_f else 'false'}, '{svc}', {duration}, 1 );"
    )
    rid = reservation_id
    reservation_id += 1
    return rid


past_base = datetime(2025, 3, 1, 10, 0, 0)
for i in range(40 * SCALE):
    cust = customer_ids[i % len(customer_ids)]
    offer = all_offer_ids[i % len(all_offer_ids)]
    start = past_base + timedelta(days=i * 2)
    end = start + timedelta(days=2 + (i % 4))
    status = 0
    if i % 11 == 0:
        status = 1
    if i % 13 == 0:
        status = 2
    has_c = (i % 7 == 0) and status == 0
    has_f = (i % 5 == 0) and status == 0
    price = 150 + (i % 20) * 15
    disc = 0.0 if i % 4 else 10.0 + (i % 3) * 5
    rid = add_res(
        start.isoformat(timespec="seconds"),
        end.isoformat(timespec="seconds"),
        status,
        0,
        cust,
        offer,
        1 + (i % 4),
        price,
        disc,
        has_c,
        has_f,
        service_names[i % len(service_names)],
        (end - start).days,
    )
    res_meta.append((rid, cust, offer, has_c, has_f, status))

future_base = datetime(2026, 7, 1, 10, 0, 0)
for i in range(25 * SCALE):
    cust = customer_ids[(i * 3) % len(customer_ids)]
    offer = all_offer_ids[(i * 2) % len(all_offer_ids)]
    start = future_base + timedelta(days=i * 3)
    end = start + timedelta(days=3)
    rid = add_res(
        start.isoformat(timespec="seconds"),
        end.isoformat(timespec="seconds"),
        0,
        0,
        cust,
        offer,
        2,
        200 + (i * 10),
        0.0,
        False,
        False,
        service_names[i % len(service_names)],
        3,
    )
    res_meta.append((rid, cust, offer, False, False, 0))

quick_base = datetime(2026, 8, 1, 10, 0, 0)
for i in range(20 * SCALE):
    offer = all_offer_ids[(i * 5) % len(all_offer_ids)]
    start = quick_base + timedelta(days=i * 2)
    end = start + timedelta(days=2)
    rid = add_res(
        start.isoformat(timespec="seconds"),
        end.isoformat(timespec="seconds"),
        0,
        1,
        None,
        offer,
        2,
        180 + (i * 8),
        15.0 + (i % 5) * 5,
        False,
        False,
        service_names[i % len(service_names)],
        2,
    )
    res_meta.append((rid, None, offer, False, False, 0))
add("--RESERVATIONS END--")

add("--CANCELLED RESERVATIONS BEGIN--")
cxl = 1
cxl_limit = 8 * SCALE
for rid, cust, offer, has_c, has_f, status in res_meta:
    if status == 1 and cust is not None and cxl <= cxl_limit:
        start = past_base + timedelta(days=cxl)
        end = start + timedelta(days=2)
        add(
            "INSERT INTO public.cancelled_reservation(id, start_date, end_date, reservation_type, reservation_status, number_of_people, total_price, discount, has_complaint, has_feedback, additional_services, duration, cancelled_reservation, customer, offer) "
            f"VALUES ({cxl}, '{start.isoformat(timespec='seconds')}', '{end.isoformat(timespec='seconds')}', 0, 1, 2, 200, 0.0, false, false, 'Wi-Fi', 2, {rid}, {cust}, {offer});"
        )
        cxl += 1
add("--CANCELLED RESERVATIONS END--")

add("--DELETE REQUEST BEGIN--")
add(
    "INSERT INTO public.delete_request(id, explanation, status, users) VALUES (1, 'Moving abroad and no longer need the account', 0, 1);"
)
add(
    f"INSERT INTO public.delete_request(id, explanation, status, users) VALUES (2, 'Duplicate account created by mistake', 0, {customer_ids[3]});"
)
add(
    f"INSERT INTO public.delete_request(id, explanation, status, users) VALUES (3, 'Closing bungalow business', 0, {bungalow_owner_ids[2]});"
)
add("--DELETE REQUEST END--")

add("--USER FEEDBACK START--")
fb_id = 1
feedback_comments = [
    ("Great stay, clean bungalow", "Host was responsive", 5, 5),
    ("Solid boat day, good catch", "Captain knew the spots", 4, 5),
    ("Course was informative", "Patient instructor", 5, 4),
    ("Location excellent, furniture dated", "Check-in was late", 3, 3),
    ("Kids loved the fishing clinic", "Very safe briefing", 5, 5),
]
for rid, cust, offer, has_c, has_f, status in res_meta:
    if has_f and cust is not None:
        cfo, cfo2, ro, row = feedback_comments[fb_id % len(feedback_comments)]
        st = 0 if fb_id % 3 == 0 else (1 if fb_id % 3 == 1 else 2)
        add(
            f"INSERT INTO public.user_feedback(id, content_for_offer, content_for_owner, rate_offer, rate_owner, status, reservation) VALUES ({fb_id}, '{esc(cfo)}', '{esc(cfo2)}', {ro}, {row}, {st} , {rid});"
        )
        fb_id += 1
while fb_id <= 12 * SCALE:
    rid = res_meta[fb_id % len(res_meta)][0]
    cfo, cfo2, ro, row = feedback_comments[fb_id % len(feedback_comments)]
    add(
        f"INSERT INTO public.user_feedback(id, content_for_offer, content_for_owner, rate_offer, rate_owner, status, reservation) VALUES ({fb_id}, '{esc(cfo)}', '{esc(cfo2)}', {ro}, {row}, 1 , {rid});"
    )
    fb_id += 1
add("--USER FEEDBACK END--")

add("--COMPLAINTS BEGIN--")
cmp_id = 1
for rid, cust, offer, has_c, has_f, status in res_meta:
    if has_c and cust is not None:
        ctype = cmp_id % 3
        st = 0 if cmp_id % 2 == 0 else 1
        add(
            f"INSERT INTO public.complaint(id, status, complaint_type, content, reservation) VALUES ({cmp_id}, {st}, {ctype}, 'Issue reported for reservation {rid}: service or cleanliness concern.', {rid});"
        )
        cmp_id += 1
add("--COMPLAINTS END--")

add("--VISIT REPORTS BEGIN--")
vr_id = 1
offer_owner: dict[int, int] = {}
for i, oid in enumerate(bungalow_ids):
    offer_owner[oid] = bungalow_owner_ids[i % len(bungalow_owner_ids)]
for i, oid in enumerate(boat_ids):
    offer_owner[oid] = boat_owner_ids[i % len(boat_owner_ids)]
for i, oid in enumerate(course_ids):
    offer_owner[oid] = instructor_ids[i % len(instructor_ids)]

for rid, cust, offer, has_c, has_f, status in res_meta[: 30 * SCALE]:
    if cust is None:
        continue
    submitter = offer_owner.get(offer, 2)
    no_show = status == 2
    req_penal = no_show or (vr_id % 5 == 0)
    st = 0 if req_penal else 1
    guest_note = "did not show" if no_show else "attended as planned"
    add(
        f"INSERT INTO public.visit_report(id, comment, request_penal, no_show, status, reservation, submitted_by) VALUES ({vr_id}, 'Visit report for reservation {rid}. Guests {guest_note}.', {'true' if req_penal else 'false'}, {'true' if no_show else 'false'}, {st}, {rid}, {submitter});"
    )
    vr_id += 1
    if vr_id > 25 * SCALE:
        break
add("--VISIT REPORTS END--")

add("--SUBSCRIBERS BEGIN--")
sub_id = 1
for i in range(30 * SCALE):
    cust = customer_ids[i % len(customer_ids)]
    offer = all_offer_ids[(i * 4) % len(all_offer_ids)]
    add(
        f"INSERT INTO public.subscriber(id, following, follower, is_relevant) VALUES ({sub_id}, {offer}, {cust}, {'true' if i % 4 else 'false'});"
    )
    sub_id += 1
add("--SUBSCRIBERS END--")

add("--PRICES BEGIN--")
price_id = 1
for oid in all_offer_ids[::2]:
    add(f"INSERT INTO public.price(id, cost, offer) VALUES ({price_id}, {50 + price_id * 3}, {oid});")
    price_id += 1
add("--PRICES END--")

add("-- IMAGE ITEMS --")
# offer_images.images_id is UNIQUE — each ImageItem can belong to only one offer
image_files = [
    "images/bungalow-images/bung_1_0.png",
    "images/bungalow-images/bung_2_0.png",
    "images/bungalow-images/bung_2_1.png",
    "images/bungalow-images/boat_1_0.png",
    "images/bungalow-images/boat_1_1.png",
    "images/bungalow-images/boat_1_2.png",
    "images/bungalow-images/course_1_0.png",
    "images/bungalow-images/course_1_1.png",
    "images/bungalow-images/course_1_2.png",
    "images/bungalow-images/bung_3_0.png",
    "images/bungalow-images/bung_3_1.png",
    "images/bungalow-images/bung_3_2.png",
]
img_id = 1
img_link = 0
for oid in all_offer_ids:
    count = 2 if oid % 2 == 0 else 1
    for n in range(count):
        path = image_files[(oid + n - 1) % len(image_files)]
        # Controllers filter primary gallery image by name == "first"
        img_name = "first" if n == 0 else f"offer{oid}_{n}"
        add(
            f"INSERT INTO public.image_item(id, is_deleted, name, filepath) VALUES ({img_id}, false, '{img_name}', '{path}');"
        )
        add(f"INSERT INTO public.offer_images(offer_id, images_id) VALUES ({oid}, {img_id});")
        img_id += 1
        img_link += 1
add("-- IMAGE ITEMS END --")

add("--USER AUTHORITIES BEGIN--")


def auth(user_id: int, role_id: int) -> None:
    add(f"INSERT INTO public.user_authority(user_id, authority_id) VALUES ({user_id}, {role_id});")
    add(f"INSERT INTO public.user_authority(user_id, authority_id) VALUES ({user_id}, 6);")


for c in customers:
    auth(c[0], 1)
for b in bungalow_owners:
    auth(b[0], 2)
for b in boat_owners:
    auth(b[0], 3)
for i in instructors:
    auth(i[0], 4)
for a in admins:
    auth(a[0], 5)
auth(pending_id, 2)
add("--USER AUTHORITIES END--")

n_users = (
    len(customers)
    + len(bungalow_owners)
    + len(boat_owners)
    + len(instructors)
    + len(admins)
    + 1
)
n_offers = len(all_offer_ids)
n_terms = term_id - 1
n_res = reservation_id - 1
insert_count = sum(1 for l in lines if l.startswith("INSERT"))
add("")
add(
    f"-- Approximate counts: users={n_users}, offers={n_offers}, terms={n_terms}, reservations={n_res}, "
    f"feedback={fb_id - 1}, complaints={cmp_id - 1}, visit_reports={vr_id - 1}, subscribers={sub_id - 1}, "
    f"prices={price_id - 1}, images={img_id - 1}, locations={N_LOC}, engines={len(engines)}, SCALE={SCALE}"
)
add(f"-- Total INSERT statements: {insert_count}")

OUT.write_text("\n".join(lines) + "\n", encoding="utf-8")
print(f"Wrote {OUT}")
print(f"INSERT count: {insert_count}")
print(f"users={n_users} offers={n_offers} terms={n_terms} reservations={n_res}")
print(
    f"feedback={fb_id - 1} complaints={cmp_id - 1} visit_reports={vr_id - 1} subscribers={sub_id - 1}"
)
