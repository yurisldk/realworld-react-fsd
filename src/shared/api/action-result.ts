export type ErrorFields = Record<string, string[]>;

export type ActionResult<TSuccess extends object = Record<string, never>> =
  | ({ ok: true } & TSuccess)
  | { ok: false; errors: ErrorFields };
