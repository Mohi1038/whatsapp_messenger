import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Campaign, Contact } from '../types';
import { XCircle, ArrowLeftCircle} from 'lucide-react';

const EditCampaignForm: React.FC = () => {
  const [searchParams] = useSearchParams();
  const campaignId = searchParams.get('id');
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    const campaigns: Campaign[] = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const found = campaigns.find(c => c.id === campaignId);
    if (found) {
      setCampaign(found);
      setName(found.name);
      setContacts(found.contacts);
      setDescription(found.details?.messageTemplate?.[0]?.message || '');
      setStartDate(found.details?.scheduledDate || '');
    }
  }, [campaignId]);

  const handleContactChange = (index: number, field: keyof Contact, value: string) => {
    const updated = [...contacts];
    updated[index] = { ...updated[index], [field]: value };
    setContacts(updated);
  };

  const handleAddContact = () => {
    setContacts([...contacts, { name: '', number: '', count: 1 }]);
  };

  const handleRemoveContact = (index: number) => {
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign) return;

    const updatedCampaign: Campaign = {
      ...campaign,
      name,
      contacts,
      details: {
        ...campaign.details,
        scheduledDate: startDate,
        messageTemplate: [{ day: 'Day 1', message: description }],
      },
    };

    const campaigns: Campaign[] = JSON.parse(localStorage.getItem('campaigns') || '[]');
    const updatedCampaigns = campaigns.map(c => (c.id === campaign.id ? updatedCampaign : c));
    localStorage.setItem('campaigns', JSON.stringify(updatedCampaigns));
    alert('Campaign updated successfully.');
  };

  if (!campaign) return <div className="text-center py-10">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow">
      <h1 className="text-xl font-semibold mb-4">Edit Campaign</h1>
      <button
            onClick={() => (window.location.href = '/')}
            className="flex items-center text-sm text-gray-600 hover:text-whatsapp-primary"
          >
            <ArrowLeftCircle className="h-5 w-5 mr-1" />
            Back to Dashboard
      </button>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Campaign Name</label>
          <input
            type="text"
            className="w-full border p-2 rounded"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Contacts</label>
          {contacts.map((contact, index) => (
            <div key={index} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                className="flex-1 border p-2 rounded"
                value={contact.name}
                onChange={(e) => handleContactChange(index, 'name', e.target.value)}
              />
              <input
                type="text"
                placeholder="Number"
                className="flex-1 border p-2 rounded"
                value={contact.number}
                onChange={(e) => handleContactChange(index, 'number', e.target.value)}
              />
              <button
                type="button"
                onClick={() => handleRemoveContact(index)}
                className="text-red-500 text-sm"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddContact}
            className="text-blue-600 text-sm mt-2"
          >
            + Add Contact
          </button>
        </div>

        <button
          onClick={() => window.location.href = `/`}
          type="submit"
          className="bg-whatsapp-primary text-white px-4 py-2 rounded hover:bg-whatsapp-secondary"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditCampaignForm;
