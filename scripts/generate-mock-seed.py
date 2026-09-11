#!/usr/bin/env python3
"""Generate a large, requirement-aligned FishyFinds seed (data-postgres.sql)."""
from __future__ import annotations

from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "src" / "main" / "resources" / "data-postgres.sql"
PWD = "$2a$10$S0qDDlMfhXUvj4bfwqtV9O2lEDkBPl1KEWl2MOtUtmSw9AdWO2VlG"  # bcrypt for: password

LOCATIONS = [
    ("Greece", "Leptokaria", "Portokalo", "4", 23.50, 44.50),
    ("Greece", "Thasos", "Limenaria", "12", 24.57, 40.63),
    ("Croatia", "Split", "Riva", "8", 16.44, 43.51),
    ("Croatia", "Zadar", "Obala", "3", 15.23, 44.12),
    ("Montenegro", "Kotor", "Stari Grad", "7", 18.77, 42.42),
    ("Italy", "Rimini", "Lungomare", "21", 12.57, 44.06),
    ("Spain", "Barcelona", "Barceloneta", "15", 2.19, 41.38),
    ("Portugal", "Lisbon", "Belem", "9", -9.20, 38.70),
    ("Norway", "Bergen", "Bryggen", "5", 5.32, 60.39),
    ("Sweden", "Gothenburg", "Harbor", "11", 11.97, 57.71),
    ("Serbia", "Novi Sad", "Kamenicki put", "6a", 19.83, 45.25),
    ("Serbia", "Belgrade", "Danube quay", "44", 20.46, 44.82),
    ("Greece", "Corfu", "Paleokastritsa", "2", 19.80, 39.67),
    ("Greece", "Crete", "Chania", "18", 24.02, 35.51),
    ("Turkey", "Bodrum", "Marina", "33", 27.43, 37.03),
    ("France", "Marseille", "Vieux Port", "1", 5.37, 43.30),
    ("Ireland", "Galway", "Claddagh", "14", -9.05, 53.27),
    ("Scotland", "Oban", "North Pier", "6", -5.47, 56.41),
    ("Finland", "Helsinki", "Katajanokka", "10", 24.97, 60.17),
    ("Poland", "Gdansk", "Motlawa", "22", 18.65, 54.35),
]

CUSTOMER_NAMES = [
    ("Miroslav", "Bozidarovic", "mail@mail.com", "Nikole Pasica 9", "Novi Sad", "Serbia", "06234578"),
    ("Ana", "Petrovic", "ana.petrovic@mail.com", "Bulevar Evrope 12", "Novi Sad", "Serbia", "06111101"),
    ("Marko", "Jovanovic", "marko.j@mail.com", "Narodnog fronta 8", "Novi Sad", "Serbia", "06111102"),
    ("Jelena", "Nikolic", "jelena.n@mail.com", "Futoska 55", "Novi Sad", "Serbia", "06111103"),
    ("Stefan", "Ilic", "stefan.ilic@mail.com", "Kisacka 20", "Novi Sad", "Serbia", "06111104"),
    ("Milica", "Djordjevic", "milica.d@mail.com", "Temerinska 3", "Novi Sad", "Serbia", "06111105"),
    ("Nikola", "Stojanovic", "nikola.s@mail.com", "Cara Dusana 17", "Belgrade", "Serbia", "06111106"),
    ("Ivana", "Pavlovic", "ivana.p@mail.com", "Knez Mihailova 4", "Belgrade", "Serbia", "06111107"),
    ("Luka", "Markovic", "luka.m@mail.com", "Vojvode Stepe 90", "Belgrade", "Serbia", "06111108"),
    ("Sara", "Popovic", "sara.p@mail.com", "Zeleni venac 2", "Belgrade", "Serbia", "06111109"),
    ("Petar", "Simic", "petar.s@mail.com", "Ruzveltova 11", "Belgrade", "Serbia", "06111110"),
    ("Teodora", "Kostic", "teodora.k@mail.com", "Maksima Gorkog 7", "Nis", "Serbia", "06111111"),
    ("Vuk", "Radovic", "vuk.r@mail.com", "Obrenoviceva 15", "Nis", "Serbia", "06111112"),
    ("Tamara", "Milenkovic", "tamara.m@mail.com", "Trg Kralja 1", "Kragujevac", "Serbia", "06111113"),
    ("Dusan", "Aleksic", "dusan.a@mail.com", "Karadjordjeva 28", "Subotica", "Serbia", "06111114"),
    ("Katarina", "Vasic", "katarina.v@mail.com", "Cara Lazara 9", "Zrenjanin", "Serbia", "06111115"),
    ("Filip", "Savic", "filip.s@mail.com", "Hajduk Veljkova 6", "Novi Sad", "Serbia", "06111116"),
    ("Marija", "Zivkovic", "marija.z@mail.com", "Brace Ribnikar 14", "Novi Sad", "Serbia", "06111117"),
    ("Aleksandar", "Tomic", "aleksandar.t@mail.com", "Jevrejska 3", "Novi Sad", "Serbia", "06111118"),
    ("Nina", "Bogdanovic", "nina.b@mail.com", "Sremska 19", "Novi Sad", "Serbia", "06111119"),
    ("Goran", "Lazic", "goran.l@mail.com", "Dunavska 5", "Novi Sad", "Serbia", "06111120"),
    ("Elena", "Mitrovic", "elena.m@mail.com", "Strahinjica Bana 8", "Belgrade", "Serbia", "06111121"),
    ("Bojan", "Ciric", "bojan.c@mail.com", "Studentski trg 2", "Belgrade", "Serbia", "06111122"),
    ("Jovana", "Ristic", "jovana.r@mail.com", "Pozeska 41", "Belgrade", "Serbia", "06111123"),
    ("Milos", "Obradovic", "milos.o@mail.com", "Bulevar Oslobodjenja 100", "Novi Sad", "Serbia", "06111124"),
]

