import { Controller, Get } from "@nestjs/common";
import type { CameraMetricsDTO } from "@observai/types/src";
@Controller("camera")
export class CameraController {
  @Get("people-count")
  async metrics(): Promise<{ success: true; data: CameraMetricsDTO }> {
    // TODO: fetch from FastAPI or Redis pub/sub; returning dummy for now
    return {
      success: true,
      data: {
        ts: new Date().toISOString(),
        peopleIn: 120,
        peopleOut: 100,
        current: 20,
        ageBuckets: { "0-17": 2, "18-25": 8, "26-35": 5, "36-50": 3, "50+": 2 },
        gender: { male: 11, female: 9, unknown: 0 },
      },
    };
  }
}
