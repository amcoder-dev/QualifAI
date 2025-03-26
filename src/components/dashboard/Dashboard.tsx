import React from "react"
import {
  Search,
  ChevronDown,
  Calendar,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle,
  ChevronRight,
  Target,
  Phone,
  Mail,
  FileCheck,
  Clock,
  PieChart,
  MapPin,
} from "lucide-react"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

export const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const navigate = useNavigate()

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
      title: "Monthly Sales",
      value: "$147,850",
      change: "+12.4% this month",
      trend: "up",
      icon: <TrendingUp className="w-6 h-6 text-white" />,
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
  ]

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
  ]

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
  ]

  // Pipeline stages (moved to revenue section)
  const pipelineStages = [
    {
      name: "Lead",
      count: 24,
      value: "$192,000",
      color: "bg-[#e7c6ff]",
      percentage: 30,
    },
    {
      name: "Qualified",
      count: 18,
      value: "$162,000",
      color: "bg-[#AA55B9]",
      percentage: 25,
    },
    {
      name: "Proposal",
      count: 12,
      value: "$138,000",
      color: "bg-[#7349AD]",
      percentage: 20,
    },
    {
      name: "Negotiation",
      count: 8,
      value: "$92,000",
      color: "bg-[#403DA1]",
      percentage: 15,
    },
    {
      name: "Closed Won",
      count: 6,
      value: "$65,000",
      color: "bg-[#40E0D0]",
      percentage: 10,
    },
  ]

  // Industry distribution data
  const industryData = [
    { industry: "Technology", count: 35, color: "bg-[#403DA1]" },
    { industry: "Healthcare", count: 22, color: "bg-[#7349AD]" },
    { industry: "Finance", count: 18, color: "bg-[#AA55B9]" },
    { industry: "Retail", count: 15, color: "bg-[#e7c6ff]" },
    { industry: "Manufacturing", count: 10, color: "bg-[#40E0D0]" },
  ]

  // Geography distribution data
  const geographyData = [
    { region: "North America", count: 42, color: "bg-[#403DA1]" },
    { region: "Europe", count: 28, color: "bg-[#7349AD]" },
    { region: "Asia Pacific", count: 20, color: "bg-[#AA55B9]" },
    { region: "Latin America", count: 6, color: "bg-[#e7c6ff]" },
    { region: "Middle East", count: 4, color: "bg-[#40E0D0]" },
  ]

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

      {/* Stats cards - KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {dashboardStats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-[1.02]"
          >
            <div className="flex items-center gap-3">
              <div className={`${stat.bgColor} p-3 rounded-xl shadow-lg`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <h3 className="text-lg font-semibold">{stat.value}</h3>
                <p
                  className={`text-xs flex items-center gap-1 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight className="w-3 h-3" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3" />
                  )}
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
        <div className="bg-white rounded-2xl lg:col-span-2 border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Latest Leads & Sales</h3>
              <button
                onClick={() => navigate("/leads")}
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
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Company
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Value
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
                      Time
                    </th>
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
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {lead.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {lead.company}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full ${lead.statusColor} mr-2`}
                          ></div>
                          <span className="text-sm">{lead.status}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium">
                        {lead.value}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">
                        {lead.time}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          className="text-gray-400 hover:text-[#403DA1]"
                          onClick={(e) => {
                            e.stopPropagation()
                            navigate(`/leads/${index + 1}`)
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
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
                <div
                  key={index}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50"
                >
                  <div className={`${activity.iconBg} p-2 rounded-lg`}>
                    {activity.icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-700">{activity.contact}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Lead Distribution Section (replacing Pipeline) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Industry Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Lead Distribution by Industry</h3>
                <p className="text-sm text-gray-500">
                  Total: 100 active leads
                </p>
              </div>
              <div className="p-2 rounded-full bg-gray-100">
                <PieChart className="w-5 h-5 text-[#403DA1]" />
              </div>
            </div>
          </div>
          <div className="p-6">
            <div className="h-64 flex items-center">
              <div className="w-1/2">
                <div className="h-48 w-48 mx-auto bg-gray-100 rounded-full flex items-center justify-center">
                  <div className="relative h-48 w-48 rounded-full overflow-hidden">
                    {/* This would be replaced with an actual pie chart */}
                    <div className="absolute inset-0" style={{ 
                      background: "conic-gradient(#403DA1 0% 35%, #7349AD 35% 57%, #AA55B9 57% 75%, #e7c6ff 75% 90%, #40E0D0 90% 100%)" 
                    }}></div>
                    <div className="absolute inset-0 flex items-center justify-center bg-white rounded-full m-12">
                      <span className="font-bold text-lg">100</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-1/2">
                <div className="space-y-3">
                  {industryData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full ${item.color} mr-3`}></div>
                        <span className="text-sm">{item.industry}</span>
                      </div>
                      <span className="font-medium">{item.count}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

{/* Geographic Distribution */}
<div className="bg-white rounded-2xl shadow-sm border border-gray-200">
  <div className="p-6 border-b border-gray-200 bg-gray-50">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">Lead Distribution by Geography</h3>
        <p className="text-sm text-gray-500">
          Total: 100 active leads
        </p>
      </div>
      <div className="p-2 rounded-full bg-gray-100">
        <MapPin className="w-5 h-5 text-[#403DA1]" />
      </div>
    </div>
  </div>
  <div className="p-6">
    <div className="flex flex-col h-64">
      <div className="h-96 bg-gray-50 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden">
        {/* Background world map image with overlay */}
        <div className="absolute inset-0 bg-[#EBF2FA] overflow-hidden">
          {/* World map with continent outlines and ocean coloring */}
          <svg width="100%" height="100%" viewBox="0 25 1000 400" preserveAspectRatio="xMidYMid slice">
            {/* Ocean background */}
            <rect x="0" y="0" width="1000" height="500" fill="#D6E9F8" />
            
            {/* Continental outlines with subtle terrain coloring */}
            {/* North America */}
            <path 
              d="M122,108 L103,99 L96,113 L72,119 L64,136 L73,153 L71,168 L80,176 L75,187 L85,206 L124,222 L162,222 L187,232 L204,228 L225,229 L235,220 L248,208 L237,187 L239,162 L231,142 L238,128 L233,110 L214,94 L196,86 L175,88 L164,80 L148,83 L130,98 L122,108Z" 
              fill="#E8EDD7" 
              stroke="black"
              strokeWidth="1"
            />
            
            {/* South America */}
            <path 
              d="M237,234 L234,251 L244,265 L242,280 L254,296 L277,317 L287,341 L281,361 L273,371 L264,379 L249,375 L236,367 L222,353 L211,329 L201,313 L207,301 L197,290 L206,276 L204,263 L221,252 L237,234Z"
              fill="#E8EDD7"
              stroke="#403DA1"
              strokeWidth="1"
            />
            
            {/* Europe */}
            <path 
              d="M458,106 L444,109 L435,102 L417,105 L406,116 L414,125 L406,134 L416,141 L439,139 L452,147 L477,149 L496,144 L512,146 L527,138 L541,139 L540,131 L527,121 L520,108 L502,102 L485,102 L471,112 L458,106Z"
              fill="#E8EDD7"
              stroke="#7349AD"
              strokeWidth="1"
            />
            
            {/* Africa */}
            <path 
              d="M459,155 L423,151 L412,158 L407,169 L420,182 L424,198 L433,210 L440,227 L453,244 L465,248 L477,254 L498,257 L510,264 L524,265 L534,257 L540,245 L547,230 L549,217 L560,203 L550,192 L549,179 L531,167 L515,168 L499,162 L484,163 L473,154 L459,155Z"
              fill="#E8EDD7"
              stroke="#e7c6ff"
              strokeWidth="1"
            />
            
            {/* Asia */}
            <path 
              d="M541,139 L557,125 L576,118 L599,106 L628,106 L651,112 L674,106 L694,115 L716,116 L740,107 L758,112 L777,124 L799,125 L808,135 L824,142 L841,143 L844,154 L853,158 L856,169 L823,177 L809,188 L799,203 L799,213 L781,208 L767,216 L742,217 L719,230 L708,226 L691,219 L672,220 L658,201 L647,189 L637,179 L627,165 L612,167 L595,173 L590,185 L583,198 L572,196 L565,187 L560,203 L549,217 L547,230 L540,245 L534,257 L524,265 L517,248 L504,236 L501,219 L489,211 L484,195 L491,182 L484,174 L493,166 L496,152 L512,146 L527,138 L541,139Z"
              fill="#E8EDD7"
              stroke="#AA55B9"
              strokeWidth="1"
            />
            
            {/* Australia */}
            <path 
              d="M825,276 L837,277 L851,285 L862,300 L879,312 L886,331 L880,346 L867,352 L850,353 L834,346 L821,334 L814,318 L819,299 L825,276Z"
              fill="#E8EDD7"
              stroke="#40E0D0"
              strokeWidth="1"
            />
            
            {/* Ocean labels */}
            <text x="280" y="200" fill="#7D9CC1" fontSize="11" fontStyle="italic">ATLANTIC OCEAN</text>
            <text x="880" y="150" fill="#7D9CC1" fontSize="11" fontStyle="italic">PACIFIC OCEAN</text>
            <text x="600" y="280" fill="#7D9CC1" fontSize="11" fontStyle="italic">INDIAN OCEAN</text>
            
            {/* Region labels */}
            <text x="88" y="160" fill="#333" fontSize="14" fontWeight="bold">NORTH AMERICA (42%)</text>
            <text x="180" y="315" fill="#333" fontSize="14" fontWeight="bold">SOUTH AMERICA (15%)</text>
            <text x="435" y="130" fill="#333" fontSize="14" fontWeight="bold">EUROPE (19%)</text>
            <text x="400" y="210" fill="#333" fontSize="14" fontWeight="bold">AFRICA (13%)</text>
            <text x="650" y="150" fill="#333" fontSize="14" fontWeight="bold">ASIA (9%)</text>
            <text x="805" y="320" fill="#333" fontSize="14" fontWeight="bold">AUSTRALIA (6%)</text>
          </svg>
        </div>
      </div>
      
      {/* Beautified standardized cards */}
      <div className="grid grid-cols-6 gap-3">
        {[
          { region: "North America", count: 38, color: "black" },
          { region: "South America", count: 15, color: "#403DA1" },
          { region: "Europe", count: 19, color: "#7349AD" },
          { region: "Asia", count: 13, color: "#AA55B9"},
          { region: "Africa", count: 9, color: "#e7c6ff" },
          { region: "Australia", count: 6, color: "#40E0D0" }
        ].map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg p-1 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100"
            style={{ borderLeftColor: item.color, borderLeftWidth: '4px' }}
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="text-xs font-medium text-gray-600">{item.region}</h4>
              <span className="text-lg opacity-80">{item.icon}</span>
            </div>
            <p className="text-medium font-bold" style={{ color: item.color }}>{item.count}%</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</div>
      </div>


      {/* Tasks and Revenue Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Tasks and Deadlines */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Tasks & Deadlines</h3>
              <button
                className="flex items-center gap-1 text-sm text-[#403DA1] font-medium hover:text-[#7349AD]"
                onClick={() => navigate("/calendar")}
              >
                <Calendar className="w-4 h-4" />
                Calendar
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {upcomingTasks.map((task, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {task.title}
                      </p>
                      <span
                        className={`${task.priorityColor} w-2 h-2 rounded-full`}
                      ></span>
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

        {/* Revenue with Pipeline (moved from above) */}
        <div className="bg-white rounded-2xl shadow-sm lg:col-span-2 border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">Revenue Pipeline</h3>
                <p className="text-sm text-gray-500">
                  Value: $649,000 • 68 deals
                </p>
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
                <div
                  key={index}
                  className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className={`w-3 h-3 rounded-full ${stage.color}`}
                    ></div>
                    <h4 className="font-medium text-sm">{stage.name}</h4>
                  </div>
                  <p className="text-xl font-bold mb-1">{stage.value}</p>
                  <p className="text-sm text-gray-500">{stage.count} deals</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Chart section */}
      <div className="bg-white p-6 rounded-xl shadow-sm mt-6 border border-gray-200">
        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
          <div>
            <h3 className="text-lg font-semibold">Overview</h3>
            <p className="text-sm text-gray-500">Monthly Revenue</p>
          </div>
          <button className="flex items-center gap-2 px-3 py-1 border rounded-lg">
            Quarterly
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
        <div className="h-72 bg-gray-50 rounded-lg flex items-center justify-center p-4">
          <div className="w-full h-full relative">
            {/* Revenue line */}
            <div className="absolute top-4 right-4 flex items-center">
              <div className="w-3 h-3 rounded-full bg-gradient-to-r from-[#7349AD] to-[#AA55B9] mr-2"></div>
              <span className="text-sm font-medium">Revenue</span>
            </div>
            
            {/* Target line */}
            <div className="absolute top-4 right-24 flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-300 mr-2"></div>
              <span className="text-sm font-medium">Target</span>
            </div>
            
            {/* Y-axis labels */}
            <div className="absolute left-0 top-0 bottom-8 w-12 flex flex-col justify-between text-xs text-gray-500">
              <div>$150k</div>
              <div>$120k</div>
              <div>$90k</div>
              <div>$60k</div>
              <div>$30k</div>
              <div>$0</div>
            </div>
            
            {/* Chart area */}
            <div className="absolute left-14 right-4 top-8 bottom-8 border-l border-b border-gray-200">
              {/* Target line */}
              <div className="absolute left-0 right-0 top-1/4 border-t border-dashed border-gray-300"></div>
              
              {/* Grid lines */}
              <div className="absolute left-0 right-0 top-1/2 border-t border-gray-100"></div>
              <div className="absolute left-0 right-0 top-3/4 border-t border-gray-100"></div>
              
              {/* Bar chart */}
              <div className="absolute bottom-0 inset-x-0 flex items-end justify-between h-full px-2">
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[45%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Jan</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$67,500</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[35%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Feb</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$52,500</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[43%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Mar</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$64,500</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[55%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Apr</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$82,500</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[65%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">May</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$97,500</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[75%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Jun</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$112,500</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[70%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Jul</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$105,000</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[80%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Aug</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$120,000</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[85%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Sep</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$127,500</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[90%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Oct</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$135,000</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[100%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Nov</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$150,000</div>
                </div>
                <div className="group relative flex flex-col items-center">
                  <div className="w-6 bg-gradient-to-b from-[#AA55B9] to-[#7349AD] h-[90%] rounded-t"></div>
                  <div className="mt-2 text-xs text-gray-500">Dec</div>
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-xs py-1 px-2 rounded whitespace-nowrap transition-opacity">$135,000</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}