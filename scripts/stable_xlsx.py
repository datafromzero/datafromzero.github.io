"""Make an .xlsx file byte-stable: openpyxl stamps the save time into docProps/core.xml and every
zip entry, so the same data would give a different file on each run. This rewrites both to a
fixed time, so rebuilding an unchanged workbook leaves git with nothing to commit."""

from __future__ import annotations

import re
import zipfile
from pathlib import Path

FIXED_ISO = "2026-11-17T00:00:00Z"
FIXED_ZIP = (2026, 11, 17, 0, 0, 0)


def stabilize(path: Path) -> None:
    with zipfile.ZipFile(path) as z:
        entries = [(info, z.read(info.filename)) for info in z.infolist()]
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        for info, data in entries:
            if info.filename == "docProps/core.xml":
                text = data.decode("utf-8")
                text = re.sub(
                    r"(<dcterms:(?:created|modified)[^>]*>)[^<]*(</dcterms:)", rf"\g<1>{FIXED_ISO}\g<2>", text
                )
                data = text.encode("utf-8")
            fixed = zipfile.ZipInfo(info.filename, date_time=FIXED_ZIP)
            fixed.compress_type = zipfile.ZIP_DEFLATED
            fixed.external_attr = info.external_attr
            z.writestr(fixed, data)
