/** The record does not exist, or belongs to another tenant (same answer). */
export class NotFoundError extends Error {
  constructor(readonly entity: string) {
    super(`${entity} not found`);
    this.name = 'NotFoundError';
  }
}

export class ValidationError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = 'ValidationError';
  }
}
