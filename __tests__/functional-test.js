/**
 * 基本的な機能テスト
 * アプリの主要な機能が正常に動作することを確認
 */

// Mock AsyncStorage for testing
const mockAsyncStorage = {
  data: {},
  getItem: jest.fn(async (key) => {
    return mockAsyncStorage.data[key] || null;
  }),
  setItem: jest.fn(async (key, value) => {
    mockAsyncStorage.data[key] = value;
    return Promise.resolve();
  }),
  clear: jest.fn(async () => {
    mockAsyncStorage.data = {};
    return Promise.resolve();
  })
};

// Mock React Native modules
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native', () => ({
  Platform: { OS: 'ios' },
  Dimensions: { get: () => ({ width: 375, height: 812 }) },
  StyleSheet: { create: (styles) => styles },
}));

// Test imports
const { DreamStorage } = require('../services/DreamStorage');
const { AIImageGenerator } = require('../services/AIImageGenerator');
const { TicketService } = require('../services/TicketService');

describe('Core App Functionality', () => {
  beforeEach(async () => {
    await mockAsyncStorage.clear();
  });

  test('Dream Storage - Create and Retrieve Dreams', async () => {
    const testDream = {
      title: 'Test Dream',
      content: 'This is a test dream about flying',
      tags: ['flying', 'test']
    };

    // Save dream
    const savedDream = await DreamStorage.saveDream(testDream);
    expect(savedDream).toBeDefined();
    expect(savedDream.id).toBeDefined();
    expect(savedDream.title).toBe(testDream.title);

    // Retrieve dreams
    const allDreams = await DreamStorage.getAllDreams();
    expect(allDreams).toHaveLength(1);
    expect(allDreams[0].title).toBe(testDream.title);
  });

  test('AI Image Generation - Generate Image for Dream', async () => {
    const testDream = {
      id: 'test-dream-1',
      title: 'Flying Dream',
      content: 'I was flying over mountains',
      tags: ['flying'],
      createdAt: new Date(),
      updatedAt: new Date(),
      generatedImages: [],
      hasGeneratedImage: false
    };

    // Generate image
    const imageResult = await AIImageGenerator.generateImage(testDream, {
      style: 'realistic',
      quality: 'standard',
      version: 'free'
    });

    expect(imageResult).toBeDefined();
    expect(imageResult.url).toBeDefined();
    expect(imageResult.prompt).toContain('flying');
    expect(imageResult.style).toBe('realistic');
  });

  test('Ticket System - Award and Use Tickets', async () => {
    // Award ticket for watching ad
    const ticketAwarded = await TicketService.awardTicketForAd('test-ad-1');
    expect(ticketAwarded).toBe(true);

    // Check ticket status
    const status = await TicketService.getUserTicketStatus();
    expect(status.availableTickets).toBe(1);
    expect(status.totalTicketsEarned).toBe(1);

    // Use ticket
    const ticketUsed = await TicketService.useTicket();
    expect(ticketUsed).toBe(true);

    // Check updated status
    const updatedStatus = await TicketService.getUserTicketStatus();
    expect(updatedStatus.availableTickets).toBe(0);
    expect(updatedStatus.totalTicketsUsed).toBe(1);
  });

  test('Integrated Flow - Create Dream and Generate Image', async () => {
    // Step 1: Award ticket
    await TicketService.awardTicketForAd('test-ad');
    
    // Step 2: Create dream
    const dreamInput = {
      title: 'Integration Test Dream',
      content: 'A beautiful sunset over the ocean',
      tags: ['sunset', 'ocean']
    };
    
    const dream = await DreamStorage.saveDream(dreamInput);
    expect(dream).toBeDefined();

    // Step 3: Check available tickets
    const initialStatus = await TicketService.getUserTicketStatus();
    expect(initialStatus.availableTickets).toBe(1);

    // Step 4: Generate image (should consume ticket)
    const imageResult = await AIImageGenerator.generateImage(dream);
    expect(imageResult).toBeDefined();

    // Step 5: Add image to dream
    await DreamStorage.addImageToDream(dream.id, imageResult);

    // Step 6: Verify dream has image
    const updatedDreams = await DreamStorage.getAllDreams();
    const updatedDream = updatedDreams.find(d => d.id === dream.id);
    expect(updatedDream.generatedImages).toHaveLength(1);
    expect(updatedDream.hasGeneratedImage).toBe(true);

    // Step 7: Verify ticket was consumed
    const finalStatus = await TicketService.getUserTicketStatus();
    expect(finalStatus.availableTickets).toBe(0);
  });

  test('Error Handling - Invalid Dream Data', async () => {
    const invalidDream = {
      title: '', // Invalid: empty title
      content: 'Test content',
      tags: ['test']
    };

    await expect(DreamStorage.saveDream(invalidDream)).rejects.toThrow();
  });

  test('Ticket System - Cooldown Period', async () => {
    // Award first ticket
    const first = await TicketService.awardTicketForAd('ad-1');
    expect(first).toBe(true);

    // Try to award another ticket immediately (should fail due to cooldown)
    const second = await TicketService.awardTicketForAd('ad-2');
    expect(second).toBe(false);

    // Check status
    const status = await TicketService.getUserTicketStatus();
    expect(status.canWatchAd).toBe(false);
    expect(status.nextAdAvailableAt).toBeDefined();
  });
});

console.log('Functional tests completed successfully!');