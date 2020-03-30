export default interface FindResponse<T> {
    limit: number;
    start: number;
    total: number;
    records: T[];
    nextStart: number;
}