# reasoning, registrationStatus (0=WAITING,1=ACCEPTED,2=DECLINED)
BUNGALOW_OWNERS = [
    ("Zorica", "Randjelovic", "zokaMagic@mail.com", "Zorana Radmilovica 6", "Novi Sad", "Serbia", "06345678",
     "Experienced bungalow host near Leptokaria beaches", 1),
    ("Petar", "Parkerovic", "petarParkerovic@mail.com", "Boska Buhe 2", "Novi Sad", "Serbia", "06145678",
     "Family bungalow network in Greece and Croatia", 1),
    ("Helena", "Maric", "helena.bungalow@mail.com", "Fruskogorska 12", "Novi Sad", "Serbia", "06420001",
     "Coastal bungalows with kitchenettes", 1),
    ("Dragan", "Peric", "dragan.bungalow@mail.com", "Balzakova 4", "Novi Sad", "Serbia", "06420002",
     "Quiet hillside cottages for anglers", 1),
    ("Snezana", "Vukovic", "snezana.bungalow@mail.com", "Radnicka 33", "Belgrade", "Serbia", "06420003",
     "Luxury seaside bungalows", 1),
    ("Igor", "Nedic", "igor.bungalow@mail.com", "Palmira Toljatija 8", "Belgrade", "Serbia", "06420004",
     "Budget bungalows near fishing spots", 1),
    ("Vera", "Stankovic", "vera.pending@mail.com", "Gagarinova 2", "Nis", "Serbia", "06420005",
     "New host applying with three mountain bungalows", 0),
    ("Milan", "Declined", "milan.declined@mail.com", "Cara Dusana 1", "Subotica", "Serbia", "06420006",
     "Incomplete registration documentation", 2),
]

BOAT_OWNERS = [
    ("Zoran", "Sumadin", "zokiSumi@mail.com", "Bulevar Oslobodjenja 4", "Novi Sad", "Serbia", "06545678",
     "Skipper with 12 years Adriatic experience", 1),
    ("Pavle", "Pap", "pavlaPapa@mail.com", "Papa Pavla 4", "Novi Sad", "Serbia", "06745678",
     "Fleet of day-charter fishing boats", 1),
    ("Nemanja", "Kovac", "nemanja.boat@mail.com", "Brace Dronjak 9", "Novi Sad", "Serbia", "06520001",
     "RIB and cabin boats for groups", 1),
    ("Olga", "Simic", "olga.boat@mail.com", "Maksima Gorkog 22", "Belgrade", "Serbia", "06520002",
     "Yacht charters with captain option", 1),
    ("Dejan", "Pavlov", "dejan.boat@mail.com", "Vuka Karadzica 7", "Zadar", "Croatia", "06520003",
     "Local Zadar fishing trips", 1),
    ("Marina", "Horvat", "marina.boat@mail.com", "Riva 15", "Split", "Croatia", "06520004",
     "Split harbor boat rentals", 1),
    ("Tomo", "Pending", "tomo.boat.pending@mail.com", "Obala 3", "Kotor", "Montenegro", "06520005",
     "Awaiting admin approval for boat fleet", 0),
    ("Rade", "Rejected", "rade.boat.rejected@mail.com", "Harbor 1", "Bar", "Montenegro", "06520006",
     "License documents incomplete", 2),
]

