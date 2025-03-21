import { LeadData, StatCard } from '../types';
import { LayoutGrid, Users } from 'lucide-react';
import React from 'react';

// Initial leads data
export const initialLeads: LeadData[] = [
  {
    id: '1',
    name: 'Abstract Element',
    type: '3D Elements',
    status: 'Public',
    date: '31 July 2023',
    size: '13,423',
    companyWebsite: 'https://abstractelement.com',
    image: 'https://images.unsplash.com/photo-1633425934610-96d0ce0cdb21?w=100&h=100&fit=crop',
    recordCount: 3,
    analysis: {
      sentiment: {
        positive: 75,
        neutral: 20,
        negative: 5
      },
      topics: ['pricing', 'features'],
      score: 85,
      webPresenceScore: 30,
      relevancyScore: 45
    }
  },
  {
    id: '2',
    name: 'Abstract Minimal',
    type: 'Image',
    status: 'Private',
    date: '31 July 2023',
    size: '13,423',
    companyWebsite: 'https://abstractminimal.io',
    image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=100&h=100&fit=crop',
    recordCount: 1,
    analysis: {
      sentiment: {
        positive: 60,
        neutral: 30,
        negative: 10
      },
      topics: ['integration', 'budget'],
      score: 65,
      webPresenceScore: 25,
      relevancyScore: 20
    }
  }
];

// Dashboard stats data
export const dashboardStats: StatCard[] = [
  {
    title: 'Earning',
    value: '$198k',
    change: '+32.8% this month',
    icon: <LayoutGrid className="w-6 h-6 text-green-500" />,
    bgColor: 'bg-green-50'
  },
  {
    title: 'Balance',
    value: '$2.4k',
    change: '-2% this month',
    icon: <Users className="w-6 h-6 text-blue-500" />,
    bgColor: 'bg-blue-50'
  },
  {
    title: 'Total Sales',
    value: '$89k',
    change: '+11% this week',
    icon: <LayoutGrid className="w-6 h-6 text-pink-500" />,
    bgColor: 'bg-pink-50'
  }
];