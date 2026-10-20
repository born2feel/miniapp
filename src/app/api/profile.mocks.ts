import {
  Branch,
  ClientProfileResponse,
  Master,
  Visit,
  VisitRating,
  VisitStatus,
} from './profile.types';

/** All names, addresses, numbers and amounts are fictional. */

const BRANCHES = {
  center: { id: 'center', name: 'Lavender Flower Street', address: '12 Flower Street' },
  park: { id: 'park', name: 'Lavender Park', address: '7 Park Avenue, Linden Mall' },
} satisfies Record<string, Branch>;

const MASTERS = {
  olga: { name: 'Olivia Turner', position: 'Senior stylist' },
  irina: { name: 'Isabel Moore', position: 'Nail technician' },
  daria: { name: 'Diana Hughes', position: 'Cosmetologist' },
  elena: { name: 'Ella Foster', position: 'Brow artist' },
} satisfies Record<string, Master>;

const PROCEDURES: { category: string; services: string[]; master: Master; price: number }[] = [
  { category: 'Hair', services: ['Haircut', 'Styling'], master: MASTERS.olga, price: 3800 },
  { category: 'Nails', services: ['Gel manicure'], master: MASTERS.irina, price: 2600 },
  { category: 'Skincare', services: ['Facial cleansing', 'Alginate mask'], master: MASTERS.daria, price: 5200 },
  { category: 'Brows & lashes', services: ['Brow shaping and tinting'], master: MASTERS.elena, price: 1900 },
  { category: 'Hair', services: ['AirTouch coloring'], master: MASTERS.olga, price: 12500 },
];

interface VisitSeed {
  daysFromNow: number;
  hour: number;
  procedure: number;
  branch: Branch;
  status: VisitStatus;
  rating?: VisitRating;
}

function dateFromNow(days: number, hour: number): string {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, days % 2 === 0 ? 0 : 30, 0, 0);
  return date.toISOString();
}

function buildVisits(firstId: number, seeds: VisitSeed[]): Visit[] {
  return seeds.map((seed, index) => {
    const procedure = PROCEDURES[seed.procedure];
    return {
      id: firstId + index,
      datetime: dateFromNow(seed.daysFromNow, seed.hour),
      status: seed.status,
      category: procedure.category,
      services: procedure.services,
      branch: seed.branch,
      master: procedure.master,
      price: procedure.price,
      rating: seed.rating ?? null,
    };
  });
}

const { center, park } = BRANCHES;

