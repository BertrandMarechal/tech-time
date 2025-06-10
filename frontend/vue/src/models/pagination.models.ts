export interface PaginationResults<T=any> {
    data: T[];
    total: number;
}