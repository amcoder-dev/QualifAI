import React from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

const RevenueChart = () => {
  // Mock data for monthly revenue
  const mockData = [
    { month: 'Jan', revenue: 67500, target: 75000 },
    { month: 'Feb', revenue: 52500, target: 75000 },
    { month: 'Mar', revenue: 64500, target: 75000 },
    { month: 'Apr', revenue: 82500, target: 90000 },
    { month: 'May', revenue: 97500, target: 90000 },
    { month: 'Jun', revenue: 112500, target: 90000 },
    { month: 'Jul', revenue: 105000, target: 120000 },
    { month: 'Aug', revenue: 120000, target: 120000 },
    { month: 'Sep', revenue: 127500, target: 120000 },
    { month: 'Oct', revenue: 135000, target: 140000 },
    { month: 'Nov', revenue: 150000, target: 140000 },
    { month: 'Dec', revenue: 135000, target: 140000 },
  ]

  // Calculate average target for reference line
  const averageTarget = mockData.reduce((sum, item) => sum + item.target, 0) / mockData.length

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm mt-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-lg font-semibold">Overview</h3>
          <p className="text-sm text-gray-500">Monthly Revenue</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#AA55B9]"></div>
            <span className="text-sm">Revenue</span>
          </div>
          <div className="flex items-center gap-2">
          <div className="w-3 h-3 border border-gray-400 rounded-full bg-[#403DA1]"></div>
            <span className="text-sm">Target</span>
          </div>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={mockData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              domain={[0, 180000]}
              ticks={[0, 45000, 90000, 135000, 180000]}
              tickFormatter={(value) => `$${value / 1000}k`}
              tick={{ fill: '#666', fontSize: 12 }}
            />
            <Tooltip 
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
              labelStyle={{ color: '#333' }}
              contentStyle={{ 
                backgroundColor: 'white', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            />
            
            {/* Average target reference line */}
            <ReferenceLine 
              y={averageTarget} 
              stroke="#403DA1" 
              strokeDasharray="3 3"
              strokeWidth={1.5}
              label={{ 
                value: `Avg Target: $106k`, 
                fill: '#6b7280', 
                fontSize: 12,
                position: 'right'
              }}
            />
            
            <Bar 
              dataKey="revenue" 
              fill="url(#revenueGradient)" 
              radius={[4, 4, 0, 0]} 
              barSize={30} 
            />
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#AA55B9" />
                <stop offset="100%" stopColor="#7349AD" />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default RevenueChart