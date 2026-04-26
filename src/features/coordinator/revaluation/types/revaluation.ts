export type DataMap = Record<string, string | number | null | undefined>;

export interface RevaluationData {
  found: boolean;
  client?: DataMap;
  bank?: DataMap | null;
  bankOfficer?: DataMap | null;
  property?: DataMap | null;
  survey?: DataMap | null;
  legal?: DataMap | null;
  documents?: DataMap[];
}
