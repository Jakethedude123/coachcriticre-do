import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Recent Activity | CoachCritic',
  description: 'Stay updated with the latest reviews and activities.',
}

export default function RecentActivityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Recent Activity</h1>
      <p className="text-gray-600 mb-4">Coming soon.</p>
    </div>
  )
} 