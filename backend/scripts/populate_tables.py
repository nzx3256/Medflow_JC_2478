import asyncio
import random
import faker
from sqlalchemy import select

from app.database import AsyncSessionLocal
from app.models.enums import EquipmentStatus, WorkOrderPriority, WorkOrderStatus
from app.models.orm_tables import Hospital, Equipment, Technician, WorkOrder, \
    ServiceReport

RAND_SEED = 2

EQUIPMENT_COUNT = 100
TECHNICIAN_COUNT = 100
ORDER_COUNT = 150
REPORT_COUNT = 200

equipment_model_snum = {
    "Electrocardiograph": "SN-ECG",
    "Electromyograph": "SN-EMG",
    "Magnetic Resonance Imaging Scanner": "SN-MRI",
    "Positron Emission Tomography Scanner": "SN-PET",
    "Pulse Oximeter": "SN-POX",
    "Digital Thermometer": "SN-TH",
    "Capnograph": "SN-CAP",
    "Ophthalmoscope": "SN-OPH",
    "Endoscope": "SN-ENDO",
    "Artificial Pacemaker": "ABC",
    "Mechanical Ventilator": "SN-VENT",
    "Infusion Pump": "SN-PBR",
    "Heart-Lung Machine": "SN-HLM",
    "Phototherapy Device": "SN-PTD",
    "Multi-Parameter Patient Monitor": "SN-MPM",
    "Holter Monitor": "SN-HOL",
    "Cochlear Implant": "SN-CI",
    "Electric Wheelchair": "SN-EWC",
    "Electronic Hospital Bed": "SN-EHB",
    "Automated Blood Analyzer": "SN-ABA",
    "Electronic Centrifuge": "SN-EC",
    "Digital Microplate Reader": "SN-DMR",
    "Coagulation Analyzer": "SN-COAG",
    "Digital Incubator": "SN-INC",
    "Urinalysis Analyzer" : "SN-URA"
}

equipment_model = list(equipment_model_snum.keys())
#equipment_snum = list(equipment_model_snum.values())

medical_words = [
    "Abdomen", "Abscess", "Acute", "Allergy", "Ambulance", "Amputation", 
    "Anesthesia", "Antibiotic", "Antiseptic", "Appendix", "Arteriole", "Artery", 
    "Asthma", "Bacteria", "Biopsy", "Bladder", "Bleeding", "Blood", "Bone", "Brain",
    "Bronchial", "Capillary", "Cardiac", "Cardiology", "Cartilage", "Cast", 
    "Catheter", "Cell", "Cervix", "Chemotherapy", "Chronic", "Clinic", "Clot", 
    "Code", "Colon", "Coma", "Contagious", "Cornea", "Cranium", "Critical", "Cyst", 
    "Defibrillator", "Dementia", "Dermatology", "Diabetes", "Diagnosis", "Dialysis",
    "Disease", "Dosage", "Dose", "Drainage", "Dressing", "Eczema", "Embolism", 
    "Embryo", "Emergency", "Endocrine", "Enzyme", "Epidermis", "Epilepsy", 
    "Epidemic", "Evaluation", "Exam", "Eye", "Fainting", "Female", "Fever", 
    "Fibula", "Flu", "Fracture", "Gallbladder", "Gastric", "Gene", "Generic", 
    "Genetic", "Geriatric", "Gland", "Glucose", "Gown", "Graft", "Gynecology", 
    "Heart", "Hematology", "Hemoglobin", "Hepatitis", "Hormone", "Hospice", 
    "Hospital", "Hygiene", "Hypertension", "Ibuprofen", "Illness", "Immune", 
    "Immunization", "Incision", "Incubator", "Infection", "Inflammation", 
    "Influenza", "Injection"
]

async def populate_tables():
    async with AsyncSessionLocal() as session:
        random.seed(RAND_SEED)
        faker.Faker.seed(RAND_SEED)
        hospitals: list[Hospital] = [
            Hospital(name="Silver Hill Hospital Center",location_region="Connecticut",capacity=30,supervisor_id=1),
            Hospital(name="Kindred Clinic",location_region="Texas",capacity=20,supervisor_id=2),
            Hospital(name="Bayview Hospital",location_region="Maryland",capacity=100,supervisor_id=2),
            Hospital(name="Silver Birch Medical Center",location_region="Canada",capacity=35,supervisor_id=3),
            Hospital(name="Springhill Medical Center",location_region="Louisiana",capacity=40,supervisor_id=4)
        ]
        session.add_all(hospitals)
        results =  await session.execute(select(Hospital))
        hospitals = list(results.scalars().all())
        for i in range(EQUIPMENT_COUNT):
            model = equipment_model[i % len(equipment_model)]
            serial_number = f"{equipment_model_snum[model]}" \
                f"{int(i/len(equipment_model_snum))}"
            charge_level = random.random()*100
            status = EquipmentStatus.OFFLINE if charge_level < 5 else \
                random.choice([e.value for e in EquipmentStatus])
            hospital_id = hospitals[random.randrange(0,len(hospitals))].id
            session.add(
                Equipment(
                    model=model,
                    serial_number=serial_number,
                    status=status,
                    charge_level=charge_level,
                    hospital_id=hospital_id
                )
            )
        results = await session.execute(select(Equipment))
        equipment = list(results.scalars().all())
        fake = faker.Faker()
        for i in range(TECHNICIAN_COUNT):
            session.add(
                Technician(
                    full_name=fake.name(), 
                    hospital_id=hospitals[random.randrange(0,len(hospitals))].id
                )
            )
        results = await session.execute(select(Technician))
        technicians: list[Technician] = list(results.scalars().all())
        for i in range(ORDER_COUNT):
            title = fake.sentence(ext_word_list=medical_words)
            priority = random.choice([prio.value for prio in WorkOrderPriority])
            status = random.choice([s.value for s in WorkOrderStatus])
            technician_id = technicians[random.randrange(0,TECHNICIAN_COUNT)].id
            equipment_id = equipment[random.randrange(0,EQUIPMENT_COUNT)].id
            session.add(
                WorkOrder(
                    title=title,
                    priority=priority,
                    status=status,
                    technician_id=technician_id,
                    equipment_id=equipment_id
                )
            )
        results = await session.execute(select(WorkOrder))
        work_orders: list[WorkOrder] = list(results.scalars().all())
        for i in range(REPORT_COUNT):
            session.add(
                ServiceReport(
                    file_url="https://medflow-bucket.s3.us-east-1.amazonaws.com/",
                    notes=fake.paragraph(ext_word_list=medical_words),
                    work_order_id=work_orders[random.randrange(ORDER_COUNT)].id
                )
            )
        await session.commit()

if __name__ == "__main__":
    asyncio.run(populate_tables())
