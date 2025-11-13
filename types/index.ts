// File: types/index.ts
// Purpose: Define all TypeScript types for the project

// ========================
// CATEGORY TYPES
// ========================
// Type defines category types - now dynamic (can be any string)

export type CategoryType = string;

// ========================
// CATEGORY INTERFACE
// ========================
// Interface defines the structure of a Category object
// Each category has: id, name, icon, color, description

export interface Category {
  id: CategoryType;                       // ID of category (must be one of 5 types above)
  name: string;                           // Display name (e.g., "Lifestyle", "Health & Wellness")
  icon: string;                           // Icon image path (e.g., "/icons/lifestyle.svg")
  color: string;                          // Tailwind color class (e.g., "bg-purple-500")
  description?: string;                   // Short description of category
}

// ========================
// TOP10 ITEM INTERFACE
// ========================
// Interface defines the structure of an item in 10rating list
// Each item has full information: title, rating, price, features, etc.

export interface Top10Item {
  id: number;                             // Unique ID of item (1, 2, 3, ...)
  rank: number;                           // Ranking in top 10 (1-10)
  title: string;                          // Product/service title (e.g., "NordVPN - Best VPN")
  description: string;                    // Short description (summary)
  detailedDescription?: string;           // Long detailed review/description - Optional
  image: string;                          // Thumbnail image path (e.g., "/10rating/1.jpg")
  rating?: number;                        // Rating score 0-5 (e.g., 4.8) - Optional
  price?: string;                         // Price as text (e.g., "$9.99/month", "Free") - Optional
  features?: string[];                    // Array of key features - Optional
  pros?: string[];                        // Array of advantages - Optional
  cons?: string[];                        // Array of disadvantages - Optional
  category?: CategoryType;                // Which category it belongs to - Optional
  affiliateLink: string;                  // Affiliate link to earn commission
  featured?: boolean;                     // Featured item or not (true = has "Featured" badge) - Optional
}

// ========================
// SEO METADATA INTERFACE
// ========================
// Interface defines metadata for SEO
// Used for <head> tags, Open Graph, Twitter Cards

export interface SEOData {
  title: string;                          // Title tag (e.g., "Top 10 VPN Services 2025")
  description: string;                    // Meta description (e.g., "Compare the best VPN services...")
  keywords?: string[];                    // Meta keywords (e.g., ["vpn", "security", "privacy"]) - Optional
  ogImage?: string;                       // Open Graph image - Optional (e.g., "/og-image.jpg")
  canonical?: string;                     // Canonical URL - Optional (e.g., "https://10rating.com/vpn")
}
