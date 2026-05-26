import React, { useState, useEffect } from 'react';
import { Heart, LogOut, User, Home, Bell, FileText, CheckCircle, Clock, Calendar, MapPin, Phone, TrendingUp, Award } from 'lucide-react';

export default function UserDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock user data
  const user = {
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@email.com',
    userType: 'both',
    avatar: 'SJ'
  };

  // Mock applications data
  const applications = [
    {
      id: 1,
      orphanageName: 'Hope Children Home',
      orphanageCity: 'Colombo',
      status: 'in_progress',
      currentStage: 'Background Check',
      completedStages: 3,
      totalStages: 7,
      uploadedDocuments: 7,
      totalDocuments: 8,
      progress: 43,
      initiatedDate: '2025-01-15'
    },
    {
      id: 2,
      orphanageName: 'Sunshine Orphanage',
      orphanageCity: 'Kandy',
      status: 'documents_submitted',
      currentStage: 'Document Verification',
      completedStages: 2,
      totalStages: 7,
      uploadedDocuments: 8,
      totalDocuments: 8,
      progress: 29,
      initiatedDate: '2025-02-01'
    }
  ];

  // Mock sponsorships data
  const sponsorships = [
    {
      id: 1,
      orphanageName: 'Little Angels Home',
      category: 'monetary',
      amount: 5000,
      date: '2025-03-10',
      status: 'delivered'
    },
    {
      id: 2,
      orphanageName: 'Hope Children Home',
      category: 'books',
      amount: null,
      date: '2025-03-05',
      status: 'confirmed'
    }
  ];

  // Stats
  const stats = {
    totalDonations: 12,
    totalAmount: 45000,
    activeApplications: 2,
    helpedOrphanages: 5
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-teal-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-white" fill="white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-teal-500 rounded-full border-2 border-white"></div>
              </div>
              <span className="text-2xl font-bold">
                <span className="text-teal-600">Little</span>
                <span className="text-orange-500">Bridge</span>
              </span>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="relative p-2 hover:bg-teal-50 rounded-full transition">
                <Bell className="h-6 w-6 text-teal-700" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Menu */}
              <div className="flex items-center space-x-3 px-4 py-2 bg-teal-50 rounded-full">
                <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold">{user.avatar}</span>
                </div>
                <span className="font-medium text-teal-800">{user.firstName}</span>
              </div>

              {/* Logout */}
              <button className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-full hover:from-red-600 hover:to-red-700 transition font-semibold flex items-center space-x-2 shadow-md">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8 bg-gradient-to-r from-teal-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {user.firstName}! 👋
            </h1>
            <p className="text-teal-100 text-lg">
              Your journey of making a difference continues here
            </p>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-teal-400 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-300 rounded-full opacity-20 blur-3xl"></div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-teal-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center">
                <Heart className="h-7 w-7 text-white" fill="white" />
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-teal-800 mb-1">{stats.totalDonations}</div>
            <div className="text-sm text-gray-600">Total Donations</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-teal-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center">
                <Home className="h-7 w-7 text-white" />
              </div>
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-3xl font-bold text-teal-800 mb-1">LKR {stats.totalAmount.toLocaleString()}</div>
            <div className="text-sm text-gray-600">Amount Donated</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-teal-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center">
                <FileText className="h-7 w-7 text-white" />
              </div>
              <Clock className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-3xl font-bold text-teal-800 mb-1">{stats.activeApplications}</div>
            <div className="text-sm text-gray-600">Active Applications</div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-md border-2 border-teal-100 hover:shadow-xl transition">
            <div className="flex items-center justify-between mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center">
                <Award className="h-7 w-7 text-white" />
              </div>
              <Heart className="h-6 w-6 text-pink-500" />
            </div>
            <div className="text-3xl font-bold text-teal-800 mb-1">{stats.helpedOrphanages}</div>
            <div className="text-sm text-gray-600">Orphanages Helped</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-md p-2 mb-6 border-2 border-teal-100">
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-teal-50'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('applications')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === 'applications'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-teal-50'
              }`}
            >
              My Applications
            </button>
            <button
              onClick={() => setActiveTab('sponsorships')}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition ${
                activeTab === 'sponsorships'
                  ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-teal-50'
              }`}
            >
              My Donations
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-3xl p-8 text-white shadow-xl">
              <Home className="h-12 w-12 mb-4" />
              <h2 className="text-3xl font-bold mb-3">Start Adoption Journey</h2>
              <p className="mb-6 text-yellow-50">
                Find orphanages near you and begin your adoption process with confidence
              </p>
              <button className="px-8 py-3.5 bg-white text-yellow-600 rounded-full hover:bg-yellow-50 transition font-bold shadow-lg">
                Find Orphanages
              </button>
            </div>

            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl">
              <Heart className="h-12 w-12 mb-4" fill="white" />
              <h2 className="text-3xl font-bold mb-3">Make a Donation</h2>
              <p className="mb-6 text-teal-50">
                Support children's homes with your generous contribution today
              </p>
              <button className="px-8 py-3.5 bg-white text-teal-600 rounded-full hover:bg-teal-50 transition font-bold shadow-lg">
                Donate Now
              </button>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
          <div className="space-y-6">
            {applications.map((app) => (
              <div
                key={app.id}
                className="bg-white rounded-2xl shadow-md border-2 border-teal-100 overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-teal-800 mb-1">
                        {app.orphanageName}
                      </h3>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{app.orphanageCity}</span>
                      </div>
                    </div>
                    <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                      {app.currentStage}
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span className="font-medium">Overall Progress</span>
                      <span className="font-bold text-teal-700">{app.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-gradient-to-r from-teal-500 to-teal-600 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${app.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-teal-50 rounded-xl p-4 text-center">
                      <div className="text-xs text-teal-600 mb-1">Documents</div>
                      <div className="text-2xl font-bold text-teal-800">
                        {app.uploadedDocuments}/{app.totalDocuments}
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="text-xs text-blue-600 mb-1">Stages</div>
                      <div className="text-2xl font-bold text-blue-800">
                        {app.completedStages}/{app.totalStages}
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-xl p-4 text-center">
                      <div className="text-xs text-yellow-600 mb-1">Started</div>
                      <div className="text-sm font-bold text-yellow-800">
                        {new Date(app.initiatedDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <button className="w-full py-3 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl hover:from-teal-600 hover:to-teal-700 transition font-semibold shadow-md">
                    View Details & Timeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'sponsorships' && (
          <div className="space-y-4">
            {sponsorships.map((donation) => (
              <div
                key={donation.id}
                className="bg-white rounded-2xl shadow-md border-2 border-teal-100 p-6 hover:shadow-xl transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-pink-500 rounded-xl flex items-center justify-center">
                      <Heart className="h-7 w-7 text-white" fill="white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-teal-800">
                        {donation.orphanageName}
                      </h3>
                      <div className="flex items-center space-x-3 text-sm text-gray-600 mt-1">
                        <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full font-medium capitalize">
                          {donation.category}
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(donation.date).toLocaleDateString()}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    {donation.amount && (
                      <div className="text-2xl font-bold text-teal-800 mb-1">
                        LKR {donation.amount.toLocaleString()}
                      </div>
                    )}
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                      donation.status === 'delivered'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {donation.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}