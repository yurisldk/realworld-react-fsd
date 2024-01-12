export interface Contract<Raw, Data extends Raw> {
  isData: (prepared: Raw) => prepared is Data;
  getErrorMessages: (prepared: Raw) => string[];
}

type Json =
  | null
  | undefined
  | string
  | number
  | boolean
  | { [x: string]: Json }
  | Array<Json>;

type Query =
  | string
  | Record<string, string>
  | string[][]
  | URLSearchParams
  | undefined;

export interface QueryConfig<Params, Data, TransformedData> {
  params?: Params;
  request: {
    url: string | ((params: Params) => string);
    method:
      | 'HEAD'
      | 'GET'
      | 'POST'
      | 'PUT'
      | 'PATCH'
      | 'DELETE'
      | 'QUERY'
      | 'OPTIONS';
    headers?: (headers: Record<string, string>) => void;
    query?: Query | ((params: Params) => Query);
    body?: Json | ((params: Params) => Json);
  };
  response: {
    contract: Contract<unknown, Data>;
    mapData: (data: { result: Data; params: Params }) => TransformedData;
  };
}
