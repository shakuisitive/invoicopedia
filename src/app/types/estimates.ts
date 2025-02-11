export type ColumnType =
  | "text"
  | "status"
  | "owner"
  | "date"
  | "formula"
  | "number"
  | "label";

export interface Column {
  id: string;
  name: string;
  type: ColumnType;
  width: number;
}

export interface Estimate {
  id: string;
  data: { [key: string]: any };
  subitems?: Estimate[];
  isExpanded?: boolean;
}

export interface Group {
  id: string;
  name: string;
  estimates: Estimate[];
  isExpanded: boolean;
}