INSTRUCTORS = [
    ("Vesna", "Vukelic", "vesnaVuki@mail.com", "Kamenicki put 6a", "Novi Sad", "Serbia", "06645699",
     "PADI instructor, freshwater and saltwater fly fishing.",
     "Certified fishing instructor for group courses", 1),
    ("Zeljana", "Cudesnic", "woderwoman@mail.com", "Zmaj Jovina 15", "Novi Sad", "Serbia", "06345111",
     "Former national team angler teaching beginners.",
     "Wants to share lake and river fishing skills", 1),
    ("Boris", "Fisher", "boris.instructor@mail.com", "Dunavski kej 3", "Novi Sad", "Serbia", "06620001",
     "Specializes in spinning and trolling on the Danube.",
     "Instructor with 8 years teaching experience", 1),
    ("Clara", "Reef", "clara.instructor@mail.com", "Marina road 8", "Split", "Croatia", "06620002",
     "Sea bass and bream shore casting coach.",
     "Adriatic shore and boat courses", 1),
    ("Ivan", "Hook", "ivan.instructor@mail.com", "Pier 2", "Thasos", "Greece", "06620003",
     "Night fishing and squid jigging specialist.",
     "Evening courses for tourists", 1),
    ("Lara", "Pending", "lara.instructor.pending@mail.com", "Beach road 1", "Corfu", "Greece", "06620004",
     "New instructor application.",
     "Waiting for admin to accept instructor account", 0),
]

ADMINS = [
    ("Adam", "Adminovic", "admin@admin.com", "Admina Adminovica 15", "Admingrad", "Adminia", "06445348", 5.0),
    ("Sofija", "Sysadmin", "admin2@admin.com", "System street 1", "Novi Sad", "Serbia", "06445349", 5.0),
]

BUNGALOW_OFFERS = [
    ("Nikos", "Bungalow at seaside. 5 minutes walking distance to beach.", 10.5, 4.2, 5, 2, 2),
    ("Shrek house", "Bungalow in the middle of a quiet pine grove near a lagoon.", 12.5, 4.8, 2, 4, 2),
    ("Fiona", "Castle-like bungalow. Peaceful, 15km from busy towns.", 50.0, 4.9, 10, 10, 4),
    ("Aegean Nest", "Two-room bungalow with outdoor grill and gear storage.", 28.0, 4.3, 4, 3, 2),
    ("Olive Grove Cabin", "Stone bungalow among olive trees, bike rental nearby.", 22.0, 4.1, 3, 2, 1),
    ("Harbor View", "Modern bungalow overlooking the marina.", 35.0, 4.6, 6, 4, 3),
    ("Fisherman Rest", "Simple bungalow next to bait shop and slipway.", 15.0, 3.9, 2, 2, 1),
    ("Coral Cottage", "Family bungalow with kids playground and Wi-Fi.", 30.0, 4.4, 5, 3, 2),
    ("Sunset Lodge", "West-facing terrace perfect for evening casting.", 27.0, 4.5, 4, 3, 2),
    ("Lagoon Loft", "Elevated bungalow above shallow flats for wading.", 33.0, 4.7, 3, 2, 2),
    ("Pine Breeze", "Cool pine-scented bungalow with two bedrooms.", 24.0, 4.0, 4, 4, 2),
    ("Captain Quarters", "Bungalow for skippers between charters.", 18.0, 3.8, 2, 1, 1),
    ("Blue Door House", "Renovated village bungalow near supermarket.", 20.0, 4.2, 4, 3, 2),
    ("Reefside", "Steps from rocky shore, lockable tackle room.", 29.0, 4.5, 3, 2, 1),
    ("Moonlight Cabin", "Quiet bungalow popular with night anglers.", 26.0, 4.3, 2, 2, 1),
    ("Family Bay", "Large bungalow for multi-day family trips.", 45.0, 4.6, 8, 6, 3),
    ("Angler Hut", "Minimal hut with fridge and outdoor sink.", 12.0, 3.7, 2, 1, 1),
    ("Pearl Patio", "Patio bungalow with BBQ and outdoor shower.", 31.0, 4.4, 4, 3, 2),
    ("Cliff Nest", "Clifftop view bungalow, stairs to shore.", 38.0, 4.8, 3, 2, 2),
    ("Garden Bungalow", "Garden courtyard, pets allowed on request.", 23.0, 4.1, 3, 2, 1),
]

