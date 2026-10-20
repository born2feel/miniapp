/**
 * Contract of POST /api/client/profile.
 * The backend assembles the response from yclients/amoCRM by the client's phone number.
 */

export interface ProfileRequest {
  /** Number in E.164 format, e.g. +15550100001. */
  phone: string;
}

export interface ClientProfileResponse {
  client: Client;
  cards: BonusCard[];
  /** The 20 latest appointments, both upcoming and past. */
  visits: Visit[];
  subscriptions: Subscription[];
  /** Links to branch pages on map services. Key is `Branch.id`. */
  reviewLinks: Record<string, string>;
}

export type ClubLevelCode = 'silver' | 'gold' | 'platinum';

export interface ClubStatus {
  level: ClubLevelCode;
  /** Level name for the UI: "Silver", "Gold"… */
  levelName: string;
  discountPercent: number;
  /** Total spent on visits, USD, counted towards the next level. */
  spent: number;
  /** `null` means the client is at the top level. */
  nextLevel: { name: string; threshold: number; discountPercent: number } | null;
}

export interface Referral {
  invitedCount: number;
  bonusesEarned: number;
}

export interface Client {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  club: ClubStatus;
  referral: Referral;
}

export interface BonusCard {
  id: number;
  title: string;
  /** Masked card number. */
  number: string;
  balance: number;
  unit: 'bonus' | 'usd';
  /** ISO date when the balance expires, if any. */
  expiresAt: string | null;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
}

export interface Master {
  name: string;
  position: string;
}

export type VisitStatus = 'upcoming' | 'completed' | 'cancelled';

/** The client's rating of a visit. */
export type VisitRating = 1 | 2 | 3 | 4 | 5;

export interface Visit {
  id: number;
  /** ISO start date and time. */
  datetime: string;
  status: VisitStatus;
  category: string;
  services: string[];
  branch: Branch;
  master: Master;
  price: number;
  /** `null` means the client has not rated the visit yet. */
  rating: VisitRating | null;
}

export interface SubscriptionService {
  name: string;
  total: number;
  used: number;
}

export interface Subscription {
  id: number;
  title: string;
  price: number;
  discountPrice: number;
  paid: number;
  /** Amount left to pay, USD. */
  toPay: number;
  frozen: boolean;
  validUntil: string;
  services: SubscriptionService[];
}
