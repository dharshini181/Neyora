"""
Core pattern + fabric calculations (Python port of frontend/lib/pattern-engine/generate.ts).
Pure functions — no I/O, easy to unit test.
"""

from dataclasses import dataclass, field
from typing import List, Optional

from app.engine.rules import get_rule

AVG_ADULT_HEIGHT_INCH = 64.0  # ~163cm baseline for fabric-length scaling


@dataclass
class MeasurementInput:
    bust: Optional[float] = None
    waist: Optional[float] = None
    hip: Optional[float] = None
    shoulder: Optional[float] = None
    arm_round: Optional[float] = None
    sleeve_length: Optional[float] = None
    neck: Optional[float] = None
    dress_length: Optional[float] = None
    height: Optional[float] = None
    unit: str = "inch"


@dataclass
class PatternPiece:
    name: str
    width: float
    height: float
    notes: str


@dataclass
class PatternResult:
    unit: str
    seam_allowance: float
    dart_width: float
    dart_length: float
    pieces: List[PatternPiece]
    warnings: List[str] = field(default_factory=list)


@dataclass
class FabricResult:
    main_fabric: float
    lining: float
    lace: float
    elastic: float
    interfacing: float
    wastage_percent: int
    total_with_wastage: float


def _to_inches(value: float, unit: str) -> float:
    return value / 2.54 if unit == "cm" else value


def generate_pattern(dress_name: str, m: MeasurementInput) -> PatternResult:
    rule = get_rule(dress_name)
    unit = m.unit or "inch"
    warnings: List[str] = []

    bust = m.bust or 0
    waist = m.waist or 0
    shoulder = m.shoulder or 0
    arm_round = m.arm_round or 0
    sleeve_length = m.sleeve_length or 0
    neck = m.neck or 0
    dress_length = m.dress_length or 0

    if not bust:
        warnings.append("Bust measurement missing — front/back width defaulted to 0. Add it for an accurate draft.")
    if not dress_length:
        warnings.append("Dress length missing — using 0. Add it to size the body pieces.")

    seam_allowance = rule.seam_allowance
    quarter_bust = bust / 4
    ease = rule.ease_factor / 4

    front_width = quarter_bust + ease + seam_allowance * 2
    back_width = quarter_bust - 0.25 + seam_allowance * 2

    armhole_depth = (shoulder / 2 + 2.25) if shoulder else (bust / 6 + 2.5)
    body_length = dress_length + rule.hem_allowance + seam_allowance

    dart_width = max(bust / 4 - waist / 4, 0.5)
    dart_length = armhole_depth * 0.65

    neck_width = (neck / 5) if neck else 2.5
    neck_depth = (neck / 5 + 0.5) if neck else 3.0

    sleeve_width = (arm_round / 2 + 1.5 + seam_allowance * 2) if arm_round else quarter_bust
    sleeve_full_length = sleeve_length + seam_allowance + rule.hem_allowance / 2

    pieces = [
        PatternPiece(
            "Front Body", round(front_width, 1), round(body_length, 1),
            f"Neck opening {round(neck_width, 1)}×{round(neck_depth, 1)} {unit}, cut on fold",
        ),
        PatternPiece(
            "Back Body", round(back_width, 1), round(body_length, 1),
            f"Dart: {round(dart_width, 1)} {unit} wide × {round(dart_length, 1)} {unit} long, cut on fold",
        ),
        PatternPiece(
            "Sleeve", round(sleeve_width, 1), round(sleeve_full_length, 1),
            f"Cut 2 (mirror pair), ease into armhole depth {round(armhole_depth, 1)} {unit}",
        ),
    ]

    return PatternResult(unit, seam_allowance, round(dart_width, 1), round(dart_length, 1), pieces, warnings)


def calculate_fabric(dress_name: str, m: MeasurementInput, base_fabric_meters: float) -> FabricResult:
    rule = get_rule(dress_name)
    unit = m.unit or "inch"

    height_inch = _to_inches(m.height, unit) if m.height else AVG_ADULT_HEIGHT_INCH
    waist_inch = _to_inches(m.waist, unit) if m.waist else 0

    height_scale = min(max(height_inch / AVG_ADULT_HEIGHT_INCH, 0.75), 1.35)
    main_fabric = base_fabric_meters * rule.fabric_scale * height_scale

    lining = main_fabric * rule.lining_factor if rule.needs_lining else 0
    lace = rule.lace_factor if rule.needs_lace else 0
    elastic = ((waist_inch or (163 / 2.54 / 2.5)) * 0.0254 * rule.elastic_factor) if rule.needs_elastic else 0
    interfacing = rule.interfacing_meters if rule.needs_interfacing else 0

    subtotal = main_fabric + lining
    total_with_wastage = subtotal * (1 + rule.wastage)

    return FabricResult(
        main_fabric=round(main_fabric, 2),
        lining=round(lining, 2),
        lace=round(lace, 2),
        elastic=round(elastic, 2),
        interfacing=round(interfacing, 2),
        wastage_percent=round(rule.wastage * 100),
        total_with_wastage=round(total_with_wastage, 2),
    )
