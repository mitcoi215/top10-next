// Central export for all validation schemas
export * from './category';
export * from './product';
export * from './settings';

// Helper function to format Zod errors
export function formatZodErrors(error: any): Record<string, string> {
  const errors: Record<string, string> = {};

  if (error.errors) {
    for (const err of error.errors) {
      const path = err.path.join('.');
      errors[path] = err.message;
    }
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
