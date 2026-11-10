import { BaseSupabaseRepository } from "./BaseSupabaseRepository";
import { SupabaseAuthRepository } from "./SupabaseAuthRepository";
import type { Database } from "@/integrations/supabase/types";

// Type aliases from generated Supabase types
type Tables = Database["public"]["Tables"];
type Row<T extends keyof Tables> = Tables[T]["Row"];

// Concrete repository instances for each entity
export const customerRepository = new BaseSupabaseRepository<Row<"customers">>("customers");
export const trialRepository = new BaseSupabaseRepository<Row<"trials">>("trials");
export const transactionRepository = new BaseSupabaseRepository<Row<"transactions">>("transactions");
export const chargebackRepository = new BaseSupabaseRepository<Row<"chargebacks">>("chargebacks");
export const experimentRepository = new BaseSupabaseRepository<Row<"experiments">>("experiments");
export const webhookRepository = new BaseSupabaseRepository<Row<"webhooks">>("webhooks");
export const apiKeyRepository = new BaseSupabaseRepository<Row<"api_keys">>("api_keys");
export const invoiceRepository = new BaseSupabaseRepository<Row<"invoices">>("invoices");
export const campaignRepository = new BaseSupabaseRepository<Row<"campaigns">>("campaigns");
export const discountCodeRepository = new BaseSupabaseRepository<Row<"discount_codes">>("discount_codes");
export const checkoutPageRepository = new BaseSupabaseRepository<Row<"checkout_pages">>("checkout_pages");
export const segmentRepository = new BaseSupabaseRepository<Row<"segments">>("segments");
export const blockedUserRepository = new BaseSupabaseRepository<Row<"blocked_users">>("blocked_users");
export const auditLogRepository = new BaseSupabaseRepository<Row<"audit_log">>("audit_log");
export const teamMemberRepository = new BaseSupabaseRepository<Row<"team_members">>("team_members");
export const eventRepository = new BaseSupabaseRepository<Row<"events">>("events");
export const profileRepository = new BaseSupabaseRepository<Row<"profiles">>("profiles");
export const notificationSettingsRepository = new BaseSupabaseRepository<Row<"notification_settings">>("notification_settings");

export const authRepository = new SupabaseAuthRepository();
