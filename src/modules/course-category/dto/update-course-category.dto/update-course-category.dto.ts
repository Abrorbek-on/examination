import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseCategoryDto } from '../create-course-category.dto/create-course-category.dto';

export class UpdateCourseCategoryDto extends PartialType(CreateCourseCategoryDto) {}
