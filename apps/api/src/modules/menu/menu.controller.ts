import { Controller, Get } from '@nestjs/common'
import type { ApiSuccessResponse, MenuItemDTO } from '@observai/types'

@Controller('menu')
export class MenuController {
  @Get()
  list(): ApiSuccessResponse<MenuItemDTO[]> {
    return {
      success: true,
      data: [
        {
          id: '1',
          name_tr: 'Çay',
          name_en: 'Tea',
          price: 15,
          category: 'Hot Drink',
          inStock: true,
        },
        {
          id: '2',
          name_tr: 'Latte',
          name_en: 'Latte',
          price: 75,
          category: 'Coffee',
          inStock: true,
        },
      ],
    }
  }
}