BOAT_OFFERS = [
    ("Titanik", "Large day boat for coastal fishing trips.", 40.0, 4.5, 6, 12.5, "cabin cruiser"),
    ("Marlin Express", "Fast RIB for trolling and island hopping.", 55.0, 4.7, 4, 7.2, "RIB"),
    ("Bluefin", "Stable center-console with live bait well.", 48.0, 4.4, 5, 8.0, "center console"),
    ("Sardina", "Small affordable skiff for two anglers.", 25.0, 4.0, 2, 4.5, "skiff"),
    ("Poseidon", "Cabin boat with overnight berths.", 70.0, 4.8, 6, 11.0, "cabin"),
    ("Seagull", "Open boat ideal for beginners.", 30.0, 4.1, 3, 5.5, "open boat"),
    ("Northern Star", "All-weather fishing boat with GPS plotter.", 60.0, 4.6, 5, 9.5, "hardtop"),
    ("Adriatic Fox", "Light boat for coastal reef fishing.", 35.0, 4.2, 3, 6.0, "open boat"),
    ("Kotor Queen", "Family sightseeing and light fishing.", 45.0, 4.3, 8, 10.0, "cabin cruiser"),
    ("Split Runner", "Harbor pickup, half-day charters.", 42.0, 4.4, 4, 7.0, "RIB"),
    ("Thasos Drift", "Drift fishing around Thasos islands.", 38.0, 4.5, 4, 6.5, "center console"),
    ("Danube Duck", "River boat for Danube catfish sessions.", 28.0, 4.0, 3, 5.0, "river boat"),
    ("Hook Line", "Tournament-ready bass boat.", 50.0, 4.6, 2, 6.2, "bass boat"),
    ("Salt and Scale", "Boat with rod holders and cooler seats.", 36.0, 4.2, 4, 6.8, "center console"),
    ("Night Owl", "Deck lights for squid and night sessions.", 44.0, 4.5, 4, 7.5, "open boat"),
]

COURSE_OFFERS = [
    ("Racing with the hippos", "Intro course on safe river fishing techniques.", 25.0, 4.2, 6),
    ("Beginner Spinning", "Half-day spinning basics for adults.", 30.0, 4.5, 8),
    ("Fly Fishing 101", "Casting clinic on a calm lake shore.", 40.0, 4.7, 4),
    ("Night Squid Jigging", "Evening course for cephalopod fishing.", 35.0, 4.4, 6),
    ("Kids First Catch", "Family-friendly course for children 8+.", 20.0, 4.8, 10),
    ("Sea Bass Shore", "Shore casting for Mediterranean sea bass.", 45.0, 4.6, 5),
    ("Trolling Tactics", "Boat-based trolling patterns and lure choice.", 55.0, 4.3, 4),
    ("Knots and Rigging", "Essential knots, leaders, and terminal tackle.", 18.0, 4.1, 12),
    ("Catch and Release", "Fish handling ethics and conservation.", 22.0, 4.9, 8),
    ("Winter River Session", "Cold-weather river techniques and safety.", 32.0, 4.0, 5),
]

SERVICES = [
    (1, "Wi-fi", "ADDITIONAL_SERVICE"),
    (2, "Parking", "ADDITIONAL_SERVICE"),
    (3, "Nets", "FISHING_TOOL"),
    (4, "Hooks", "FISHING_TOOL"),
    (5, "Traps", "FISHING_TOOL"),
    (6, "GPS", "NAVIGATIONAL_TOOL"),
    (7, "Compass", "NAVIGATIONAL_TOOL"),
    (8, "Auto Pilot", "NAVIGATIONAL_TOOL"),
    (9, "Breakfast", "ADDITIONAL_SERVICE"),
    (10, "Air conditioning", "ADDITIONAL_SERVICE"),
    (11, "Rod rental", "FISHING_TOOL"),
    (12, "Fish finder", "NAVIGATIONAL_TOOL"),
]

IMAGE_POOL = [
    "../images/bungalow-images/bung_1_0.jpg",
    "../images/bungalow-images/bung_2_0.jpg",
    "../images/bungalow-images/bung_2_1.jpg",
    "../images/bungalow-images/bung_3_0.jpg",
    "../images/bungalow-images/bung_3_1.jpg",
    "../images/bungalow-images/bung_3_2.jpg",
    "../images/bungalow-images/boat_1_0.jpg",
    "../images/bungalow-images/boat_1_1.jpg",
    "../images/bungalow-images/boat_1_2.jpg",
    "../images/bungalow-images/course_1_0.jpg",
    "../images/bungalow-images/course_1_1.jpg",
    "../images/bungalow-images/course_1_2.jpg",
]

POLICIES = [
    "Free cancellation up to 7 days before start; 50% after that.",
    "Full refund if cancelled 3+ days before arrival.",
    "No refund within 48 hours of start.",
    "Owner keeps 30% on late cancellation.",
    "Weather cancellations fully refunded.",
]

RULES = [
    "Quiet hours 22:00-07:00. No loud music.",
    "No smoking indoors. Pets only with prior approval.",
    "Life jackets mandatory on board.",
    "Children under 12 must be supervised at all times.",
    "Leave kitchenette clean; report damage immediately.",
]


def sql_str(s: str) -> str:
    return "'" + s.replace("'", "''") + "'"


def user_insert(uid: int, first: str, last: str, email: str, addr: str, city: str, country: str,
                phone: str, user_type: int, activated: bool, logins: int = 0) -> str:
    return (
        "INSERT INTO public.users(id, address, city, country, email, first_name, is_activated, is_deleted, "
        "last_name, last_password_reset_date, number_of_log_ins, password, phone_number, user_type, verification_code) "
        f"VALUES ({uid}, {sql_str(addr)}, {sql_str(city)}, {sql_str(country)}, {sql_str(email)}, {sql_str(first)}, "
        f"{str(activated).lower()}, false, {sql_str(last)}, '01-01-0001', {logins}, '{PWD}', {sql_str(phone)}, {user_type}, '');"
    )


