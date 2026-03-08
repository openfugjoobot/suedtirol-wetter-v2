/**
 * Error handler service - Centralized error handling and recovery
 */

import type { WeatherAppError, ErrorCode } from '../types/errors.types';
import {
  NetworkOfflineError,
  ApiRateLimitError,
  ApiUnavailableError,
  LocationPermissionError,
  DataParseError,
  HttpError
} from '../types/errors.types';

export interface ErrorResult {
  recovered: boolean;
  showUserMessage?: boolean;
  userMessage?: string;
  useCachedData?: boolean;
  retry?: boolean;
  retryDelay?: number;
}

export interface RecoveryStrategy {
  action: 'show-error' | 'cache-fallback' | 'cache-fallback-expires' | 'prompt-settings' | 'retry';
  showBanner?: boolean;
  retry?: boolean;
  delay?: number;
  maxAge?: number;
  useDefault?: boolean;
}

export type ErrorSubscriber = (error: WeatherAppError, result: ErrorResult) => void;

export class ErrorHandler {
  private errorQueue: WeatherAppError[] = [];
  private subscribers: Set<ErrorSubscriber> = new Set();

  /**
   * Handle an error with appropriate recovery strategy
   */
  async handle(error: unknown): Promise<ErrorResult> {
    const appError = this.normalize(error);
    
    // Log error (dev mode)
    if (import.meta.env.DEV) {
      console.error('[ErrorHandler]', appError, appError.context);
    }
    
    // Track for analytics
    this.track(appError);
    
    // Determine recovery strategy
    const strategy = this.getStrategy(appError);
    
    // Execute recovery
    const result = await this.recover(appError, strategy);
    
    // Notify subscribers
    this.notify(appError, result);
    
    return result;
  }
  
  /**
   * Subscribe to error notifications
   */
  subscribe(callback: ErrorSubscriber): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }
  
  /**
   * Normalize various error types to WeatherAppError
   */
  private normalize(error: unknown): WeatherAppError {
    // Already a WeatherAppError
    if (error instanceof Error && 'code' in error) {
      return error as WeatherAppError;
    }
    
    // Network error types
    if (error instanceof TypeError) {
      if (!navigator.onLine) {
        return new NetworkOfflineError({ originalError: error.message });
      }
      return new DataParseError(error.message, { originalError: error.message });
    }
    
    // DOM exception (often from geolocation)
    if (error instanceof DOMException) {
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        return new LocationPermissionError({ originalError: error.message });
      }
    }
    
    // Generic error
    return new DataParseError(
      error instanceof Error ? error.message : String(error),
      { originalError: error }
    );
  }
  
  /**
   * Determine recovery strategy based on error type
   */
  private getStrategy(error: WeatherAppError): RecoveryStrategy {
    switch (error.code) {
      case 'NETWORK_OFFLINE':
        return { 
          action: 'cache-fallback', 
          showBanner: true 
        };
        
      case 'API_RATE_LIMIT':
        return { 
          action: 'retry', 
          delay: (error as ApiRateLimitError).retryAfter || 60000,
          showBanner: true
        };
        
      case 'API_UNAVAILABLE':
        return { 
          action: 'cache-fallback-expires', 
          maxAge: 2 * 60 * 60 * 1000, // 2 hours
        };
        
      case 'LOCATION_PERMISSION_DENIED':
        return { 
          action: 'prompt-settings', 
          useDefault: true 
        };
        
      case 'DATA_PARSE_ERROR':
        return { 
          action: 'cache-fallback', 
          showBanner: true 
        };
        
      default:
        return { action: 'show-error' };
    }
  }
  
  /**
   * Execute recovery strategy
   */
  private async recover(
    error: WeatherAppError,
    strategy: RecoveryStrategy
  ): Promise<ErrorResult> {
    switch (strategy.action) {
      case 'cache-fallback':
        return {
          recovered: true,
          useCachedData: true,
          showUserMessage: strategy.showBanner,
          userMessage: this.getUserMessage(error.code)
        };
        
      case 'cache-fallback-expires':
        return {
          recovered: true,
          useCachedData: true,
          showUserMessage: true,
          userMessage: this.getUserMessage(error.code)
        };
        
      case 'retry':
        return {
          recovered: true,
          retry: true,
          retryDelay: strategy.delay,
          showUserMessage: strategy.showBanner,
          userMessage: this.getUserMessage(error.code)
        };
        
      case 'prompt-settings':
        return {
          recovered: false,
          showUserMessage: true,
          userMessage: this.getUserMessage(error.code)
        };
        
      case 'show-error':
      default:
        return {
          recovered: false,
          showUserMessage: true,
          userMessage: this.getUserMessage(error.code) || error.message
        };
    }
  }
  
  /**
   * Get user-facing error message for error code
   */
  private getUserMessage(code: ErrorCode): string {
    const messages: Record<ErrorCode, string> = {
      NETWORK_OFFLINE: 'Keine Internetverbindung. Zeige zuletzt geladene Daten.',
      NETWORK_TIMEOUT: 'Netzwerk-Zeitüberschreitung. Bitte später erneut versuchen.',
      NETWORK_ERROR: 'Netzwerkfehler. Bitte später erneut versuchen.',
      API_RATE_LIMIT: 'Wetterdienst vorübergehend nicht verfügbar. Bitte in kurzem erneut versuchen.',
      API_INVALID_RESPONSE: 'Ungültige Daten vom Wetterdienst erhalten.',
      API_UNAVAILABLE: 'Wetterdienst vorübergehend nicht verfügbar.',
      API_FORBIDDEN: 'Zugriff auf Wetterdienst verweigert.',
      LOCATION_PERMISSION_DENIED: 'Standortberechtigung verweigert. Bitte Standort in den Einstellungen aktivieren.',
      LOCATION_UNAVAILABLE: 'Standort nicht verfügbar.',
      LOCATION_NOT_FOUND: 'Ort nicht gefunden.',
      DATA_STALE: 'Daten sind nicht mehr aktuell.',
      DATA_INVALID: 'Ungültige Daten erhalten.',
      DATA_PARSE_ERROR: 'Fehler beim Verarbeiten der Daten.',
      STORAGE_QUOTA_EXCEEDED: 'Speicherplatz voll.',
      STORAGE_UNAVAILABLE: 'Speicher nicht verfügbar.',
      INVALID_INPUT: 'Ungültige Eingabe.'
    };
    
    return messages[code] || 'Ein unbekannter Fehler ist aufgetreten.';
  }
  
  /**
   * Track error for analytics
   */
  private track(error: WeatherAppError): void {
    // In a real implementation, this would send to analytics service
    // For now, we just log to console in development
    if (import.meta.env.DEV) {
      console.info('[Error Tracking]', {
        code: error.code,
        message: error.message,
        severity: error.severity,
        timestamp: error.timestamp,
        context: error.context
      });
    }
  }
  
  /**
   * Notify subscribers of error
   */
  private notify(error: WeatherAppError, result: ErrorResult): void {
    this.subscribers.forEach(callback => {
      try {
        callback(error, result);
      } catch (callbackError) {
        console.error('[ErrorHandler] Error in subscriber callback:', callbackError);
      }
    });
  }
}