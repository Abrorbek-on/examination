import { PartialType } from '@nestjs/swagger';
import { CreateQuestionDto } from './ask-question.dto/ask-question.dto';

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) {}
