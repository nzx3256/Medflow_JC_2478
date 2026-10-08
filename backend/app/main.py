import os
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from app.routes import hospital_routes, equipment_routes, service_report_routes, \
    technician_routes, work_order_routes, auth

FRONTEND_ORIGIN = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")

app = FastAPI(title="MedFlow Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(hospital_routes.router)
app.include_router(equipment_routes.router)
app.include_router(technician_routes.router)
app.include_router(work_order_routes.router)
app.include_router(service_report_routes.router)
app.include_router(auth.router)

@app.get("/health", tags=["health"])
async def get_health():
    return {"status": "ok"}
