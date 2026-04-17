export type AssetType = 'gold' | 'real-estate';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  image: string;
  tokenPrice: number;
  totalSupply: number;
  expectedReturn: number;
  location?: string;
  fundedPercentage: number;
  status: 'Live' | 'Upcoming';
  isFeatured?: boolean;
}

export const mockAssets: Asset[] = [
  {
    id: "gold-res-alpha",
    name: "Gold Reserve Alpha",
    type: "gold",
    image: "https://images.unsplash.com/photo-1610375461246-83df859d849d?q=80&w=800&auto=format&fit=crop",
    tokenPrice: 5800,
    totalSupply: 1000000,
    expectedReturn: 8.5,
    fundedPercentage: 100,
    status: "Live",
    isFeatured: true
  },
  {
    id: "bullion-vault-x",
    name: "Bullion Vault X",
    type: "gold",
    image: "https://images.unsplash.com/photo-1579726242953-adbc52f53d86?q=80&w=800&auto=format&fit=crop",
    tokenPrice: 6200,
    totalSupply: 500000,
    expectedReturn: 7.2,
    fundedPercentage: 85,
    status: "Live"
  },
  {
    id: "dubai-marina-tower",
    name: "Dubai Marina Tower",
    type: "real-estate",
    image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=800&auto=format&fit=crop",
    tokenPrice: 12000,
    totalSupply: 50000,
    expectedReturn: 12.5,
    location: "Dubai, UAE",
    fundedPercentage: 42,
    status: "Live",
    isFeatured: true
  },
  {
    id: "goa-beachfront",
    name: "Goa Beachfront Villa",
    type: "real-estate",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=800&auto=format&fit=crop",
    tokenPrice: 8500,
    totalSupply: 20000,
    expectedReturn: 14.2,
    location: "Goa, India",
    fundedPercentage: 0,
    status: "Upcoming"
  },
  {
    id: "london-canary",
    name: "London Canary Wharf Office",
    type: "real-estate",
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=800&auto=format&fit=crop",
    tokenPrice: 15000,
    totalSupply: 100000,
    expectedReturn: 9.8,
    location: "London, UK",
    fundedPercentage: 88,
    status: "Live"
  },
  {
    id: "mumbai-sea-link",
    name: "Mumbai Sea-Link Residences",
    type: "real-estate",
    image: "https://images.unsplash.com/photo-1566371131105-09c00b0f4492?q=80&w=800&auto=format&fit=crop",
    tokenPrice: 9500,
    totalSupply: 75000,
    expectedReturn: 11.5,
    location: "Mumbai, India",
    fundedPercentage: 65,
    status: "Live"
  }
];
