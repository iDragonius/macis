import { PartialType } from '@nestjs/mapped-types';
import { CreateCurationCallDto } from './create-curation-call.dto';

export class UpdateCurationCallDto extends PartialType(CreateCurationCallDto) {}
