import { useState } from 'react';
import { Plus, List } from 'lucide-react';
import CampaignList from './CampaignList';
import CreateCampaign from './CreateCampaign';
import { Campaign } from '../types';
import CampaignReport from './CampaignReport';

function Dashboard() {
  const [showCreateCampaign, setShowCreateCampaign] = useState(false);
  const [showReports, setShowReports] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => {
    const saved = localStorage.getItem('campaigns');
    return saved ? JSON.parse(saved) : [];
  });

  const handleCreateCampaign = (campaign: Campaign) => {
    const updatedCampaigns = [...campaigns, campaign];
    setCampaigns(updatedCampaigns);
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    setShowCreateCampaign(false);
  };  

  if (showCreateCampaign) {
    return <CreateCampaign onSave={handleCreateCampaign} onCancel={() => setShowCreateCampaign(false)} />;
  }

  if (showReports) {
    return (
      <CampaignReport 
        campaigns={campaigns} 
        onBack={() => setShowReports(false)}
      />
    );
  }
    
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div 
          onClick={() => setShowCreateCampaign(true)}
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:bg-whatsapp-light border border-white/20"
        >
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="bg-whatsapp-primary/10 p-4 rounded-full">
              <Plus className="h-8 w-8 text-whatsapp-primary" />
            </div>
            <h2 className="text-xl font-semibold text-whatsapp-dark">Create Campaign</h2>
            <p className="text-gray-600 text-center">
              Start a new campaign by adding contacts and messages
            </p>
          </div>
        </div>

        <div 
          onClick={() => {
            const stored = localStorage.getItem('campaigns');
            const parsed = stored ? JSON.parse(stored) : [];
            setCampaigns(parsed); // Optional: keep dashboard in sync
            setShowReports(true);
          }}          
          className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 cursor-pointer transform transition-all hover:scale-105 hover:bg-whatsapp-light border border-white/20"
        >
          <div className="flex flex-col items-center justify-center h-full space-y-4">
            <div className="bg-whatsapp-primary/10 p-4 rounded-full">
              <List className="h-8 w-8 text-whatsapp-primary" />
            </div>
            <h2 className="text-xl font-semibold text-whatsapp-dark">Campaign Reports</h2>
            <p className="text-gray-600 text-center">
              View and manage your existing campaigns
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
        <h2 className="text-xl font-semibold mb-4 text-whatsapp-dark">Your Campaigns</h2>
        <CampaignList campaigns={campaigns}/>
      </div>
    </div>
  );
}

export default Dashboard;