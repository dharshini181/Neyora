from fastapi import APIRouter

from app.engine.generate import MeasurementInput, calculate_fabric
from app.schemas import FabricRequest, FabricResponse

router = APIRouter(prefix="/fabric", tags=["fabric"])


@router.post("/calculate", response_model=FabricResponse)
def calculate(payload: FabricRequest):
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
    result = calculate_fabric(payload.dress_name, m, payload.base_fabric_meters)

    return FabricResponse(
        main_fabric=result.main_fabric,
        lining=result.lining,
        lace=result.lace,
        elastic=result.elastic,
        interfacing=result.interfacing,
        wastage_percent=result.wastage_percent,
        total_with_wastage=result.total_with_wastage,
    )
