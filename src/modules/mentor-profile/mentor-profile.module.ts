import { Module } from '@nestjs/common';
import { MentorProfileController } from './mentor-profile.controller';
import { MentorProfileService } from './mentor-profile.service';

@Module({
  controllers: [MentorProfileController],
  providers: [MentorProfileService]
})
export class MentorProfileModule {}
