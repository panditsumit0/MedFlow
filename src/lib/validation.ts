/**
 * Input validation schemas using Zod.
 *
 * Every user-facing input that could reach an API or be processed server-side
 * must be validated against a strict schema here. Reject, do not sanitize.
 *
 * Usage:
 *   import { simulationInputSchema } from '@/lib/validation';
 *   const result = simulationInputSchema.safeParse(userInput);
 *   if (!result.success) return { error: 'Invalid input' }; // Never expose ZodError details to users
 */

import { z } from 'zod';

// ─── Simulation ────────────────────────────────────────────────────────────

/**
 * Demand surge slider: integer percentage between 1 and 200.
 */
export const simulationInputSchema = z.object({
  demandIncreasePercent: z
    .number()
    .int('Demand increase must be an integer')
    .min(1, 'Must be at least 1%')
    .max(200, 'Cannot exceed 200%'),
});

export type SimulationInput = z.infer<typeof simulationInputSchema>;

// ─── Search / Filter ────────────────────────────────────────────────────────

/**
 * Generic search query — max 100 chars, no HTML or script injection.
 */
export const searchQuerySchema = z.object({
  q: z
    .string()
    .max(100, 'Search query too long')
    .regex(/^[a-zA-Z0-9\s\-_.,']+$/, 'Search query contains invalid characters')
    .optional(),
});

export type SearchQuery = z.infer<typeof searchQuerySchema>;

// ─── Risk filter ─────────────────────────────────────────────────────────────

export const riskLevelSchema = z.enum(['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'SAFE']);

export type RiskLevelFilter = z.infer<typeof riskLevelSchema>;

// ─── Contact / feedback (future use) ────────────────────────────────────────

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name too long')
    .regex(/^[\p{L}\s'-]+$/u, 'Name contains invalid characters'),
  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email too long'),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(2000, 'Message too long'),
});

export type ContactForm = z.infer<typeof contactFormSchema>;

// ─── Safe error formatter ────────────────────────────────────────────────────

/**
 * Convert a ZodError into a flat list of field-level messages.
 * Never includes internal stack traces — safe to send to clients.
 */
export function formatZodErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const field = issue.path.join('.') || 'input';
    out[field] = issue.message;
  }
  return out;
}
