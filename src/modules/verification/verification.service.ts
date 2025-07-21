import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { SendOtp, VerifyOtpDto } from './dto/verification.dto';
import { EVerificationTypes, ICheckOtp } from 'src/common/types/verification';
import { PrismaService } from 'src/core/database/prisma.service';
import { generateOtp } from 'src/core/utils/random';
import { secToMills } from 'src/core/utils/times';
import { RedisService } from 'src/common/redis/redis.service';
import { SMSService } from 'src/common/services/sms.service';

@Injectable()
export class VerificationService {
    constructor(
        private prisma: PrismaService,
        private redis: RedisService,
        private smsService: SMSService,
    ) { }


    public getKey(type: EVerificationTypes, phone: string, confirmation?: boolean) {
        const storeKeys: Record<EVerificationTypes, string> = {
            [EVerificationTypes.REGISTER]: 'reg_',
            [EVerificationTypes.RESET_PASSWORD]: 'respass_',
            [EVerificationTypes.EDIT_PHOHE]: 'edph_',
        };
        let key = storeKeys[type]
        if (confirmation) {
            key += 'cfm_'
        }
        key += phone
        return key
    }

    private getMessage(type: EVerificationTypes, otp: string) {
        switch (type) {
            case EVerificationTypes.REGISTER:
                return `Fixoo platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
            case EVerificationTypes.RESET_PASSWORD:
                return `Fixoo platformasida parolingizni tiklash uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
            case EVerificationTypes.EDIT_PHOHE:
                return `Fixoo platformasida telefoningizni o'zgartirish uchun tasdiqlash kodi: ${otp}. Kodni hech kimga bermang!`;
        }

    }
    
    private async throwIfUserExists(phone: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                phone: phone
            }
        });
        if (user) {
            throw new HttpException('Phone already used', HttpStatus.BAD_REQUEST)
        }
        return user
    }
    private async throwIfUserNotExists(phone: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                phone: phone
            }
        });
        if (!user) {
            throw new HttpException('User not Found', HttpStatus.NOT_FOUND)
        }
        return user
    }


    async sendOtp(payload: SendOtp) {
        const { type, phone } = payload
        const key = this.getKey(type, phone)
        const session = await this.redis.get(key)

        if (session) {
            throw new HttpException(
                'Code already sent to user',
                HttpStatus.BAD_REQUEST
            );
        }

        switch (type) {
            case EVerificationTypes.REGISTER:
                await this.throwIfUserExists(phone);
                break
            case EVerificationTypes.EDIT_PHOHE:
                await this.throwIfUserNotExists(phone);
                break
            case EVerificationTypes.RESET_PASSWORD:
                await this.throwIfUserNotExists(phone);
                break
        }

        const otp = generateOtp()
        await this.redis.set(key, JSON.stringify(otp), secToMills(120))
        await this.smsService.sendSMS(this.getMessage(type, otp), phone)
        return { message: "Confirmation code sent" }
    }

    async verifyOtp(payload: VerifyOtpDto) {
        const { type, phone, otp } = payload
        const session = await this.redis.get(
            this.getKey(type, phone),
        )

        if (!session) {
            throw new HttpException('Otp expired', HttpStatus.BAD_REQUEST)
        }
        
        if (otp !== JSON.parse(session)) {
            throw new HttpException('Invalid Otp', HttpStatus.BAD_REQUEST)
        }
        

        await this.redis.del(this.getKey(type, phone))
        await this.redis.set(
            this.getKey(type, phone, true),
            JSON.stringify(otp),
            secToMills(300)
        );

        return {
            succes: true,
            message: 'Verifed'
        }

    }

    public async checkConfirmOtp(payload: ICheckOtp) {
        const {type, phone, otp} = payload
        const session = await this.redis.get(
            this.getKey(type, phone, true),
        );
        if(!session) {
            throw new HttpException('Session expired', HttpStatus.BAD_REQUEST)
        }
        if (otp !== JSON.parse(session)) {
            throw new HttpException('Invalid Otp', HttpStatus.BAD_REQUEST)
        }
        await this.redis.del(this.getKey(type, phone,true));
        return true
    }
}
