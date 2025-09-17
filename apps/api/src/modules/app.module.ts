import { Module } from "@nestjs/common";
import { HealthModule } from "./health/health.module";
import { MenuModule } from "./menu/menu.module";
import { OrdersModule } from "./orders/orders.module";
import { CameraModule } from "./camera/camera.module";

@Module({
  imports: [HealthModule, MenuModule, OrdersModule, CameraModule],
})
export class AppModule {}
