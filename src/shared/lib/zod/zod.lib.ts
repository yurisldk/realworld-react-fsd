import { ZodType } from 'zod';

export function formikContract<D>(data: ZodType<D>) {
  return <V>(values: V) => {
    const errors: Record<string, string> = {};

    const parsed = data.safeParse(values);

    if (parsed.success) {
      return errors;
    }

    parsed.error.errors.forEach((e) => {
      e.path.forEach((path) => {
        errors[path] = e.message;
      });
    });

    return errors;
  };
}

export interface Contract<Raw, Data extends Raw> {
  isData: (prepared: Raw) => prepared is Data;
  getErrorMessages: (prepared: Raw) => string[];
}

export function zodContract<D>(data: ZodType<D>): Contract<unknown, D> {
  function isData(prepared: unknown): prepared is D {
    return data.safeParse(prepared).success;
  }

  return {
    isData,
    getErrorMessages(raw) {
      const validation = data.safeParse(raw);
      if (validation.success) {
        return [];
      }

      return validation.error.errors.map((e) => {
        const path = e.path.join('.');
        return path !== '' ? `${e.message}, path: ${path}` : e.message;
      });
    },
  };
}
