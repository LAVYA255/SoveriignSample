"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
 type TimeRange = '1D' | '1W' | '1M' | '1Y' | 'ALL';

export default function PriceChart({ active }: { active: TimeRange }) {
  const chartDataMap: Record<TimeRange, { name: string; price: number }[]> = {
  '1D': [
    { name: '9AM', price: 5400 },
    { name: '12PM', price: 5500 },
    { name: '3PM', price: 5450 },
  ],
  '1W': [
    { name: 'Mon', price: 5400 },
    { name: 'Tue', price: 5450 },
    { name: 'Wed', price: 5600 },
    { name: 'Thu', price: 5550 },
    { name: 'Fri', price: 5800 },
  ],
  '1M': [
    { name: 'Week1', price: 5300 },
    { name: 'Week2', price: 5500 },
    { name: 'Week3', price: 5700 },
    { name: 'Week4', price: 5900 },
  ],
  '1Y': [
    { name: 'Jan', price: 5400 },
    { name: 'Feb', price: 5450 },
    { name: 'Mar', price: 5600 },
    { name: 'Apr', price: 5500 },
    { name: 'May', price: 5700 },
    { name: 'Jun', price: 5800 },
  ],
  'ALL': [
    { name: '2020', price: 4000 },
    { name: '2021', price: 4800 },
    { name: '2022', price: 5200 },
    { name: '2023', price: 6000 },
  ]
};
const data = chartDataMap[active];


 
  return (
    <div className="h-64 w-full text-xs">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
          <XAxis dataKey="name" stroke="#666" tick={{ fill: '#666' }} axisLine={false} tickLine={false} />
          <YAxis stroke="#666" tick={{ fill: '#666' }} axisLine={false} tickLine={false} domain={['dataMin - 100', 'auto']} tickFormatter={(value) => `₹${value}`} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#181818', borderColor: 'rgba(255,255,255,0.1)', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#D4AF37' }}
            formatter={(value: any) => [`₹${value}`, 'Price']}
          />
          <Line type="monotone" dataKey="price" stroke="#D4AF37" strokeWidth={2} dot={{ r: 4, fill: '#0A0A0A', stroke: '#D4AF37', strokeWidth: 2 }} activeDot={{ r: 6, fill: '#D4AF37' }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
