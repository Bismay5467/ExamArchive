export interface SearchInput {
  query: string;
}

export interface FilterInputs {
  filter1: boolean;
  filter2: boolean;
  filter3: boolean;
}

export type Filter = 'filter1' | 'filter2' | 'filter3';
