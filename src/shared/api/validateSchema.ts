import type { ActionResult, ErrorFields } from '~shared/api/action-result';

type ValidationIssue = {
  path: PropertyKey[];
  message: string;
};

type SafeParseResult<TParsed> =
  | { success: true; data: TParsed }
  | { success: false; error: { issues: ValidationIssue[] } };

type SafeParseSchema<TParsed> = {
  safeParse(data: unknown): SafeParseResult<TParsed>;
};

function toErrorField(path: PropertyKey[]) {
  const normalizedPath = path.length > 1 ? path.slice(1) : path;
  const field = normalizedPath.map(String).join('.');

  return field || 'body';
}

export function validateSchema<TParsed>(
  schema: SafeParseSchema<TParsed>,
  data: unknown,
): ActionResult<{ data: TParsed }> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { ok: true, data: result.data };
  }

  const errors = result.error.issues.reduce<ErrorFields>((fieldErrors, issue) => {
    const field = toErrorField(issue.path);
    const messages = fieldErrors[field] ?? [];

    messages.push(issue.message);
    fieldErrors[field] = messages;

    return fieldErrors;
  }, {});

  return { ok: false, errors };
}
