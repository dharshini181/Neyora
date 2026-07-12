"""
Pattern Rule Engine — rule table (Python port).

Mirrors frontend/lib/pattern-engine/rules.ts exactly, so the FastAPI backend
and the Next.js app compute identical results. If you change one, change
the other — there's no shared source of truth between the two languages,
which is the tradeoff of having an optional Python service alongside the
frontend's built-in engine.
"""

from dataclasses import dataclass
from typing import Dict


@dataclass
class DressRule:
    name: str
    category: str
    ease_factor: float
    needs_lining: bool
    lining_factor: float
    needs_lace: bool
    lace_factor: float
    needs_elastic: bool
    elastic_factor: float
    needs_interfacing: bool
    interfacing_meters: float
    fabric_scale: float
    wastage: float
    seam_allowance: float
    hem_allowance: float


DRESS_RULES: Dict[str, DressRule] = {
    "Anarkali": DressRule("Anarkali", "women", 2.5, True, 0.55, True, 1.2, False, 0, False, 0, 1.0, 0.10, 0.625, 1.5),
    "Kurti": DressRule("Kurti", "women", 2.0, False, 0, True, 0.8, False, 0, False, 0, 1.0, 0.08, 0.625, 1.0),
    "Salwar": DressRule("Salwar", "women", 3.0, False, 0, False, 0, True, 1.05, False, 0, 1.0, 0.08, 0.625, 1.0),
    "Churidar": DressRule("Churidar", "women", 1.5, False, 0, False, 0, True, 1.0, False, 0, 1.0, 0.10, 0.5, 0.75),
    "Blouse": DressRule("Blouse", "women", 1.5, True, 0.9, True, 1.4, False, 0, True, 0.25, 1.0, 0.12, 0.625, 0.75),
    "Lehenga": DressRule("Lehenga", "women", 2.0, True, 0.6, True, 2.5, False, 0, False, 0, 1.0, 0.12, 0.625, 2.0),
    "Gown": DressRule("Gown", "women", 2.5, True, 0.7, True, 1.6, False, 0, False, 0, 1.0, 0.10, 0.625, 1.5),
    "Frock": DressRule("Frock", "kids", 2.5, False, 0, True, 1.0, True, 0.9, False, 0, 1.0, 0.12, 0.5, 1.0),
    "Men's Shirt": DressRule("Men's Shirt", "men", 3.0, False, 0, False, 0, False, 0, True, 0.3, 1.0, 0.08, 0.625, 1.0),
    "Kids Wear": DressRule("Kids Wear", "kids", 2.0, False, 0, True, 0.8, True, 0.9, False, 0, 1.0, 0.14, 0.5, 0.75),
}

DEFAULT_RULE = DressRule("Custom", "women", 2.0, False, 0, False, 0, False, 0, False, 0, 1.0, 0.10, 0.625, 1.0)


def get_rule(dress_name: str) -> DressRule:
    rule = DRESS_RULES.get(dress_name)
    if rule:
        return rule
    custom = DEFAULT_RULE
    custom.name = dress_name
    return custom
