import { Calendar, Send, CheckCircle, XCircle, Users, Loader, Pencil } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Campaign, Contact } from '../types';

interface CampaignListProps {
  campaigns: Campaign[];
}

function CampaignList({ campaigns }: CampaignListProps) {
  const [campaignStatus, setCampaignStatus] = useState<{
    [key: string]: { status: string; sent?: number; total?: number; failedContacts?: string[] };
  }>({});

  useEffect(() => {
    const today = new Date().toDateString();
    const lastOpenedDate = localStorage.getItem('lastOpenedDate');
    let storedCampaigns: Campaign[] = JSON.parse(localStorage.getItem('campaigns') || '[]');

    if (lastOpenedDate !== today) {
      // Reset statuses daily
      storedCampaigns = storedCampaigns.map((c: Campaign) => ({
        ...c,
        status: 'pending',
        sentMessages: 0,
        totalMessages: 0,
        todaysFailedMessages: [],
      }));

      localStorage.setItem('campaigns', JSON.stringify(storedCampaigns));
      localStorage.setItem('lastOpenedDate', today);
    }

    const statusMap: {
      [key: string]: { status: string; sent?: number; total?: number; failedContacts?: string[] };
    } = {};

    storedCampaigns.forEach((c: Campaign) => {
      statusMap[c.id] = {
        status: c.status,
        sent: c.sentMessages,
        total: c.totalMessages,
        failedContacts: c.todaysFailedMessages?.map((contact: Contact) => contact.number) || [],
      };
    });

    setCampaignStatus(statusMap);
  }, []);

  const handleStart = async (id: string) => {
    const campaigns = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const campaignToSend = campaigns.find((c: Campaign) => c.id === id);

    if (!campaignToSend) {
      console.error('Campaign not found');
      return;
    }

    setCampaignStatus((prev) => ({ ...prev, [id]: { status: 'sending' } }));

    try {
      const response = await fetch('http://localhost:5000/api/campaign/start-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaignToSend),
      });

      if (!response.ok) {
        throw new Error('Failed to start campaign');
      }

      const result = await response.json();
      const sentCount = result.sentCount ?? 0;
      const failedContacts = result.failedContacts ?? [];
      const totalContacts = result.totalContacts ?? 0;

      const countryCode = campaignToSend.countryCode;
      const failedPhoneNumbers = new Set(
        failedContacts.map((c: Contact) => c.number?.replace(countryCode, ''))
      );

      const updatedContacts = campaignToSend.contacts.map((contact: Contact) => ({
        ...contact,
        count: failedPhoneNumbers.has(contact.number) ? contact.count : (contact.count ?? 0) + 1,
      }));

      const updatedCampaigns = campaigns.map((c: Campaign) =>
        c.id === id
          ? {
              ...c,
              contacts: updatedContacts,
              sentMessages: sentCount,
              totalMessages: totalContacts,
              status: 'completed',
              todaysFailedMessages: failedContacts,
            }
          : c
      );

      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));

      setCampaignStatus((prev) => ({
        ...prev,
        [id]: {
          status: 'completed',
          sent: sentCount,
          total: totalContacts,
          failedContacts: failedContacts.map((fc: Contact) => fc.number),
        },
      }));
    } catch (error) {
      console.error('Error starting campaign:', error);

      const updatedCampaigns = campaigns.map((c: Campaign) =>
        c.id === id ? { ...c, status: 'failed' } : c
      );

      localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
      setCampaignStatus((prev) => ({ ...prev, [id]: { status: 'failed' } }));
    }
  };

  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <div
          key={campaign.id}
          className="border border-gray-100 rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-whatsapp-dark">{campaign.name}</h3>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-1 text-whatsapp-secondary" />
                  {campaign.contacts.length} contacts
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1 text-whatsapp-secondary" />
                  {new Date(campaign.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {!campaignStatus[campaign.id] || campaignStatus[campaign.id]?.status === 'pending' ? (
                <button
                  onClick={() => handleStart(campaign.id)}
                  className="flex items-center px-4 py-2 bg-whatsapp-primary text-white rounded-lg hover:bg-whatsapp-secondary transition-colors"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Start
                </button>
              ) : null}

              {campaignStatus[campaign.id]?.status === 'sending' && (
                <div className="flex items-center text-yellow-600">
                  <Loader className="h-5 w-5 mr-1 animate-spin" />
                  Sending...
                </div>
              )}

              {campaignStatus[campaign.id]?.status === 'completed' && (
                <div className="text-whatsapp-primary">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-1" />
                    Sent {campaignStatus[campaign.id]?.sent ?? '?'}/
                    {campaignStatus[campaign.id]?.total ?? '?'}
                  </div>
                </div>
              )}

              {campaignStatus[campaign.id]?.status === 'failed' && (
                <div className="flex items-center text-red-600">
                  <XCircle className="h-5 w-5 mr-1" />
                  Failed
                </div>
              )}

              <button
                onClick={() => window.location.href = `/navigate?id=${campaign.id}`}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Edit Campaign"
                >
                <Pencil className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      ))}

      {campaigns.length === 0 && (
        <div className="text-center py-12 text-gray-500 bg-whatsapp-light/50 rounded-xl">
          <Send className="h-12 w-12 mx-auto mb-4 text-whatsapp-secondary opacity-50" />
          <p className="text-lg">No campaigns yet. Create your first campaign to get started.</p>
        </div>
      )}
    </div>
  );
}

export default CampaignList;
