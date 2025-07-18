import { PartialType } from '@nestjs/mapped-types';
import { CreateMentorProfileDto } from '../create-mentor-profile.dto/create-mentor-profile.dto';

export class UpdateMentorProfileDto extends PartialType(CreateMentorProfileDto) {}
