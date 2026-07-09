import { z } from 'zod';

export function validateFormWithZod(schema: z.ZodTypeAny) {
  // TanStack Form v1.x expects form-level validators to either return a global form error 
  // (which breaks field-level aria-invalid mapping) OR to implement the Standard Schema interface.
  // We wrap the Zod schema in the `~standard` interface so TanStack Form natively distributes
  // the errors down to individual fields without needing an external adapter package.
  return {
    '~standard': {
      version: 1,
      vendor: 'manual-zod-bridge',
      validate: (value: any) => {
        const result = schema.safeParse(value);
        if (result.success) return { value: result.data };
        return {
          issues: result.error.issues.map(issue => ({
            message: issue.message,
            path: issue.path
          }))
        };
      }
    }
  } as any;
}
