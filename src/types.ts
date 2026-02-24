export type Operator = "+" | "-" | "*" | "/";

export interface CalculationRecord {
  id: number;
  val1: number;
  val2: number;
  operator: Operator | string;
  // Server currently does not store answer, but client can compute it
}

export interface GetDataResponse {
  success: boolean;
  data: [CalculationRecord[], unknown];
}

export interface PostCalculationBody {
  val1: number;
  val2: number;
  operator: Operator;
  answer: number;
}
