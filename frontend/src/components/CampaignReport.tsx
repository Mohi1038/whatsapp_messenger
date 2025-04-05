import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, MessageSquare, Users, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Campaign } from '../types';

interface CampaignReportProps {
  campaigns: Campaign[];
  onBack: () => void;
}


function CampaignReport({ campaigns, onBack }: CampaignReportProps) {
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    const updatedCampaigns = campaigns.map((campaign) => {
      const storedStatus = localStorage.getItem(`campaign_status_${campaign.id}`);
      const storedFailedMessages = localStorage.getItem(`failed_messages_${campaign.id}`);

      return {
        ...campaign,
        status: (storedStatus === "pending" || storedStatus === "sending" || storedStatus === "completed" || storedStatus === "failed") 
                ? storedStatus 
                : campaign.status,
        todaysFailedMessages: storedFailedMessages ? JSON.parse(storedFailedMessages) : campaign.todaysFailedMessages,
      };
    });

    setLocalCampaigns(updatedCampaigns);
  }, [campaigns]);
  
  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'completed':
        return 'text-whatsapp-primary';
      case 'failed':
        return 'text-red-600';
      case 'sending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: Campaign['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5" />;
      case 'failed':
        return <XCircle className="h-5 w-5" />;
      case 'sending':
        return <Clock className="h-5 w-5 animate-spin" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <button
          onClick={() => {
            onBack(); // This calls parent’s handleBack
          }}
          className="mr-4 p-2 hover:bg-whatsapp-light rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-whatsapp-dark" />
        </button>
        <h2 className="text-xl font-semibold text-whatsapp-dark">Campaign Reports</h2>
      </div>

      <div className="space-y-6">
        {localCampaigns.map((campaign) => (
          <div key={campaign.id} className="border border-gray-100 rounded-xl p-6 space-y-4 bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-whatsapp-dark">{campaign.name}</h3>
                <div className="flex items-center mt-2 text-sm text-gray-500 space-x-4">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-whatsapp-secondary" />
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-whatsapp-secondary" />
                    {campaign.contacts.length} contacts
                  </span>
                </div>
              </div>
              <div className={`flex items-center ${getStatusColor(campaign.status)}`}>
                {getStatusIcon(campaign.status)}
                <span className="ml-2 font-medium capitalize">{campaign.status}</span>
              </div>
            </div>

            {/* Failed Messages Section */}
            <div className="bg-red-50 p-4 rounded-xl space-y-2">
              <p className="text-red-700 font-medium">Today's Failed Messages:</p>
              {campaign.todaysFailedMessages && campaign.todaysFailedMessages.length > 0 ? (
                <ul className="text-sm text-gray-600 space-y-1">
                  {campaign.todaysFailedMessages.map((contact, index) => (
                    <li key={index} className="flex justify-between border-b py-1">
                      <span>{contact.number}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500">No Failed Messages</p>
              )}
            </div>

            {/* Campaign Progress */}
            {(campaign.status === 'sending' || campaign.status === 'completed') && (
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round((campaign.sentMessages / campaign.totalMessages) * 100)}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      campaign.status === 'completed' ? 'bg-whatsapp-primary' : 'bg-whatsapp-secondary animate-pulse'
                    }`}
                    style={{ width: `${(campaign.sentMessages / campaign.totalMessages) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        ))}

        {/* No Campaigns Case */}
        {localCampaigns.length === 0 && (
          <div className="text-center py-12 bg-whatsapp-light/30 rounded-xl">
            <MessageSquare className="h-12 w-12 mx-auto mb-4 text-whatsapp-secondary opacity-50" />
            <p className="text-lg text-gray-600">No campaigns found. Create your first campaign to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CampaignReport;
