from enum import Enum
from datetime import datetime

class SystemState(Enum):
    HEALTHY = "SYSTEM_HEALTHY"
    DEGRADED = "SYSTEM_DEGRADED"
    OFFLINE = "SYSTEM_OFFLINE"

class PhysicalState(Enum):
    NORMAL = "PHYSICAL_NORMAL"
    WATCH = "PHYSICAL_WATCH"
    ALERT = "PHYSICAL_ALERT"
    EMERGENCY = "PHYSICAL_EMERGENCY"

class CodeBlueHSM:
    def __init__(self, node_id: str):
        self.node_id = node_id
        self.system_state = SystemState.HEALTHY
        self.physical_state = PhysicalState.NORMAL
        self.last_update = datetime.utcnow()

    def process_sensor_event(self, distance: float, motion: bool):
        self.last_update = datetime.utcnow()
        # simplified 2-level hierarchical state transition
        if distance < 0.5 and motion:
            self.physical_state = PhysicalState.WATCH
        elif distance < 0.5 and not motion and self.physical_state == PhysicalState.WATCH:
            self.physical_state = PhysicalState.ALERT
        elif distance > 1.5:
            self.physical_state = PhysicalState.NORMAL
            
        return {
            "node_id": self.node_id,
            "system": self.system_state.value,
            "physical": self.physical_state.value,
            "timestamp": self.last_update.isoformat()
        }