const goldClient: ClientProfileResponse = {
  client: {
    id: 10421,
    firstName: 'Anna',
    lastName: 'Sokolova',
    phone: '+79990000001',
    club: {
      level: 'gold',
      levelName: 'Gold',
      discountPercent: 10,
      spent: 112_400,
      nextLevel: { name: 'Platinum', threshold: 150_000, discountPercent: 15 },
    },
    referral: { invitedCount: 4, bonusesEarned: 2000 },
  },
  cards: [
    { id: 1, title: 'Club bonus card', number: '•••• 4821', balance: 2340, unit: 'bonus', expiresAt: null },
    { id: 2, title: 'Gift certificate', number: '•••• 0917', balance: 5000, unit: 'rub', expiresAt: dateFromNow(64, 0) },
    { id: 3, title: 'Review bonuses', number: '•••• 3305', balance: 300, unit: 'bonus', expiresAt: dateFromNow(20, 0) },
  ],
  visits: buildVisits(5001, [
    { daysFromNow: 2, hour: 11, procedure: 1, branch: center, status: 'upcoming' },
    { daysFromNow: 9, hour: 16, procedure: 0, branch: center, status: 'upcoming' },
    { daysFromNow: 23, hour: 13, procedure: 2, branch: park, status: 'upcoming' },
    { daysFromNow: -6, hour: 12, procedure: 3, branch: park, status: 'completed' },
    { daysFromNow: -13, hour: 18, procedure: 1, branch: center, status: 'completed', rating: 5 },
    { daysFromNow: -21, hour: 10, procedure: 0, branch: center, status: 'completed', rating: 4 },
    { daysFromNow: -30, hour: 15, procedure: 2, branch: park, status: 'completed', rating: 5 },
    { daysFromNow: -34, hour: 19, procedure: 1, branch: center, status: 'cancelled' },
    { daysFromNow: -42, hour: 11, procedure: 4, branch: center, status: 'completed', rating: 5 },
    { daysFromNow: -55, hour: 17, procedure: 1, branch: park, status: 'completed', rating: 3 },
    { daysFromNow: -63, hour: 12, procedure: 3, branch: center, status: 'completed' },
    { daysFromNow: -77, hour: 14, procedure: 0, branch: center, status: 'completed', rating: 5 },
    { daysFromNow: -84, hour: 18, procedure: 1, branch: center, status: 'completed', rating: 4 },
    { daysFromNow: -98, hour: 10, procedure: 2, branch: park, status: 'completed', rating: 5 },
    { daysFromNow: -112, hour: 16, procedure: 1, branch: park, status: 'completed' },
    { daysFromNow: -126, hour: 13, procedure: 0, branch: center, status: 'completed', rating: 5 },
    { daysFromNow: -140, hour: 11, procedure: 3, branch: center, status: 'completed', rating: 2 },
    { daysFromNow: -155, hour: 15, procedure: 4, branch: center, status: 'completed', rating: 5 },
    { daysFromNow: -170, hour: 19, procedure: 1, branch: park, status: 'completed', rating: 4 },
    { daysFromNow: -184, hour: 12, procedure: 2, branch: park, status: 'completed', rating: 5 },
  ]),
  subscriptions: [
    {
      id: 301,
      title: 'Radiant Skin package',
      price: 36_000,
      discountPrice: 30_600,
      paid: 20_000,
      toPay: 10_600,
      frozen: false,
      validUntil: dateFromNow(120, 0),
      services: [
        { name: 'Facial cleansing', total: 6, used: 2 },
        { name: 'Peel', total: 4, used: 1 },
        { name: 'Facial massage', total: 6, used: 3 },
      ],
    },
    {
      id: 302,
      title: 'Six-month manicure package',
      price: 15_600,
      discountPrice: 13_200,
      paid: 13_200,
      toPay: 0,
      frozen: true,
      validUntil: dateFromNow(75, 0),
      services: [{ name: 'Gel manicure', total: 6, used: 4 }],
    },
  ],
  reviewLinks: {
    center: 'https://yandex.com/maps/?text=Lavender%20beauty%20salon',
    park: 'https://www.google.com/maps/search/Lavender+beauty+salon',
  },
};

const silverClient: ClientProfileResponse = {
  client: {
    id: 11873,
    firstName: 'Maria',
    lastName: 'Lebedeva',
    phone: '+79990000002',
    club: {
      level: 'silver',
      levelName: 'Silver',
      discountPercent: 5,
      spent: 18_600,
      nextLevel: { name: 'Gold', threshold: 50_000, discountPercent: 10 },
    },
    referral: { invitedCount: 0, bonusesEarned: 0 },
  },
  cards: [
    { id: 4, title: 'Club bonus card', number: '•••• 7712', balance: 480, unit: 'bonus', expiresAt: null },
  ],
  visits: buildVisits(6001, [
    { daysFromNow: -10, hour: 13, procedure: 1, branch: park, status: 'completed' },
    { daysFromNow: -38, hour: 17, procedure: 3, branch: park, status: 'completed', rating: 5 },
    { daysFromNow: -66, hour: 12, procedure: 1, branch: park, status: 'completed', rating: 4 },
    { daysFromNow: -95, hour: 18, procedure: 0, branch: center, status: 'cancelled' },
    { daysFromNow: -120, hour: 11, procedure: 1, branch: park, status: 'completed', rating: 5 },
    { daysFromNow: -150, hour: 15, procedure: 3, branch: park, status: 'completed' },
  ]),
  subscriptions: [],
  reviewLinks: goldClient.reviewLinks,
};

export const MOCK_PROFILES: Record<string, ClientProfileResponse> = {
  [goldClient.client.phone]: goldClient,
  [silverClient.client.phone]: silverClient,
};

/** Number for the error demo: the first request fails, a retry returns Anna's profile. */
export const DEMO_ERROR_PHONE = '+79990000000';
MOCK_PROFILES[DEMO_ERROR_PHONE] = goldClient;

export const DEMO_PHONES: { phone: string; title: string }[] = [
  { phone: goldClient.client.phone, title: 'Anna · Gold' },
  { phone: silverClient.client.phone, title: 'Maria · Silver' },
  { phone: DEMO_ERROR_PHONE, title: 'Network error' },
];