def main() -> None:
    lines: list[str] = []
    counts: dict[str, int] = {}

    def add(section: str, sql: str) -> None:
        lines.append(sql)
        counts[section] = counts.get(section, 0) + 1

    lines += [
        "-- FishyFinds rich mock seed (generated by scripts/generate-mock-seed.py)",
        "-- Demo password for ALL seeded users: password",
        "-- Schema is create-drop on boot; this file reloads every start.",
        "",
        "--AUTHORITIES BEGIN--",
    ]
    for i, role in enumerate(
        ["ROLE_CUSTOMER", "ROLE_BUNGALOW", "ROLE_BOAT", "ROLE_INSTRUCTOR", "ROLE_ADMIN", "ROLE_COMMON"], 1
    ):
        add("authority", f"INSERT INTO authority VALUES ({i}, '{role}');")
    lines.append("--AUTHORITIES END--")

    lines.append("--LOCATIONS BEGIN--")
    for i, (country, city, street, num, lon, lat) in enumerate(LOCATIONS, 1):
        add(
            "location",
            f"INSERT INTO location VALUES ({i}, {sql_str(city)}, {sql_str(country)}, {lat}, {lon}, {sql_str(street)}, {sql_str(num)});",
        )
    lines.append("--LOCATIONS END--")

    lines.append("--LOYALTY PROGRAM BEGIN--")
    # Match original positional order used by Hibernate DDL:
    # id, category_discount, category_name, earning_rate, required_points
    for row in [
        (1, 0, "Unborn Shark", 0, 0),
        (2, 5, "Baby Shark", 1, 50),
        (3, 10, "Parent Shark", 2, 100),
        (4, 15, "Grandparent Shark", 3, 500),
    ]:
        add(
            "loyalty_program",
            f"INSERT INTO loyalty_program VALUES ({row[0]}, {row[1]}, {sql_str(row[2])}, {row[3]}, {row[4]});",
        )
    lines.append("--LOYALTY PROGRAM END--")

    uid = 1
    customer_ids: list[int] = []
    accepted_bungalow_ids: list[int] = []
    accepted_boat_ids: list[int] = []
    accepted_instructor_ids: list[int] = []
    all_user_auth: list[tuple[int, int]] = []  # (user_id, role_authority)

    lines.append("--USERS BEGIN--")
    for first, last, email, addr, city, country, phone in CUSTOMER_NAMES:
        loyalty = 1 + ((uid - 1) % 4)
        points = [0, 40, 90, 220][loyalty - 1]
        penals = 2 if email == "mail@mail.com" else (uid % 3)
        add("users", user_insert(uid, first, last, email, addr, city, country, phone, 0, True, 1 + uid % 5))
        add("customer", f"INSERT INTO customer VALUES ({penals}, {points}, {uid}, {loyalty});")
        customer_ids.append(uid)
        all_user_auth.append((uid, 1))
        uid += 1

    for first, last, email, addr, city, country, phone, reason, status in BUNGALOW_OWNERS:
        loyalty = 1 + (uid % 4)
        add("users", user_insert(uid, first, last, email, addr, city, country, phone, 1, status != 2))
        add("bungalow_owner", f"INSERT INTO bungalow_owner VALUES ({sql_str(reason)}, {status}, {uid}, {loyalty});")
        if status == 1:
            accepted_bungalow_ids.append(uid)
        all_user_auth.append((uid, 2))
        uid += 1

    for first, last, email, addr, city, country, phone, reason, status in BOAT_OWNERS:
        loyalty = 1 + (uid % 4)
        add("users", user_insert(uid, first, last, email, addr, city, country, phone, 2, status != 2))
        add("boat_owner", f"INSERT INTO boat_owner VALUES ({sql_str(reason)}, {status}, {uid}, {loyalty});")
        if status == 1:
            accepted_boat_ids.append(uid)
        all_user_auth.append((uid, 3))
        uid += 1

    for first, last, email, addr, city, country, phone, bio, reason, status in INSTRUCTORS:
        loyalty = 1 + (uid % 4)
        add("users", user_insert(uid, first, last, email, addr, city, country, phone, 3, status != 2))
        add("instructor", f"INSERT INTO instructor VALUES ({sql_str(bio)}, {sql_str(reason)}, {status}, {uid}, {loyalty});")
        if status == 1:
            accepted_instructor_ids.append(uid)
        all_user_auth.append((uid, 4))
        uid += 1

    for first, last, email, addr, city, country, phone, pct in ADMINS:
        add("users", user_insert(uid, first, last, email, addr, city, country, phone, 4, True))
        add("admin", f"INSERT INTO admin VALUES ({pct}, {uid});")
        all_user_auth.append((uid, 5))
        uid += 1
    lines.append("--USERS END--")

    lines.append("--ENGINES BEGIN--")
    for i in range(1, 16):
        add(
            "engine",
            f"INSERT INTO public.engine(id, max_speed, number_of_engines, power) VALUES ({i}, {20 + i * 3}, {1 + i % 3}, {80 + i * 15});",
        )
    lines.append("--ENGINES END--")

    lines.append("--OFFERS BEGIN--")
    oid = 1
    bungalow_offer_ids: list[int] = []
    boat_offer_ids: list[int] = []
    course_offer_ids: list[int] = []
    offer_owner: dict[int, int] = {}

    for idx, (name, desc, price, rating, cap, beds, rooms) in enumerate(BUNGALOW_OFFERS):
        owner = accepted_bungalow_ids[idx % len(accepted_bungalow_ids)]
        loc = 1 + (idx % len(LOCATIONS))
        add(
            "offer",
            "INSERT INTO public.offer(id, cancellation_policy, description, max_customer_capacity, offer_name, "
            "offer_type, rating, rules_of_conduct, unit_price, users, location) "
            f"VALUES ({oid}, {sql_str(POLICIES[idx % 5])}, {sql_str(desc)}, {cap}, {sql_str(name)}, 0, {rating}, "
            f"{sql_str(RULES[idx % 5])}, {price}, {owner}, {loc});",
        )
        add("bungalow", f"INSERT INTO public.bungalow(number_of_beds, number_of_rooms, id) VALUES ({beds}, {rooms}, {oid});")
        bungalow_offer_ids.append(oid)
        offer_owner[oid] = owner
        oid += 1

    for idx, (name, desc, price, rating, cap, length, btype) in enumerate(BOAT_OFFERS):
        owner = accepted_boat_ids[idx % len(accepted_boat_ids)]
        loc = 1 + ((idx + 3) % len(LOCATIONS))
        engine = 1 + (idx % 15)
        add(
            "offer",
            "INSERT INTO public.offer(id, cancellation_policy, description, max_customer_capacity, offer_name, "
            "offer_type, rating, rules_of_conduct, unit_price, users, location) "
            f"VALUES ({oid}, {sql_str(POLICIES[idx % 5])}, {sql_str(desc)}, {cap}, {sql_str(name)}, 1, {rating}, "
            f"{sql_str(RULES[(idx + 2) % 5])}, {price}, {owner}, {loc});",
        )
        add(
            "boat",
            f"INSERT INTO public.boat(boat_length, boat_type, id, engine) VALUES ({length}, {sql_str(btype)}, {oid}, {engine});",
        )
        boat_offer_ids.append(oid)
        offer_owner[oid] = owner
        oid += 1

    for idx, (name, desc, price, rating, cap) in enumerate(COURSE_OFFERS):
        owner = accepted_instructor_ids[idx % len(accepted_instructor_ids)]
        loc = 1 + ((idx + 7) % len(LOCATIONS))
        add(
            "offer",
            "INSERT INTO public.offer(id, cancellation_policy, description, max_customer_capacity, offer_name, "
            "offer_type, rating, rules_of_conduct, unit_price, users, location) "
            f"VALUES ({oid}, {sql_str(POLICIES[idx % 5])}, {sql_str(desc)}, {cap}, {sql_str(name)}, 2, {rating}, "
            f"{sql_str(RULES[(idx + 1) % 5])}, {price}, {owner}, {loc});",
        )
        add("course", f"INSERT INTO public.course(id) VALUES ({oid});")
        course_offer_ids.append(oid)
        offer_owner[oid] = owner
        oid += 1
    all_offer_ids = bungalow_offer_ids + boat_offer_ids + course_offer_ids
    lines.append("--OFFERS END--")

    lines.append("-- ADDITIONAL SERVICES START --")
    for sid, name, typ in SERVICES:
        add("additional_service", f"INSERT INTO additional_service(id, name, type) VALUES ({sid}, {sql_str(name)}, '{typ}');")
    for offer_id in all_offer_ids:
        for j in range(2 + offer_id % 2):
            sid = 1 + ((offer_id + j) % len(SERVICES))
            add(
                "offer_additional_service",
                f"INSERT INTO offer_additional_service(offer_id, additional_service_id) VALUES ({offer_id}, {sid});",
            )
    lines.append("-- ADDITIONAL SERVICES END --")

    lines.append("--TERMS START--")
    tid = 1
    windows = [
        ("2025-04-01T10:00:00", "2025-06-30T18:00:00"),
        ("2025-07-01T10:00:00", "2025-09-30T18:00:00"),
        ("2025-10-01T10:00:00", "2025-12-20T18:00:00"),
        ("2026-01-05T10:00:00", "2026-03-31T18:00:00"),
        ("2026-04-01T10:00:00", "2026-06-30T18:00:00"),
        ("2026-07-01T10:00:00", "2026-09-30T18:00:00"),
    ]
    for offer_id in all_offer_ids:
        pair = windows[(offer_id % 3) * 2 : (offer_id % 3) * 2 + 2]
        for start, end in pair:
            add(
                "term",
                f"INSERT INTO public.term(id, start_date, end_date, offer, version) VALUES ({tid}, '{start}', '{end}', {offer_id}, 0);",
            )
            tid += 1
    for offer_id in all_offer_ids[::3]:
        add(
            "term",
            f"INSERT INTO public.term(id, start_date, end_date, offer, version) VALUES ({tid}, '2026-08-01T08:00:00', '2026-08-31T20:00:00', {offer_id}, 0);",
        )
        tid += 1
    lines.append("--TERMS END--")

    lines.append("--RESERVATIONS START--")
    rid = 1
    feedback_ready: list[int] = []
    complaint_ready: list[int] = []
    visit_ready: list[tuple[int, int]] = []

    def res_row(start, end, status, rtype, customer, offer, people, price, discount, has_c, has_f, services, duration):
        nonlocal rid
        cust = "null" if customer is None else str(customer)
        add(
            "reservation",
            "INSERT INTO public.reservation(id, start_date, end_date, reservation_status, reservation_type, "
            "customer, offer, number_of_people, total_price, discount, has_complaint, has_feedback, "
            "additional_services, duration, version) "
            f"VALUES ({rid}, '{start}', '{end}', {status}, {rtype}, {cust}, {offer}, {people}, {price}, "
            f"{discount}, {str(has_c).lower()}, {str(has_f).lower()}, {sql_str(services)}, {duration}, 0);",
        )

    for i in range(40):
        offer = all_offer_ids[i % len(all_offer_ids)]
        customer = customer_ids[i % len(customer_ids)]
        day = 1 + (i % 25)
        month = 3 + (i % 5)
        start = f"2025-{month:02d}-{day:02d}T10:00:00"
        end = f"2025-{month:02d}-{min(day + 2, 28):02d}T18:00:00"
        has_f = i % 3 == 0
        has_c = i % 7 == 0
        status = 2 if i % 11 == 0 else 0
        res_row(start, end, status, 0, customer, offer, 1 + i % 4, 80 + i * 7, 0.0 if i % 5 else 10.0, has_c, has_f, "Wi-fi", 2 + i % 4)
        if has_f:
            feedback_ready.append(rid)
        if has_c:
            complaint_ready.append(rid)
        visit_ready.append((rid, offer_owner[offer]))
        rid += 1

    for i in range(25):
        offer = all_offer_ids[(i * 3) % len(all_offer_ids)]
        customer = customer_ids[(i * 2) % len(customer_ids)]
        day = 10 + (i % 15)
        res_row(f"2026-09-{day:02d}T09:00:00", f"2026-09-{min(day + 3, 28):02d}T17:00:00", 0, 0, customer, offer, 2, 120 + i * 5, 0.0, False, False, "Parking", 3)
        rid += 1

    for i in range(20):
        offer = all_offer_ids[(i * 5) % len(all_offer_ids)]
        day = 12 + (i % 10)
        claimed = i % 2 == 0
        customer = customer_ids[i % len(customer_ids)] if claimed else None
        res_row(f"2026-10-{day:02d}T08:00:00", f"2026-10-{min(day + 1, 28):02d}T20:00:00", 0, 1, customer, offer, 2, 90 + i * 4, 15.0 + i, False, False, "GPS", 1)
        rid += 1

    for i in range(10):
        offer = all_offer_ids[(i * 7) % len(all_offer_ids)]
        customer = customer_ids[(i + 3) % len(customer_ids)]
        res_row(f"2026-05-{10 + i:02d}T10:00:00", f"2026-05-{12 + i:02d}T10:00:00", 1, 0, customer, offer, 2, 100.0, 0.0, False, False, "Hooks", 2)
        rid += 1
    lines.append("--RESERVATIONS END--")

    lines.append("--PENALS BEGIN--")
    for i, cid in enumerate(customer_ids[:12], 1):
        add("penal", f"INSERT INTO public.penal(id, customer, number) VALUES ({i}, {cid}, {i % 3});")
    lines.append("--PENALS END--")

    lines.append("--DELETE REQUEST BEGIN--")
    delete_rows = [
        (1, "Moving abroad, please delete my account.", 0, customer_ids[5]),
        (2, "No longer offering bungalows this season.", 0, accepted_bungalow_ids[5]),
        (3, "Duplicate account created by mistake.", 2, customer_ids[8]),
        (4, "Retiring from boat rental business.", 0, accepted_boat_ids[4]),
        (5, "Please remove inactive instructor profile.", 1, accepted_instructor_ids[-1]),
    ]
    for did, expl, status, user in delete_rows:
        add(
            "delete_request",
            f"INSERT INTO public.delete_request(id, explanation, status, users) VALUES ({did}, {sql_str(expl)}, {status}, {user});",
        )
    lines.append("--DELETE REQUEST END--")

    lines.append("--USER FEEDBACK START--")
    comments_offer = [
        "Clean place and great location for fishing.",
        "Boat handled waves well; gear was included.",
        "Instructor was patient and clear.",
        "Average stay, Wi-Fi was weak.",
        "Would book again next summer.",
        "Excellent sunset view from the terrace.",
    ]
    comments_owner = [
        "Owner responded quickly.",
        "Friendly check-in.",
        "Could improve communication.",
        "Very professional.",
        "Helpful with local tips.",
        "Fair and transparent.",
    ]
    for i, reservation_id in enumerate(feedback_ready, 1):
        add(
            "user_feedback",
            "INSERT INTO public.user_feedback(id, content_for_offer, content_for_owner, rate_offer, rate_owner, status, reservation) "
            f"VALUES ({i}, {sql_str(comments_offer[i % 6])}, {sql_str(comments_owner[i % 6])}, "
            f"{3 + i % 3}, {3 + (i + 1) % 3}, {i % 3}, {reservation_id});",
        )
    lines.append("--USER FEEDBACK END--")

    lines.append("--COMPLAINTS BEGIN--")
    for i, reservation_id in enumerate(complaint_ready, 1):
        add(
            "complaint",
            "INSERT INTO public.complaint(id, status, complaint_type, content, reservation) "
            f"VALUES ({i}, {i % 3}, {i % 3}, {sql_str('Issue with reservation #' + str(reservation_id) + ': facility not as described / late check-in.')}, {reservation_id});",
        )
    lines.append("--COMPLAINTS END--")

    lines.append("--VISIT REPORTS BEGIN--")
    for i, (reservation_id, owner_id) in enumerate(visit_ready[:30], 1):
        no_show = i % 5 == 0
        request_penal = no_show or i % 4 == 0
        add(
            "visit_report",
            "INSERT INTO public.visit_report(id, reservation, comment, request_penal, no_show, status, submitted_by) "
            f"VALUES ({i}, {reservation_id}, {sql_str('Visit notes for reservation ' + str(reservation_id) + '.')}, "
            f"{str(request_penal).lower()}, {str(no_show).lower()}, {0 if i % 2 == 0 else 1}, {owner_id});",
        )
    lines.append("--VISIT REPORTS END--")

    lines.append("--SUBSCRIBERS BEGIN--")
    for i in range(1, 36):
        follower = customer_ids[(i - 1) % len(customer_ids)]
        following = all_offer_ids[((i - 1) * 2) % len(all_offer_ids)]
        add(
            "subscriber",
            f"INSERT INTO public.subscriber(id, following, follower, is_relevant) VALUES ({i}, {following}, {follower}, {str(i % 4 != 0).lower()});",
        )
    lines.append("--SUBSCRIBERS END--")

    lines.append("-- IMAGE ITEMS --")
    img_id = 1
    for offer_id in all_offer_ids:
        for k in range(1 + offer_id % 3):
            path = IMAGE_POOL[(offer_id + k) % len(IMAGE_POOL)]
            add(
                "image_item",
                f"INSERT INTO public.image_item(id, is_deleted, name, filepath) VALUES ({img_id}, false, {sql_str('img_' + str(img_id))}, {sql_str(path)});",
            )
            add("offer_images", f"INSERT INTO public.offer_images(offer_id, images_id) VALUES ({offer_id}, {img_id});")
            img_id += 1
    lines.append("-- IMAGE ITEMS END --")

    lines.append("--USER AUTHORITIES BEGIN--")
    for user_id, role_auth in all_user_auth:
        add("user_authority", f"INSERT INTO public.user_authority(user_id, authority_id) VALUES ({user_id}, {role_auth});")
        add("user_authority", f"INSERT INTO public.user_authority(user_id, authority_id) VALUES ({user_id}, 6);")
    lines.append("--USER AUTHORITIES END--")

    total = sum(counts.values())
    lines += [
        "",
        f"-- SEED SUMMARY: {total} insert statements",
        *[f"--   {k}: {counts[k]}" for k in sorted(counts)],
        "",
        "-- Demo logins (password):",
        "--   mail@mail.com (customer)",
        "--   zokaMagic@mail.com (bungalow owner)",
        "--   zokiSumi@mail.com (boat owner)",
        "--   vesnaVuki@mail.com (instructor)",
        "--   admin@admin.com (admin)",
        "",
    ]
    OUT.write_text("\n".join(lines), encoding="utf-8")
    print(f"Wrote {OUT}")
    print(f"Total inserts: {total}")
    for k in sorted(counts):
        print(f"  {k}: {counts[k]}")


if __name__ == "__main__":
    main()
