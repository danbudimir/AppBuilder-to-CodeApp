export interface IGetOptions {
  select?: string[];
  expand?: string[];
}

export interface IGetAllOptions {
  filter?: string;
  orderBy?: string;
  top?: number;
  skip?: number;
}
