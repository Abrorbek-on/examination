import { PartialType } from '@nestjs/mapped-types';
import { CreateHomeworkDto } from '../create-homework.dto/create-homework.dto';

export class UpdateHomeworkDto extends PartialType(CreateHomeworkDto) {}
