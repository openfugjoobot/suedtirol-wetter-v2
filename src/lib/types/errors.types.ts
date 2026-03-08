/**
 * Error types for the weather application
 */

/** Base error class for weather app */
export abstract class WeatherAppError extends Error {
  abstract readonly code: ErrorCode;
  abstract readonly severity: 'low' | 'medium' | 'high' | 'critical';
  abstract readonly recoverable: boolean;
  readonly timestamp: Date;
  readonly context?: Record<string, unknown>;
  
  constructor(message: string, context?: Record<string, unknown>) {
    super(message);
    this.timestamp = new Date();
    this.context = context;
  }
}

/** Error codes enumeration */
export type ErrorCode =
  // Network errors
  | 'NETWORK_OFFLINE'
  | 'NETWORK_TIMEOUT'
  | 'NETWORK_ERROR'
  
  // API errors
  | 'API_RATE_LIMIT'
  | 'API_INVALID_RESPONSE'
  | 'API_UNAVAILABLE'
  | 'API_FORBIDDEN'
  
  // Location errors
  | 'LOCATION_PERMISSION_DENIED'
  | 'LOCATION_UNAVAILABLE'
  | 'LOCATION_NOT_FOUND'
  
  // Data errors
  | 'DATA_STALE'
  | 'DATA_INVALID'
  | 'DATA_PARSE_ERROR'
  
  // Storage errors
  | 'STORAGE_QUOTA_EXCEEDED'
  | 'STORAGE_UNAVAILABLE'
  
  // User errors
  | 'INVALID_INPUT';

/** Network offline error */
export class NetworkOfflineError extends WeatherAppError {
  readonly code = 'NETWORK_OFFLINE';
  readonly severity = 'medium';
  readonly recoverable = true;

  constructor(context?: Record<string, unknown>) {
    super('No internet connection', context);
  }
}

/** API rate limit error */
export class ApiRateLimitError extends WeatherAppError {
  readonly code = 'API_RATE_LIMIT';
  readonly severity = 'high';
  readonly recoverable = true;
  readonly retryAfter?: number;

  constructor(retryAfter?: number, context?: Record<string, unknown>) {
    super('API rate limit exceeded', context);
    this.retryAfter = retryAfter;
  }
}

/** API unavailable error */
export class ApiUnavailableError extends WeatherAppError {
  readonly code = 'API_UNAVAILABLE';
  readonly severity = 'high';
  readonly recoverable = true;

  constructor(context?: Record<string, unknown>) {
    super('Weather service temporarily unavailable', context);
  }
}

/** Location permission denied */
export class LocationPermissionError extends WeatherAppError {
  readonly code = 'LOCATION_PERMISSION_DENIED';
  readonly severity = 'medium';
  readonly recoverable = false; // Requires user action

  constructor(context?: Record<string, unknown>) {
    super('Location permission denied', context);
  }
}

/** Data parsing error */
export class DataParseError extends WeatherAppError {
  readonly code = 'DATA_PARSE_ERROR';
  readonly severity = 'medium';
  readonly recoverable = true;

  constructor(message: string, context?: Record<string, unknown>) {
    super(`Data parsing error: ${message}`, context);
  }
}

/** Generic HTTP error */
export class HttpError extends WeatherAppError {
  readonly code = 'NETWORK_ERROR';
  readonly severity = 'medium';
  readonly recoverable = true;
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string, context?: Record<string, unknown>) {
    super(`HTTP ${status}: ${statusText}`, context);
    this.status = status;
    this.statusText = statusText;
  }
}