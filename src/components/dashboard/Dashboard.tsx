import React from "react";
import { 
  Search, 
  ChevronDown, 
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Briefcase,
  CheckCircle,
  ChevronRight,
  Target,
  Phone,
  Mail,
  FileCheck,
  Clock
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const dashboardStats = [
    {
      title: "Conversion Rate",
      value: "23.5%",
      change: "+1.3% this month",
      trend: "up",
      icon: <TrendingUp className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-r from-[#403DA1] to-[#7349AD]",
    },
    {
      title: "Conversion Time",
      value: "5.7 days",
      change: "-2% this month",
      trend: "down",
      icon: <Clock className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-r from-[#7349AD] to-[#AA55B9]",
    },
    {
      title: "Average Deal Size",
      value: "$5,430",
      change: "+8.2% this month",
      trend: "up",
      icon: <Target className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-r from-[#AA55B9] to-[#7349AD]",
    },
    {
      title: "Active Deals",
      value: "42 deals",
      change: "+5 this week",
      trend: "up",
      icon: <Briefcase className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-r from-[#7349AD] to-[#403DA1]",
    },
    {
      title: "Closed Deals",
      value: "27 deals",
      change: "+12% this month",
      trend: "up",
      icon: <CheckCircle className="w-6 h-6 text-white" />,
      bgColor: "bg-gradient-to-r from-[#403DA1] to-[#AA55B9]",
    },
  ];

  // Latest leads
  const latestLeads = [
    {
      name: "Sarah Johnson",
      company: "Acme Corporation",
      status: "New Lead",
      value: "$8,500",
      time: "10 minutes ago",
      statusColor: "bg-blue-500",
    },
    {
      name: "Michael Roberts",
      company: "Globex Inc",
      status: "Qualified",
      value: "$12,000",
      time: "1 hour ago",
      statusColor: "bg-green-500",
    },
    {
      name: "Emily Chang",
      company: "Contoso Ltd",
      status: "Proposal",
      value: "$24,750",
      time: "3 hours ago",
      statusColor: "bg-purple-500",
    },
    {
      name: "David Miller",
      company: "Oceanic Airlines",
      status: "Negotiation",
      value: "$15,800",
      time: "5 hours ago",
      statusColor: "bg-yellow-500",
    },
  ];

  // Team activity
  const teamActivities = [
    {
      user: "Jessica Davis",
      action: "Made a call",
      contact: "Thomas Wilson",
      time: "15 minutes ago",
      icon: <Phone className="w-4 h-4 text-white" />,
      iconBg: "bg-green-500",
    },
    {
      user: "Robert Martinez",
      action: "Sent email",
      contact: "Sarah Johnson",
      time: "45 minutes ago",
      icon: <Mail className="w-4 h-4 text-white" />,
      iconBg: "bg-blue-500",
    },
    {
      user: "Lisa Taylor",
      action: "Created task",
      contact: "Follow up with Acme Corp",
      time: "1 hour ago",
      icon: <FileCheck className="w-4 h-4 text-white" />,
      iconBg: "bg-[#AA55B9]",
    },
    {
      user: "John Peterson",
      action: "Closed deal",
      contact: "XYZ Enterprise",
      time: "2 hours ago",
      icon: <CheckCircle className="w-4 h-4 text-white" />,
      iconBg: "bg-[#403DA1]",
    },
  ];

  // Pipeline stages
  const pipelineStages = [
    { 
      name: "Lead", 
      count: 24, 
      value: "$192,000",
      color: "bg-[#e7c6ff]",
      percentage: 30 
    },
    { 
      name: "Qualified", 
      count: 18, 
      value: "$162,000",
      color: "bg-[#AA55B9]",
      percentage: 25 
    },
    { 
      name: "Proposal", 
      count: 12, 
      value: "$138,000",
      color: "bg-[#7349AD]",
      percentage: 20 
    },
    { 
      name: "Negotiation", 
      count: 8, 
      value: "$92,000",
      color: "bg-[#403DA1]",
      percentage: 15 
    },
    { 
      name: "Closed Won", 
      count: 6, 
      value: "$65,000",
      color: "bg-[#40E0D0]",
      percentage: 10 
    },
  ];

  // Tasks and deadlines
  const upcomingTasks = [
    {
      title: "Call with Dave Peterson",
      type: "Call",
      dueDate: "Today",
      time: "10:30 AM",
      priority: "High",
      priorityColor: "bg-red-500",
    },
    {
      title: "Send proposal to Contoso Ltd",
      type: "Email",
      dueDate: "Today",
      time: "2:00 PM",
      priority: "Medium",
      priorityColor: "bg-yellow-500",
    },
    {
      title: "Follow up with Global Tech",
      type: "Task",
      dueDate: "Tomorrow",
      time: "11:00 AM",
      priority: "Medium",
      priorityColor: "bg-yellow-500",
    },
    {
      title: "Quarterly review meeting",
      type: "Meeting",
      dueDate: "Mar 24",
      time: "3:00 PM",
      priority: "Low",
      priorityColor: "bg-green-500",
    },
  ];

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

      {/* Stats cards - KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {dashboardStats.map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]">
            <div className="flex items-center gap-3">
              <div className={`${stat.bgColor} p-3 rounded-xl shadow-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <h3 className="text-lg font-semibold">{stat.value}</h3>
                <p className={`text-xs flex items-center gap-1 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.trend === 'up' ? 
                    <ArrowUpRight className="w-3 h-3" /> :
                    <ArrowDownRight className="w-3 h-3" />}
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Latest leads and sales */}
        <div className="bg-white rounded-xl shadow-sm lg:col-span-2 border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Latest Leads & Sales</h3>
              <button 
                onClick={() => navigate('/leads')} 
                className="text-sm text-[#403DA1] font-medium hover:text-[#7349AD]"
              >
                View all
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500"></th>
                  </tr>
                </thead>
                <tbody>
                  {latestLeads.map((lead, index) => (
                    <tr 
                      key={index} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => navigate(`/leads/${index + 1}`)}
                    >
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{lead.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{lead.company}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full ${lead.statusColor} mr-2`}></div>
                          <span className="text-sm">{lead.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">{lead.value}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{lead.time}</td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          className="text-gray-400 hover:text-[#403DA1]"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/leads/${index + 1}`);
                          }}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Team Activity */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Recent Team Activity</h3>
              <button className="text-sm text-[#403DA1] font-medium hover:text-[#7349AD]">
                View all
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              {teamActivities.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className={`${activity.iconBg} p-2 rounded-lg`}>
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-semibold">{activity.user}</span> {activity.action}
                    </p>
                    <p className="text-sm text-gray-700">{activity.contact}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sales Pipeline and Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Sales Pipeline */}
        <div className="bg-white rounded-xl shadow-sm lg:col-span-2 border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Sales Pipeline</h3>
                <p className="text-sm text-gray-500">Value: $649,000 • 68 deals</p>
              </div>
              <button className="text-sm text-[#403DA1] font-medium hover:text-[#7349AD]">
                View pipeline
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex w-full h-8 mb-8 rounded-full overflow-hidden">
              {pipelineStages.map((stage, index) => (
                <div 
                  key={index}
                  className={`${stage.color} h-full`}
                  style={{ width: `${stage.percentage}%` }}
                ></div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {pipelineStages.map((stage, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-3 h-3 rounded-full ${stage.color}`}></div>
                    <h4 className="font-medium text-sm">{stage.name}</h4>
                  </div>
                  <p className="text-xl font-bold mb-1">{stage.value}</p>
                  <p className="text-sm text-gray-500">{stage.count} deals</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tasks and Deadlines */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 ">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tasks & Deadlines</h3>
              <button 
                className="flex items-center gap-1 text-sm text-[#403DA1] font-medium hover:text-[#7349AD]"
                onClick={() => navigate('/calendar')}
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">{task.title}</p>
                      <span className={`${task.priorityColor} w-2 h-2 rounded-full`}></span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                        {task.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {task.dueDate} • {task.time}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold">Overview</h3>
            <p className="text-sm text-gray-500">Monthly Earning</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1 border rounded-lg">
            Quarterly
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-gray-400">
            Revenue chart will be displayed here
          </div>
        </div>
      </div>
    </main>
  );
};