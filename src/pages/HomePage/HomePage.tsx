import { Link } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Clock } from 'lucide-react';

const features = [
  {
    name: 'Inventory Overview',
    description: 'View and manage your entire inventory efficiently',
    icon: LayoutDashboard,
    href: '/inventory',
    bgColor: 'bg-blue-50',
    iconColor: 'text-blue-600',
  },
  {
    name: 'Catalogue Overview',
    description: 'Explore your inventory in a structured format',
    icon: ListChecks,
    href: '/hierarchy',
    bgColor: 'bg-purple-50',
    iconColor: 'text-purple-600',
  },
];

const recentActivity = [
  { id: 1, name: 'Updated inventory levels', time: '2 minutes ago' },
  { id: 2, name: 'New product added', time: '1 hour ago' },
  { id: 3, name: 'Low stock alert', time: '3 hours ago' },
];

const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Welcome to <span className="text-blue-600">RetailFlow</span>
          </h1>
          <p className="mt-4 text-gray-600 text-lg sm:text-xl">
            Real-time inventory management for smarter, faster decisions.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              to="/inventory"
              className="px-6 py-3 rounded-md text-white bg-blue-600 hover:bg-blue-700 font-medium shadow"
            >
              Inventory Overview
            </Link>
            <Link
              to="/hierarchy"
              className="px-6 py-3 rounded-md text-purple-700 bg-white border border-gray-300 hover:bg-gray-100 font-medium shadow"
            >
              Catalogue Overview
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { name: 'Total Products', value: '1,234', change: '+12%', changeType: 'increase', color: 'bg-blue-100 text-blue-700' },
            { name: 'Low Stock Items', value: '24', change: '+3', changeType: 'increase', color: 'bg-yellow-100 text-yellow-700' },
            { name: 'Out of Stock', value: '5', change: '-2', changeType: 'decrease', color: 'bg-red-100 text-red-700' },
            { name: 'Categories', value: '12', change: '+2', changeType: 'increase', color: 'bg-purple-100 text-purple-700' },
          ].map((stat) => (
            <div
              key={stat.name}
              className={`p-6 rounded-lg shadow-sm ${stat.color} flex flex-col justify-between`}
            >
              <dt className="text-sm font-medium">{stat.name}</dt>
              <dd className="mt-2 text-3xl font-bold">{stat.value}</dd>
              <div className="mt-2">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  stat.changeType === 'increase' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                }`}>
                  {stat.changeType === 'increase' ? '↑' : '↓'} {stat.change} this month
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-900 mb-8">Core Features</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.name}
              to={feature.href}
              className="flex flex-col items-center bg-white p-6 rounded-lg shadow hover:shadow-md transition"
            >
              <div className={`p-4 rounded-full ${feature.bgColor} mb-4`}>
                <feature.icon className={`h-8 w-8 ${feature.iconColor}`} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-1">{feature.name}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-semibold text-gray-900 text-center lg:text-left">
            Start managing your inventory today
          </h2>
          <div className="flex gap-4 justify-center lg:justify-end">
            <Link
              to="/inventory"
              className="px-6 py-3 bg-blue-600 text-white rounded-md font-medium shadow hover:bg-blue-700 transition"
            >
              Go to Inventory
            </Link>
            <Link
              to="/hierarchy"
              className="px-6 py-3 bg-white text-purple-700 border border-gray-300 rounded-md font-medium shadow hover:bg-gray-100 transition"
            >
              Explore Catalogue
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="max-w-6xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="flex items-center px-6 py-4 hover:bg-gray-50 transition">
                <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-blue-50">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-gray-900 font-medium">{activity.name}</p>
                  <p className="text-gray-500 text-sm">{activity.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
