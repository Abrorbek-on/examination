import { PartialType } from '@nestjs/swagger';
import { CreateLessonDto } from '../create-lesson.dto/create-lesson.dto';

export class UpdateLessonDto extends PartialType(CreateLessonDto) {}
