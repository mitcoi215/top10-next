// Central export for all validation schemas
export * from './category';
export * from './product';
export * from './settings';
export * from './article';

// Helper function to format Zod errors
export function formatZodErrors(error: any): Record<string, string> {
  const errors: Record<string, string> = {};

  // ZodError uses 'issues' not 'errors'
  const issues = error.issues || error.errors || [];
  for (const err of issues) {
    const path = err.path?.join('.') || 'unknown';
    errors[path] = err.message;
  }

  return errors;
}

// Helper to create API error response
export function createApiError(status: number, message: string, errors?: Record<string, string>) {
  return {
    success: false,
    error: message,
    errors,
    status,
  };
}

// Helper to create API success response
export function createApiSuccess<T>(data: T, message?: string) {
  return {
    success: true,
    data,
    message,
  };
}
