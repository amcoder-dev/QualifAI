import { LeadData, StatCard } from '../types';

// Initial leads data
export const initialLeads: LeadData[] = [
	{
		id: '1',
		name: 'Abstract Element',
		industry: '3D Elements',
		date: '31 July 2023',
		companyWebsite: 'https://abstractelement.com',
		image: 'https://images.unsplash.com/photo-1633425934610-96d0ce0cdb21?w=100&h=100&fit=crop',
		recordCount: 3,
		analysis: {
			sentiment: {
				positive: 75,
				neutral: 20,
				negative: 5
			},
		},
		topics: ['pricing', 'features'],
		score: 85,
		webPresenceScore: 30,
		relevancyScore: 45
	},
	{
		id: '2',
		name: 'Abstract Minimal',
		industry: 'Image',
		date: '31 July 2023',
		companyWebsite: 'https://abstractminimal.io',
		image: 'https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?w=100&h=100&fit=crop',
		recordCount: 1,
		analysis: {
			sentiment: {
				positive: 60,
				neutral: 30,
				negative: 10
			},
		},
		topics: ['integration', 'budget'],
		score: 65,
		webPresenceScore: 25,
		relevancyScore: 20,
	}
];
