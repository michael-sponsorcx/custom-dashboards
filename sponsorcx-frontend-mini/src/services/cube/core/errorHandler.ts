/**
 * Error handling utilities for Cube API
 *
 * Provides consistent error handling and logging across all Cube services.
 */

import { CubeApiError } from '../types';

/**
 * Handle and log API errors
 *
 * @param error - Error object
 * @param context - Context string for logging
 * @returns Formatted error
 */
export function handleApiError(error: unknown, context: string): CubeApiError {
  console.error(`Error in ${context}:`, error);

  if (error instanceof CubeApiError) {
    return error;
  }

  if (error instanceof Error) {
    return new CubeApiError(error.message);
  }

  return new CubeApiError('Unknown error occurred');
}

/**
 * Check if error is a network error
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof CubeApiError) {
    return !error.statusCode || error.statusCode >= 500;
  }

  if (error instanceof Error) {
    return error.message.includes('fetch') || error.message.includes('network');
  }

  return false;
}

/**
 * Check if error is an authentication error
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof CubeApiError) {
    return error.statusCode === 401 || error.statusCode === 403;
  }

  return false;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyErrorMessage(error: unknown): string {
  if (isAuthError(error)) {
    return 'Authentication failed. Please check your API credentials.';
  }

  if (isNetworkError(error)) {
    return 'Network error. Please check your connection and try again.';
  }

  if (error instanceof CubeApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred. Please try again.';
}
