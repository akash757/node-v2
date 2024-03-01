import { Body, Controller, Post } from '@nestjs/common';
import { CalcService } from './calc.service';
import { CalcDto } from './calc.dto';

@Controller('calc')
export class CalcController {
  constructor(private readonly calcService: CalcService) {}

  @Post('/')
  calc(@Body() calcBody: CalcDto) {
    try {
      const result = this.calcService.calculateExpression(calcBody);
      return { result };
    } catch (error) {
      return {
        statusCode: 400,
        message: error.message,
        error: 'Bad Request',
      };
    }
  }
}
