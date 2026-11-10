import { BaseService } from "./BaseService";
import { AuthService } from "./AuthService";
import {
  customerRepository,
  trialRepository,
  transactionRepository,
  chargebackRepository,
  experimentRepository,
  webhookRepository,
  apiKeyRepository,
  invoiceRepository,
  campaignRepository,
  discountCodeRepository,
  checkoutPageRepository,
  segmentRepository,
  blockedUserRepository,
  auditLogRepository,
  teamMemberRepository,
  eventRepository,
  profileRepository,
  notificationSettingsRepository,
  authRepository,
} from "@/lib/repositories/supabase";

// Service instances — single point of access for all business logic
export const authService = new AuthService(authRepository);
export const customerService = new BaseService(customerRepository);
export const trialService = new BaseService(trialRepository);
export const transactionService = new BaseService(transactionRepository);
export const chargebackService = new BaseService(chargebackRepository);
export const experimentService = new BaseService(experimentRepository);
export const webhookService = new BaseService(webhookRepository);
export const apiKeyService = new BaseService(apiKeyRepository);
export const invoiceService = new BaseService(invoiceRepository);
export const campaignService = new BaseService(campaignRepository);
export const discountCodeService = new BaseService(discountCodeRepository);
export const checkoutPageService = new BaseService(checkoutPageRepository);
export const segmentService = new BaseService(segmentRepository);
export const blockedUserService = new BaseService(blockedUserRepository);
export const auditLogService = new BaseService(auditLogRepository);
export const teamMemberService = new BaseService(teamMemberRepository);
export const eventService = new BaseService(eventRepository);
export const profileService = new BaseService(profileRepository);
export const notificationSettingsService = new BaseService(notificationSettingsRepository);
