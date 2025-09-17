import { Body, Controller, Get, Post } from "@nestjs/common";
import { OrderDTO } from "@observai/types/src";
@Controller("orders")
export class OrdersController {
  private orders: OrderDTO[] = [];
  @Get() list() {
    return { success: true, data: this.orders };
  }
  @Post()
  create(
    @Body()
    payload: {
      items: { productId: string; qty: number; price: number }[];
    },
  ) {
    const total = payload.items.reduce((s, i) => s + i.qty * i.price, 0);
    const order: OrderDTO = {
      id: crypto.randomUUID(),
      status: "open",
      items: payload.items,
      total,
      createdAt: new Date().toISOString(),
    };
    this.orders.push(order);
    return { success: true, data: order };
  }
}
