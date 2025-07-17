import { PartialType } from '@nestjs/mapped-types';
import { CreateLessonDto } from '../create-lesson.dto/create-lesson.dto';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
