from fastapi import APIRouter
from services.thingspeak import fetch_thingspeak_data

router = APIRouter()

@router.get("/nodes")
async def get_nodes():
    return [
        {"id": "A-101", "status": "healthy"},
        {"id": "B-204", "status": "emergency"},
    ]

@router.get("/sensor_feed")
async def get_feed():
    # Polls ThingSpeak
    data = await fetch_thingspeak_data()
    return {"data": data}

import httpx
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException

class EmailRequest(BaseModel):
    target: str
    message: str

@router.post("/email/send")
async def send_email(req: EmailRequest):
    targets = [
        "codyrohith007@gmail.com",
        "sit23ec021@sairamtap.edu.in",
        "sit23ec059@sairamtap.edu.in",
        "sit23ec098@sairamtap.edu.in"
    ]
    if req.target and req.target not in targets:
        targets.append(req.target)
        
    print(f"📧 Sending REAL emergency emails to {len(targets)} wardens...")
    
    activation_needed_for = []
    
    # Using FormSubmit free HTTP-to-Email gateway for zero-auth delivery
    async with httpx.AsyncClient() as client:
        for target in targets:
            try:
                r = await client.post(
                    f"https://formsubmit.co/ajax/{target}",
                    json={
                        "System": "CodeBlueHalo.AI v2.0",
                        "Alert": "CRITICAL EMERGENCY PROTOCOL",
                        "Message": req.message,
                        "_subject": "🚨 EMERGENCY ALERT: CodeBlueHalo.AI",
                        "_template": "box"
                    },
                    headers={
                        "Accept": "application/json",
                        "Content-Type": "application/json",
                        "Origin": "https://codebluehalo.ai",
                        "Referer": "https://codebluehalo.ai"
                    },
                    timeout=15.0
                )
                r.raise_for_status()
                
                resp_data = r.json()
                if str(resp_data.get("success")).lower() == "false":
                    msg = resp_data.get("message", "")
                    if "Activation" in msg:
                        activation_needed_for.append(target)
            except Exception as e:
                print(f"❌ Failed to send email to {target}: {e}")
                
        if activation_needed_for:
            print(f"⚠️ Activation required for: {activation_needed_for}")
            return {"status": "activation_required", "message": f"Activation links sent to: {', '.join(activation_needed_for)}"}
            
        print("✅ All emails dispatched successfully.")
        return {"status": "success", "message": "Real emails dispatched to all wardens"}

@router.post("/ml/learn")
async def ml_learn():
    # Simulated ML training / learning step
    print("🧠 ML Model is learning baseline spatial telemetry")
    import asyncio
    await asyncio.sleep(1.5)
    return {"status": "success", "message": "Model weights updated"}

@router.post("/remedial")
async def trigger_remedial():
    # Simulated remedial action (e.g. buzzer, lock)
    print("🚨 Remedial Action Triggered: Activating edge nodes")
    return {"status": "success", "message": "Remedial action dispatched"}

@router.post("/override")
async def trigger_override():
    print("⚠️ GLOBAL OVERRIDE BUTTON INITIATED FROM SETTINGS ⚠️")
    return {"status": "success", "message": "System override activated"}

@router.get("/logs/person/{person_id}")
async def get_person_logs(person_id: str):
    # Simulated log retrieval
    return [
        {"id": 1, "timestamp": "10:05 AM", "event": "Behavioral Drift Detected", "severity": "warning"},
        {"id": 2, "timestamp": "11:30 AM", "event": "Prolonged Stillness", "severity": "critical"}
    ]

@router.get("/ml/generate-report")
async def generate_report():
    import asyncio
    await asyncio.sleep(2.0) # simulate LLM token stream processing
    report_text = """**Confidential XAI Analysis Report**
*System:* CodeBlueHalo.AI v2.0 (Federated Agent Core)
*Node:* B-204 (Hostel Sector)
*Incident:* Probable Fall Detected

**Telemetry Fusion Breakdown:**
- **PIR Motion:** A sudden, high-velocity spike was detected registering at 98% kinematic energy, followed by an immediate sustained plateau at 0%. This signature heavily correlates with a hard collapse with a failure to recover.
- **Ambient Thermal:** The localized Node registered an acute drop in thermal mass tracking at the 1.5m vertical plane, consistent with a human subject moving from a standing to a prone horizontal position on the floor.
- **Anomalous Drift Score:** Jumped to an 89.4 Z-score deviation against the individual's 7-day moving behavioral baseline (TCN-AE Engine). 

**Warden Copilot Conclusion:**
The synchronized sequence of kinetic shock followed by micro-stillness and a shifting thermal plane indicates a **92.8% probability of an unassisted hardware-verified fall**. 
*Recommendation: Immediate Warden dispatch is mandatory. Global Override available if mass distress is suspected.*"""
    return {"status": "success", "report": report_text}
