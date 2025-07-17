import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { EVerificationTypes } from 'src/common/types/verification';
import { SendOtp, VerifyOtpDto } from './dto/verification.dto';

@ApiTags('Verification')
@Controller('verification')
export class VerificationController {
    constructor(private readonly verificationService: VerificationService) { }
    @ApiOperation({
        description: `Valid types:
        ${EVerificationTypes.REGISTER},
        ${EVerificationTypes.RESET_PASSWORD},
        ${EVerificationTypes.EDIT_PHOHE}`,
    })

    @Post('send')
    sendOtp(@Body() body: SendOtp) {
        return this.verificationService.sendOtp(body)
    }

    @ApiOperation({
        description: `Valid types:
        ${EVerificationTypes.REGISTER},
        ${EVerificationTypes.RESET_PASSWORD},
        ${EVerificationTypes.EDIT_PHOHE}`,
    })

    @Post('verify')
    verifyOtp(@Body() body: VerifyOtpDto) {
        return this.verificationService.verifyOtp(body)
    }
}
