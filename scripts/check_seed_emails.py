import re
from collections import Counter
from pathlib import Path

sql = Path(r"c:\Users\Laslo Uri\Desktop\my_projects\_older_ftn_projects\fishy-finds\src\main\resources\data-postgres.sql").read_text(encoding="utf-8")
emails = re.findall(
    r"INSERT INTO public\.users\(id.*?VALUES \(\d+, '[^']*', '[^']*', '[^']*', '([^']+)',",
    sql,
)
print("emails", len(emails), "unique", len(set(emails)))
print("dup emails", [e for e, n in Counter(emails).items() if n > 1][:20])
