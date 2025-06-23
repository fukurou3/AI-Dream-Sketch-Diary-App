import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ticket, TicketPackage, UserTicketStatus } from '@/types/Ticket';
import { STORAGE_KEYS } from '@/constants/StorageKeys';

export class TicketService {
  private static readonly TICKET_EXPIRY_DAYS = 30;
  private static readonly AD_COOLDOWN_MINUTES = 5; // Minimum time between ad watches
  
  // Predefined ticket packages for purchase
  private static readonly TICKET_PACKAGES: TicketPackage[] = [
    {
      id: 'basic',
      name: 'Basic Pack',
      ticketCount: 10,
      price: 120, // JPY
      priceUSD: 0.80,
    },
    {
      id: 'popular',
      name: 'Popular Pack',
      ticketCount: 25,
      price: 250, // JPY
      priceUSD: 1.70,
      isPopular: true,
    },
    {
      id: 'premium',
      name: 'Premium Pack',
      ticketCount: 50,
      price: 400, // JPY
      priceUSD: 2.70,
    },
  ];

  // Get current user ticket status
  static async getUserTicketStatus(): Promise<UserTicketStatus> {
    try {
      const tickets = await this.getTickets();
      const availableTickets = tickets.filter(t => !t.isUsed && !this.isExpired(t)).length;
      const totalTicketsEarned = tickets.filter(t => t.type === 'free').length;
      const totalTicketsUsed = tickets.filter(t => t.isUsed).length;
      const totalTicketsPurchased = tickets.filter(t => t.type === 'purchased').length;
      
      const lastAdWatchedAtStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_AD_WATCHED);
      const lastAdWatchedAt = lastAdWatchedAtStr ? new Date(lastAdWatchedAtStr) : undefined;
      
      const canWatchAd = this.canWatchAdNow(lastAdWatchedAt);
      const nextAdAvailableAt = lastAdWatchedAt ? 
        new Date(lastAdWatchedAt.getTime() + this.AD_COOLDOWN_MINUTES * 60 * 1000) : 
        undefined;

      return {
        availableTickets,
        totalTicketsEarned,
        totalTicketsUsed,
        totalTicketsPurchased,
        lastAdWatchedAt,
        canWatchAd,
        nextAdAvailableAt,
      };
    } catch (error) {
      console.error('Error getting user ticket status:', error);
      return {
        availableTickets: 0,
        totalTicketsEarned: 0,
        totalTicketsUsed: 0,
        totalTicketsPurchased: 0,
        canWatchAd: true,
      };
    }
  }

  // Get all tickets
  private static async getTickets(): Promise<Ticket[]> {
    try {
      const ticketsJson = await AsyncStorage.getItem(STORAGE_KEYS.TICKETS);
      if (!ticketsJson) return [];
      
      const tickets = JSON.parse(ticketsJson);
      return tickets.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        expiresAt: new Date(t.expiresAt),
        usedAt: t.usedAt ? new Date(t.usedAt) : undefined,
      }));
    } catch (error) {
      console.error('Error loading tickets:', error);
      return [];
    }
  }

  // Save tickets
  private static async saveTickets(tickets: Ticket[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    } catch (error) {
      console.error('Error saving tickets:', error);
      throw error;
    }
  }

  // Award ticket for watching ad
  static async awardTicketForAd(adId?: string): Promise<boolean> {
    try {
      const lastAdWatchedAtStr = await AsyncStorage.getItem(STORAGE_KEYS.LAST_AD_WATCHED);
      const lastAdWatchedAt = lastAdWatchedAtStr ? new Date(lastAdWatchedAtStr) : undefined;
      
      // Check if user can watch ad
      if (!this.canWatchAdNow(lastAdWatchedAt)) {
        return false;
      }

      const tickets = await this.getTickets();
      const newTicket: Ticket = {
        id: `free_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: 'free',
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + this.TICKET_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
        isUsed: false,
        sourceAd: adId,
      };

      tickets.push(newTicket);
      await this.saveTickets(tickets);
      
      // Update last ad watched time
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_AD_WATCHED, new Date().toISOString());
      
      return true;
    } catch (error) {
      console.error('Error awarding ticket for ad:', error);
      return false;
    }
  }

  // Purchase tickets
  static async purchaseTickets(packageId: string): Promise<boolean> {
    try {
      const ticketPackage = this.TICKET_PACKAGES.find(p => p.id === packageId);
      if (!ticketPackage) {
        throw new Error('Invalid ticket package');
      }

      const tickets = await this.getTickets();
      const purchaseTime = new Date();
      
      // Create purchased tickets
      for (let i = 0; i < ticketPackage.ticketCount; i++) {
        const newTicket: Ticket = {
          id: `purchased_${Date.now()}_${i}_${Math.random().toString(36).substr(2, 9)}`,
          type: 'purchased',
          createdAt: purchaseTime,
          expiresAt: new Date(purchaseTime.getTime() + this.TICKET_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
          isUsed: false,
        };
        
        tickets.push(newTicket);
      }

      await this.saveTickets(tickets);
      return true;
    } catch (error) {
      console.error('Error purchasing tickets:', error);
      return false;
    }
  }

  // Use a ticket for image generation
  static async useTicket(): Promise<boolean> {
    try {
      const tickets = await this.getTickets();
      const availableTicket = tickets.find(t => !t.isUsed && !this.isExpired(t));
      
      if (!availableTicket) {
        return false;
      }

      availableTicket.isUsed = true;
      availableTicket.usedAt = new Date();
      
      await this.saveTickets(tickets);
      return true;
    } catch (error) {
      console.error('Error using ticket:', error);
      return false;
    }
  }

  // Clean up expired tickets
  static async cleanupExpiredTickets(): Promise<void> {
    try {
      const tickets = await this.getTickets();
      const validTickets = tickets.filter(t => !this.isExpired(t));
      
      if (validTickets.length !== tickets.length) {
        await this.saveTickets(validTickets);
      }
    } catch (error) {
      console.error('Error cleaning up expired tickets:', error);
    }
  }

  // Get available ticket packages
  static getTicketPackages(): TicketPackage[] {
    return [...this.TICKET_PACKAGES];
  }

  // Check if ticket is expired
  private static isExpired(ticket: Ticket): boolean {
    return ticket.expiresAt < new Date();
  }

  // Check if user can watch ad now
  private static canWatchAdNow(lastAdWatchedAt?: Date): boolean {
    if (!lastAdWatchedAt) return true;
    
    const cooldownEnd = new Date(lastAdWatchedAt.getTime() + this.AD_COOLDOWN_MINUTES * 60 * 1000);
    return new Date() >= cooldownEnd;
  }

  // Get time until next ad is available
  static getTimeUntilNextAd(lastAdWatchedAt?: Date): number {
    if (!lastAdWatchedAt) return 0;
    
    const cooldownEnd = new Date(lastAdWatchedAt.getTime() + this.AD_COOLDOWN_MINUTES * 60 * 1000);
    const now = new Date();
    
    return Math.max(0, cooldownEnd.getTime() - now.getTime());
  }
}