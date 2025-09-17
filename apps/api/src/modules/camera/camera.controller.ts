import { Controller, Get } from '@nestjs/common'
import type { ApiSuccessResponse, CameraMetricsDTO } from '@observai/types'

@Controller('camera')
export class CameraController {
  @Get('people-count')
  async metrics(): Promise<ApiSuccessResponse<CameraMetricsDTO>> {
    const data: CameraMetricsDTO = {
      ts: new Date().toISOString(),
      peopleIn: 120,
      peopleOut: 100,
      current: 20,
      ageBuckets: {
        '0-17': 2,
        '18-25': 8,
        '26-35': 5,
        '36-50': 3,
        '50+': 2,
      },
      gender: { male: 11, female: 9, unknown: 0 },
    }

    // TODO: Fetch metrics from FastAPI/Redis once available
    return { success: true, data }
  }
}
