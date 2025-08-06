import React from "react";
import { X, Webhook, RotateCcw, RefreshCw, Clock, Activity } from "lucide-react";
import { formatDateTime, getStatusTextColor, getRelativeTime, getTooltipText } from "@/lib/utils/formatters";

export default function WebhookModal({ 
  isOpen, 
  onClose, 
  step, 
  accountId, 
  webhookData, 
  onRetrigger 
}) {
  if (!isOpen || !step) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Webhook className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Webhook Details
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {step.name}
                {accountId && ` - ${accountId}`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 p-2 rounded-lg hover:bg-gray-100"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Webhook Status */}
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusTextColor(step.status)}`}>
                  Status: {step.status}
                </span>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  <span 
                    className="cursor-help"
                    title={getTooltipText(step.timestamp)}
                  >
                    {getRelativeTime(step.timestamp)}
                  </span>
                </div>
              </div>
              <button
                onClick={() => onRetrigger(step.id, accountId)}
                className="inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
              >
                <RotateCcw size={16} className="mr-2" />
                Retrigger Webhook
              </button>
            </div>

            {/* Webhook URL and Method */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Webhook URL
                </label>
                <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono text-gray-800 break-all border border-gray-200">
                  {webhookData.url}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Method
                </label>
                <div className="bg-gray-50 p-4 rounded-lg text-sm font-mono text-gray-800 border border-gray-200">
                  {webhookData.method}
                </div>
              </div>
            </div>

            {/* Request Headers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Headers
              </label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="text-xs text-gray-800 overflow-x-auto">
                  {JSON.stringify(webhookData.headers, null, 2)}
                </pre>
              </div>
            </div>

            {/* Request Body */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Request Body
              </label>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <pre className="text-xs text-gray-800 overflow-x-auto">
                  {JSON.stringify(webhookData.request, null, 2)}
                </pre>
              </div>
            </div>

            {/* Response */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">
                  Response
                </label>
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                  webhookData.response.status >= 200 && webhookData.response.status < 300
                    ? "text-green-600 bg-green-100"
                    : webhookData.response.status >= 400
                    ? "text-red-600 bg-red-100"
                    : "text-yellow-600 bg-yellow-100"
                }`}>
                  {webhookData.response.status}
                </span>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="mb-3">
                  <div className="text-xs font-medium text-gray-600 mb-1">Headers:</div>
                  <pre className="text-xs text-gray-800 overflow-x-auto">
                    {JSON.stringify(webhookData.response.headers, null, 2)}
                  </pre>
                </div>
                <div>
                  <div className="text-xs font-medium text-gray-600 mb-1">Body:</div>
                  <pre className="text-xs text-gray-800 overflow-x-auto">
                    {JSON.stringify(webhookData.response.body, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Response Time */}
            <div className="text-xs text-gray-500">
              Response received at:{" "}
              <span 
                className="cursor-help"
                title={getTooltipText(webhookData.response.timestamp)}
              >
                {getRelativeTime(webhookData.response.timestamp)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 