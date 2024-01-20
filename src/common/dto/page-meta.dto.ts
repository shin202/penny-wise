import { PageMetaParameters } from '../interfaces';

export class PageMetaDto {
  readonly pageCount: number;
  readonly itemCount: number;
  readonly perPage: number;
  readonly currentPage: number;
  readonly lastPage: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ queryOptionsDto, itemCount }: PageMetaParameters) {
    this.currentPage = queryOptionsDto.page;
    this.perPage = queryOptionsDto.limit;
    this.itemCount = itemCount;
    this.pageCount = Math.ceil(this.itemCount / this.perPage);
    this.lastPage = this.pageCount;
    this.hasPreviousPage = this.currentPage > 1;
    this.hasNextPage = this.currentPage < this.lastPage;
  }
}
