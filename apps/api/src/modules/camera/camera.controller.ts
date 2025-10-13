import { Controller, Get } from '@nestjs/common'
import type { ApiSuccessResponse, CameraMetricsDTO } from '@observai/types'
import { CameraService } from './camera.service'

@Controller('camera')
export class CameraController {
  constructor(private readonly cameraService: CameraService) {}

  @Get('people-count')
  async metrics(): Promise<ApiSuccessResponse<CameraMetricsDTO>> {
    const metrics = await this.cameraService.readMetrics()

    const fallback: CameraMetricsDTO = {
      ts: new Date().toISOString(),
      peopleIn: 0,
      peopleOut: 0,
      current: 0,
      ageBuckets: {
        '0-17': 0,
        '18-25': 0,
        '26-35': 0,
        '36-50': 0,
        '50+': 0,
      },
      gender: { male: 0, female: 0, unknown: 0 },
    }

    return { success: true, data: metrics ?? fallback }
  }
}
