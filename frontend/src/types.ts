  export interface Contact {
    name: string;
    number: string;
    count: number;
  }

  export interface CampaignDetails {
    scheduledDate: string;
    messageTemplate: { day: string; message: string }[]; // Array of objects
  }

  export interface Campaign {
    id: string;
    name: string;
    countryCode: string;
    contacts: Contact[];
    totalMessages: number;
    sentMessages: number;
    status: 'pending' | 'sending' | 'completed' | 'failed';
    createdAt: string;
    details?: CampaignDetails; // Added details
    todaysFailedMessages?: Contact[]; // Ensure it's an array of objects instead of strings
  }

  export interface CountryCode {
    code: string;
    name: string;
    dialCode: string;
  }
