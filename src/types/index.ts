// Types for BeautyBeaute.fr pSEO Platform

export interface Service {
  id: string;
  name: string;
  slug: string;
  seoKeyword: string;
  heroImage: string;
  description: string;
  icon: string;
}

export interface City {
  name: string;
  slug: string;
  zip: string;
  department_name: string;
  department_code: string;
  region: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  population: number;
}

export interface GeneratedContent {
  h1: string;
  metaTitle: string;
  metaDescription: string;
  introduction: string;
  whyChooseCity: string;
}

export interface Centre {
  id: string;
  name: string;
  address: string;
  rating: number;
  reviewCount: number;
  verified: boolean;
  phone?: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface NearbyCity extends City {
  distance: number;
}
