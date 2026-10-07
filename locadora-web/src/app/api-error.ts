import { HttpErrorResponse } from '@angular/common/http';
import { ApiError } from './reference-api';

export function apiErrorMessage(error: unknown): string {
  if (error instanceof HttpErrorResponse) {
    if (error.status === 0) return 'Não foi possível conectar ao servidor. Tente novamente em instantes.';
    return (error.error as ApiError)?.message || 'Não foi possível concluir a operação.';
  }
  return 'Não foi possível concluir a operação.';
}

export function apiFieldErrors(error: unknown): Record<string, string> {
  return error instanceof HttpErrorResponse ? (error.error as ApiError)?.fields || {} : {};
}
