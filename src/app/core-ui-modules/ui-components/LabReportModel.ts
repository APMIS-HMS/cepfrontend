export interface ILabReportModel {
    patientName :string;
    apmisId : string;
    request? :string;
    doctor : string;
    status? : string;
    clinic? :string;
    date? : Date;
}
// This a grouped report data
export interface  ILabReportSummaryModel {
    location : string;
    summary : ISummary[]
    
}
export interface ISummary {
    request :string;
    total : number;
}
export interface IGroupableLabReportModel
{
    group : string;
    data : ILabReportModel[];
}
export interface ILabReportOption {
    filterByDate?  :boolean;
    startDate? : Date;
    endDate? : Date;
    filterByClinic? : boolean;
    queryString? : string;
    searchBy? : string | 'all';
    isInvestigation? : boolean;  // if it an investigation summary report.
    /*If Pagination is turned on the backend api should assign pagination
     * to feathers pagination settings eg: $limit : opt.paginate ? opt.paginationOptions.limit : 0 etc */
    paginate? : boolean ;
    paginationOptions? : IPaginationOptions;
    // Groupings
    groupBy? : 'location' | 'bench';
    useGrouping? : boolean;
}
export interface IPaginationOptions
{
    limit : number;
    skip : number;
}


