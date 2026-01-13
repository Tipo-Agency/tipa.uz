import React from 'react';

export type Language = 'ru' | 'uz' | 'en';

export interface LocalizedString {
  ru: string;
  uz: string;
  en: string;
}

export interface Service {
  id: string;
  title: LocalizedString;
  shortDescription: LocalizedString;
  icon: React.ReactNode;
  accentColor: string;
  // Detail page data
  audience: LocalizedString[]; // Array of localized strings
  businessProblems: LocalizedString[];
  types: LocalizedString[];
  included: LocalizedString[];
  process: { step: LocalizedString; description: LocalizedString }[];
  result: LocalizedString;
  ctaText: LocalizedString;
}

export interface CaseStudy {
  id: string;
  slug: string; // For SEO friendly URLs
  client: string;
  title: LocalizedString;
  shortDescription: LocalizedString; // For the card
  tags: LocalizedString[];
  
  // Detailed content
  heroImage: string;
  galleryImages?: string[]; // Array of additional images
  
  challenge: LocalizedString;
  solution: LocalizedString;
  results: {
    value: string;
    label: LocalizedString;
  }[];
  
  technologies?: string[];
  year?: string;
  websiteLink?: string;
}

export interface NewsItem {
  id: string;
  date: string;
  title: LocalizedString;
  excerpt: LocalizedString;
  image: string;
  tag: string;
}

export interface NavItem {
  label: LocalizedString;
  path: string;
}

export enum RoutePath {
  HOME = '/',
  SERVICES = '/services',
  SERVICE_DETAIL = '/services/:id',
  CASES = '/cases',
  CASE_DETAIL = '/cases/:id',
  NEWS = '/news',
  ABOUT = '/about',
  CONTACT = '/contact',
}