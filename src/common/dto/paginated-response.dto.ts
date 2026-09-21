import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() limit: number;
  @ApiProperty() totalPages: number;
  @ApiProperty() hasNext: boolean;
  @ApiProperty() hasPrev: boolean;
}

export class PaginatedResponseDto<T> {
  items: T[];
  meta: PaginationMetaDto;

  static build<T>(
    items: T[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedResponseDto<T> {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const dto = new PaginatedResponseDto<T>();
    dto.items = items;
    dto.meta = {
      total,
      page,
      limit,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    };
    return dto;
  }
}