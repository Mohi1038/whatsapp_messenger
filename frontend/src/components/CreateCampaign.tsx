import React, { useState } from 'react';
import { ArrowLeft, Plus, Upload, Trash2 } from 'lucide-react';
import { Campaign, Contact, CountryCode, CampaignDetails } from '../types';
import CampaignDetailsForm from './CampaignDetails';

interface CreateCampaignProps {
  onSave: (campaign: Campaign) => void;
  onCancel: () => void;
}

const countryCodes: CountryCode[] = [
  { code: 'US', name: 'United States', dialCode: '+1' },
  { code: 'GB', name: 'United Kingdom', dialCode: '+44' },
  { code: 'IN', name: 'India', dialCode: '+91' },
  // Add more country codes as needed
];

function CreateCampaign({ onSave, onCancel }: CreateCampaignProps) {
  const [step, setStep] = useState(1);
  const [campaignName, setCampaignName] = useState('');
  const [countryCode, setCountryCode] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [newContact, setNewContact] = useState<Contact>({ name: '', number: '', count: 1 });
  const [addMethod, setAddMethod] = useState<'manual' | 'csv' | null>(null);
  const [campaignDetails, setCampaignDetails] = useState<CampaignDetails | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split('\n').map(row => row.split(','));
        const newContacts: Contact[] = rows.slice(1).map(row => ({
          name: row[0]?.trim() || '',
          number: row[1]?.trim() || '',
          count: 1 // Ensure every contact starts with count = 1
        })).filter(contact => contact.name && contact.number);
        setContacts(prev => [...prev, ...newContacts]);
      };
      reader.readAsText(file);
    }
  };  

  const handleAddContact = () => {
    if (newContact.name && newContact.number) {
      setContacts(prev => [...prev, { ...newContact, count: 1 }]); // Ensure count is 1
      setNewContact({ name: '', number: '', count: 1 });
    }
  };

  const handleRemoveContact = (index: number) => {
    setContacts(contacts.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    if (!campaignDetails) return;
    
    const campaign: Campaign = {
      id: Date.now().toString(),
      name: campaignName,
      countryCode,
      contacts,
      totalMessages: contacts.length,
      sentMessages: 0,
      status: 'pending',
      createdAt: new Date().toISOString(),
      details: campaignDetails
    };
    onSave(campaign);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent"
                placeholder="Enter campaign name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Country Code
              </label>
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="block w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent"
              >
                <option value="">Select country code</option>
                {countryCodes.map((country) => (
                  <option key={country.code} value={country.dialCode}>
                    {country.name} ({country.dialCode})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!campaignName || !countryCode}
              className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-whatsapp-primary hover:bg-whatsapp-secondary transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-whatsapp-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            {!addMethod ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  onClick={() => setAddMethod('manual')}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-whatsapp-primary hover:bg-whatsapp-light/50 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <Plus className="h-8 w-8 text-whatsapp-primary" />
                    <span className="mt-2 text-sm font-medium text-gray-900">
                      Add Contacts Manually
                    </span>
                  </div>
                </div>

                <div
                  onClick={() => setAddMethod('csv')}
                  className="border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-whatsapp-primary hover:bg-whatsapp-light/50 transition-colors"
                >
                  <div className="flex flex-col items-center">
                    <Upload className="h-8 w-8 text-whatsapp-primary" />
                    <span className="mt-2 text-sm font-medium text-gray-900">
                      Upload CSV File
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {addMethod === 'manual' ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <input
                        type="text"
                        value={newContact.name}
                        onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                        placeholder="Contact name"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent"
                      />
                      <input
                        type="text"
                        value={newContact.number}
                        onChange={(e) => setNewContact({ ...newContact, number: e.target.value })}
                        placeholder="Phone number"
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-whatsapp-primary focus:border-transparent"
                      />
                    </div>
                    <button
                      onClick={handleAddContact}
                      className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-whatsapp-primary hover:bg-whatsapp-secondary transition-colors"
                    >
                      Add Contact
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8">
                    <div className="text-center">
                      <Upload className="mx-auto h-12 w-12 text-whatsapp-primary" />
                      <div className="mt-4">
                        <label htmlFor="file-upload" className="cursor-pointer bg-whatsapp-primary text-white px-6 py-3 rounded-lg hover:bg-whatsapp-secondary transition-colors inline-block">
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
                      <p className="mt-2 text-sm text-gray-500">CSV format: Name, Phone Number</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setAddMethod(null)}
                  className="w-full py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  Choose Different Method
                </button>
              </>
            )}

            {contacts.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium mb-4">Contact List ({contacts.length})</h3>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                  {contacts.map((contact, index) => (
                    <div key={index} className="flex items-center justify-between bg-whatsapp-light/30 p-4 rounded-lg">
                      <div>
                        <p className="font-medium text-whatsapp-dark">{contact.name}</p>
                        <p className="text-sm text-gray-600">{contact.number}</p>
                      </div>
                      <button
                        onClick={() => handleRemoveContact(index)}
                        className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {contacts.length > 0 && (
              <button
                onClick={() => setStep(3)}
                className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-whatsapp-primary hover:bg-whatsapp-secondary transition-colors"
              >
                Next: Add Campaign Details
              </button>
            )}
          </div>
        );

      case 3:
        return (
          <CampaignDetailsForm
            onSave={(details) => {
              setCampaignDetails(details);
              handleSave();
            }}
            onBack={() => setStep(2)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-white/20">
      <div className="flex items-center mb-6">
        <button
          onClick={step === 1 ? onCancel : () => setStep(step - 1)}
          className="mr-4 p-2 hover:bg-whatsapp-light rounded-full transition-colors"
        >
          <ArrowLeft className="h-6 w-6 text-whatsapp-dark" />
        </button>
        <h2 className="text-xl font-semibold text-whatsapp-dark">
          {step === 1 && 'Create New Campaign'}
          {step === 2 && 'Add Contacts'}
          {step === 3 && 'Campaign Details'}
        </h2>
      </div>

      {renderStep()}
    </div>
  );
}

export default CreateCampaign;