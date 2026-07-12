from fastapi import APIRouter

from app.engine.generate import MeasurementInput, generate_pattern
from app.schemas import PatternRequest, PatternResponse, PatternPieceOut

router = APIRouter(prefix="/patterns", tags=["patterns"])


@router.post("/generate", response_model=PatternResponse)
def generate(payload: PatternRequest):
    m = MeasurementInput(
        bust=payload.measurement.bust,
        waist=payload.measurement.waist,
        hip=payload.measurement.hip,
        shoulder=payload.measurement.shoulder,
        arm_round=payload.measurement.arm_round,
        sleeve_length=payload.measurement.sleeve_length,
        neck=payload.measurement.neck,
        dress_length=payload.measurement.dress_length,
        height=payload.measurement.height,
        unit=payload.measurement.unit,
    )
    result = generate_pattern(payload.dress_name, m)

    return PatternResponse(
        unit=result.unit,
        seam_allowance=result.seam_allowance,
        dart_width=result.dart_width,
        dart_length=result.dart_length,
        pieces=[PatternPieceOut(**vars(p)) for p in result.pieces],
        warnings=result.warnings,
    )
