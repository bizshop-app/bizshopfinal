export interface EarlyBirdOffer {
  id: string;
  name: string;
  originalPrice: number;
  offerPrice: number;
  duration: string;
  totalSpots: number;
  spotsRemaining: number;
  validUntil: Date;
  isActive: boolean;
}

export const EARLY_BIRD_OFFER: EarlyBirdOffer = {
  id: "early_bird_2025",
  name: "Early Bird Special - First 250 Users",
  originalPrice: 5988, // 12 months × ₹499
  offerPrice: 1499,
  duration: "1 Year",
  totalSpots: 250,
  spotsRemaining: 250, // This will be updated dynamically from database
  validUntil: new Date("2025-12-31"),
  isActive: true
};

export function calculateSavings(): number {
  return EARLY_BIRD_OFFER.originalPrice - EARLY_BIRD_OFFER.offerPrice;
}

export function isOfferValid(): boolean {
  return EARLY_BIRD_OFFER.isActive && 
         EARLY_BIRD_OFFER.spotsRemaining > 0 && 
         new Date() < EARLY_BIRD_OFFER.validUntil;
}

export function getOfferExpiryDate(): string {
  return EARLY_BIRD_OFFER.validUntil.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}