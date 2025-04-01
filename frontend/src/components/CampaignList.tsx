import { Calendar, Send, CheckCircle, XCircle } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignListProps {
  campaigns: Campaign[];
  onStart: (id: string) => void;
}

function CampaignList({ campaigns, onStart }: CampaignListProps) {
  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <div key={campaign.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">{campaign.name}</h3>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  {new Date(campaign.scheduledDate).toLocaleDateString()}
                </div>
                <div>
                  {campaign.sentMessages} / {campaign.totalMessages} messages
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {campaign.status === 'pending' && (
                <button
                  onClick={() => onStart(campaign.id)}
                  className="flex items-center px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  <Send className="h-4 w-4 mr-1" />
                  Start
                </button>
              )}
              {campaign.status === 'sending' && (
                <div className="flex items-center text-yellow-600">
                  <Send className="h-5 w-5 mr-1 animate-pulse" />
                  Sending...
                </div>
              )}
              {campaign.status === 'completed' && (
                <div className="flex items-center text-green-600">
                  <CheckCircle className="h-5 w-5 mr-1" />
                  Completed
                </div>
              )}
              {campaign.status === 'failed' && (
                <div className="flex items-center text-red-600">
                  <XCircle className="h-5 w-5 mr-1" />
                  Failed
                </div>
              )}
            </div>
          </div>
          {(campaign.status === 'sending' || campaign.status === 'completed') && (
            <div className="mt-4">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className={`h-2 rounded-full ${
                    campaign.status === 'completed' ? 'bg-green-500' : 'bg-indigo-500'
                  }`}
                  style={{
                    width: `${(campaign.sentMessages / campaign.totalMessages) * 100}%`,
                    transition: 'width 0.3s ease-in-out',
                  }}
                />
              </div>
            </div>
          )}
        </div>
      ))}
      {campaigns.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No campaigns yet. Upload a CSV file to get started.
        </div>
      )}
    </div>
  );
}

export default CampaignList;