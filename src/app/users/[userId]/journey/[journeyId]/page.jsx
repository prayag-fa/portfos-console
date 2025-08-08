"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import Link from 'next/link';
import { mockJourneyTimeline, stepActions } from "@/lib/data/mockData";
import JourneySummary from "@/components/journeys/JourneySummary";
import AccountsOverview from "@/components/journeys/AccountsOverview";
import TimelineStep from "@/components/timeline/TimelineStep";
import WebhookModal from "@/components/ui/WebhookModal";
import { getWebhookData } from "@/lib/services/webhookService";

export default function JourneyTimelinePage({ params }) {
  const { userId, journeyId } = params;
  
  const [webhookModal, setWebhookModal] = React.useState({
    show: false,
    step: null,
    accountId: null,
  });

  const journey = mockJourneyTimeline[userId][parseInt(journeyId) - 1];

  if (!journey) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Journey Not Found</h1>
          <p className="text-gray-600 mb-6">The requested journey could not be found.</p>
          <Link
            href={`/users/${userId}`}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Journeys
          </Link>
        </div>
      </div>
    );
  }

  const closeWebhookModal = () => {
    setWebhookModal({ show: false, step: null, accountId: null });
  };

  const openWebhookModal = (step, accountId = null) => {
    setWebhookModal({ show: true, step, accountId });
  };

  const handleRetriggerWebhook = (accountId, year = null) => {
    console.log("Retrigger webhook for account:", accountId, year);
    // In a real application, this would make an API call
  };

  const handleRetriggerDataFetch = (accountId, year = null) => {
    console.log("Retrigger data fetch for account:", accountId, year);
    // In a real application, this would make an API call
  };

  return (
    <div className="space-y-4">
      <JourneySummary journey={journey} />
      <AccountsOverview accounts={journey.accounts} />

      {/* Timeline */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Journey Timeline</h3>
        <div className="relative">
          {journey.timeline.map((step, index) => (
            <TimelineStep
              key={stepActions[index].name}
              step={step}
              index={index}
              totalSteps={journey.timeline.length}
              accounts={journey.accounts}
              name={stepActions[index].name}
              stepAction={stepActions[index]}
            />
          ))}
        </div>
      </div>

      <WebhookModal
        isOpen={webhookModal.show}
        onClose={closeWebhookModal}
        step={webhookModal.step}
        accountId={webhookModal.accountId}
        webhookData={webhookModal.step ? getWebhookData(webhookModal.step, webhookModal.accountId, userId) : null}
        onRetrigger={handleRetriggerWebhook}
      />
    </div>
  );
} 