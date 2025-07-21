import { PartialType } from "@nestjs/swagger"
import { CreateLessonGroupDto } from "../create-lesson-group.dto/create-lesson-group.dto";

export class UpdateLessonGroupDto extends PartialType(CreateLessonGroupDto) {}