from typing import List, Optional
from pydantic import BaseModel, Field


class MeasurementPayload(BaseModel):
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


class PatternRequest(BaseModel):
    dress_name: str
    measurement: MeasurementPayload


class PatternPieceOut(BaseModel):
    name: str
    width: float
    height: float
    notes: str


class PatternResponse(BaseModel):
    unit: str
    seam_allowance: float
    dart_width: float
    dart_length: float
    pieces: List[PatternPieceOut]
    warnings: List[str]


class FabricRequest(BaseModel):
    dress_name: str
    measurement: MeasurementPayload
    base_fabric_meters: float = Field(default=3.0, gt=0)


class FabricResponse(BaseModel):
    main_fabric: float
    lining: float
    lace: float
    elastic: float
    interfacing: float
    wastage_percent: int
    total_with_wastage: float


class InvoicePdfRequest(BaseModel):
    invoice_number: str
    customer_name: str
    customer_phone: Optional[str] = None
    customer_address: Optional[str] = None
    dress_name: str
    subtotal: float
    tax_percent: float
    tax_amount: float
    total: float
    advance_paid: float = 0
    business_name: str = "Neyora"
    notes: Optional[str] = None
