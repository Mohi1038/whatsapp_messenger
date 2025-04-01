import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import CampaignList from './CampaignList';
import { Campaign } from '../types';

function Dashboard() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('campaigns');
    return saved ? JSON.parse(saved) : [];
  });

  const [csvContent, setCsvContent] = useState<string>(() => {
    return localStorage.getItem('csvFile') || ''; // Load stored CSV content if available
  });

  // Save campaigns to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('campaigns', JSON.stringify(campaigns));
  }, [campaigns]);

  // Save CSV content to localStorage when it changes
  useEffect(() => {
    if (csvContent) {
      localStorage.setItem('csvFile', csvContent);
    }
  }, [csvContent]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        
        // Save CSV file content to localStorage
        setCsvContent(text);
        localStorage.setItem('csvFile', text);

        // Parse CSV and create a campaign
        const rows = text
          .split('\n')
          .map(row => row.trim())
          .filter(row => row)
          .map(row => row.split(','));

        if (rows.length > 1 && rows[1].length > 0) {
          const newCampaign: Campaign = {
            id: Date.now().toString(),
            name: file.name.replace('.csv', ''),
            totalMessages: rows.length - 1,
            sentMessages: 0,
            status: 'pending',
            scheduledDate: rows[1][0] || '', // Ensure the first column exists
            createdAt: new Date().toISOString(),
          };
          setCampaigns(prev => [...prev, newCampaign]);
        }
      };
      reader.readAsText(file);
    }
  };

  const simulateSendMessages = (campaignId: string) => {
    const interval = setInterval(() => {
      setCampaigns(prev =>
        prev.map(campaign => {
          if (campaign.id === campaignId && campaign.sentMessages < campaign.totalMessages) {
            const newSentMessages = campaign.sentMessages + 1;
            return {
              ...campaign,
              sentMessages: newSentMessages,
              status: newSentMessages === campaign.totalMessages ? 'completed' : 'sending'
            };
          }
          return campaign;
        })
      );
    }, 100);

    // Cleanup interval after completion
    setTimeout(() => clearInterval(interval), 10000);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Upload New Campaign</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label htmlFor="file-upload" className="cursor-pointer bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                Choose CSV File
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">CSV format: Date, Phone Number, Message</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Your Campaigns</h2>
        <CampaignList campaigns={campaigns} onStart={simulateSendMessages} />
      </div>

      {csvContent && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Stored CSV Content</h2>
          <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-700 overflow-auto max-h-40">{csvContent}</pre>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
