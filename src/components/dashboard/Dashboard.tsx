import React from "react"
import { Search, ChevronDown, LayoutGrid, Users } from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { StatCard } from "../../types"

export const Dashboard: React.FC = () => {
  const { user } = useAuth()

  const dashboardStats: StatCard[] = [
    {
      title: "Conversion Rate",
      value: "23.5%",
      change: "+1.3% this month",
      icon: <LayoutGrid className="w-6 h-6 text-green-500" />,
      bgColor: "bg-green-50",
    },
    {
      title: "Conversion Time",
      value: "5.7 business days",
      change: "-2% this month",
      icon: <Users className="w-6 h-6 text-blue-500" />,
      bgColor: "bg-blue-50",
    },
    {
      title: "Total Deals Won",
      value: "65 deals",
      change: "+23% this week",
      icon: <LayoutGrid className="w-6 h-6 text-pink-500" />,
      bgColor: "bg-pink-50",
    },
  ]

  return (
    <main className="ml-64 p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl">Welcome back, {user?.email} 👋</h2>
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mb-8">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center gap-4">
              <div className={`${stat.bgColor} p-3 rounded-full`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-semibold">{stat.value}</h3>
                <p className="text-sm text-gray-600">{stat.change}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold">Overview</h3>
              <p className="text-sm text-gray-500">Monthly Earning</p>
            </div>
            <button className="flex items-center gap-2 px-3 py-1 border rounded-lg">
              Quarterly
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
          <div className="h-64 bg-gray-50 rounded-lg"></div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div>
            <h3 className="text-lg font-semibold">Customers</h3>
            <p className="text-sm text-gray-500">Customers that buy products</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl font-bold">65%</p>
                  <p className="text-sm text-gray-500">
                    Total New
                    <br />
                    Customers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
