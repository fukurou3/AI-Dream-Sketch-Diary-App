export interface Ticket {
  id: string;
  type: 'free' | 'purchased';
  createdAt: Date;
  expiresAt: Date;
  isUsed: boolean;
  usedAt?: Date;
  sourceAd?: string; // For tracking which ad provided the ticket
}

export interface TicketPackage {
  id: string;
  name: string;
  ticketCount: number;
  price: number; // JPY
  priceUSD: number; // USD for international
  isPopular?: boolean;
}

export interface UserTicketStatus {
  availableTickets: number;
  totalTicketsEarned: number;
  totalTicketsUsed: number;
  totalTicketsPurchased: number;
  lastAdWatchedAt?: Date;
  canWatchAd: boolean;
  nextAdAvailableAt?: Date;
}