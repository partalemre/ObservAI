import { Body, Controller, Get, Post } from '@nestjs/common'
import { randomUUID } from 'node:crypto'
import type {
  ApiSuccessResponse,
  OrderDTO,
  OrderLineItem,
} from '@observai/types'

type CreateOrderPayload = {
  items: OrderLineItem[]
}

@Controller('orders')
export class OrdersController {
  private orders: OrderDTO[] = []

  @Get()
  list(): ApiSuccessResponse<OrderDTO[]> {
    return { success: true, data: this.orders }
  }

  @Post()
  create(@Body() payload: CreateOrderPayload): ApiSuccessResponse<OrderDTO> {
    const order: OrderDTO = {
      id: randomUUID(),
      status: 'open',
      items: payload.items,
      total: payload.items.reduce(
        (sum, item) => sum + item.qty * item.price,
        0,
      ),
      createdAt: new Date().toISOString(),
    }

    this.orders.push(order)
    return { success: true, data: order }
  }
}
