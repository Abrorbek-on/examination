import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserRole } from '@prisma/client';
import { RoleGuard } from 'src/common/guard/role.guard';
import { AuthGuard } from 'src/common/global/guard';
import { Roles } from 'src/common/global/decarator';
import { PaymeRequest } from 'src/common/types/payments_types/payme';
import { TAuthUser } from 'src/common/types/user';

// @ApiExcludeController(true)
@ApiTags('Payment')
@Controller()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @ApiOperation({ summary: UserRole.STUDENT })
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RoleGuard)
  @Roles(UserRole.STUDENT)
  @Post('api/payment/checkout')
  createPayment(@Body() payload: CreatePaymentDto, @Req() req: any) {
    return this.paymentsService.createPayment(payload, req.user as TAuthUser);
  }

  @ApiExcludeEndpoint()
  @Post('payment/payme/gateway')
  paymeRequest(
    @Body() payload: PaymeRequest,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.paymentsService.handlePaymeRequest(payload, req, res);
  }

  // TODO: Will be removed
  @ApiExcludeEndpoint()
  @Get('payment/delete-transactions')
  deleteAllTransactions() {
    return this.paymentsService.deleteTransactions();
  }
}
