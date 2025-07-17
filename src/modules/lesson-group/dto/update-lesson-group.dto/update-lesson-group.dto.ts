import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonGroupDto } from '../create-lesson-group.dto/create-lesson-group.dto';

export class UpdateLessonGroupDto extends PartialType(CreateLessonGroupDto) {}
