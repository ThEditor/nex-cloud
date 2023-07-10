import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @Transform(({ value }) => {
    let n = parseInt(value);
    if (!n || n < 0) n = 0;
    return n;
  })
  @IsNumber()
  @IsOptional()
  skip = 0;

  @Transform(({ value }) => {
    let n = parseInt(value);
    if (!n || n < 0 || n > 10) n = 10;
    return n;
  })
  @IsNumber()
  @IsOptional()
  limit = 10;
}
