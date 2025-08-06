import React from "react";
import { ChevronRight, X } from "lucide-react";
import { stepActions } from "@/lib/data/mockData";
import ActionButton from "../ui/ActionButton";

export default function BackfillingYears({ 
  yearlyData, 
  index,
}) {
  const [selectedStatus, setSelectedStatus] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);

  // Group years by status
  const groupedYears = yearlyData.reduce((acc, yearData) => {
    const status = yearData.status;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(yearData);
    return acc;
  }, {});

  const getStatusConfig = (status) => {
    switch (status) {
      case "success":
        return {
          color: "bg-green-100 text-green-800 border-green-200",
          icon: "✓"
        };
      case "in_progress":
        return {
          color: "bg-yellow-100 text-yellow-800 border-yellow-200",
          icon: "⏳"
        };
      case "failed":
        return {
          color: "bg-red-100 text-red-800 border-red-200",
          icon: "✗"
        };
      case "skipped":
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "⏭"
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 border-gray-200",
          icon: "?"
        };
    }
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStatus(null);
  };

  // Get years for selected status
  const selectedYears = selectedStatus ? groupedYears[selectedStatus] || [] : [];

  return (
    <>
      <div className="border-t border-gray-200 pt-2">
        <div className="text-xs font-medium text-gray-600 mb-2">
          Years ({yearlyData.length} total)
        </div>
        
        {/* Status Badges */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(groupedYears).map(([status, years]) => {
            const config = getStatusConfig(status);
            return (
              <button
                key={status}
                onClick={() => handleStatusClick(status)}
                className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium hover:shadow-sm transition-all duration-200 ${config.color}`}
                title={`${years.length} years ${status}`}
              >
                <span className="font-bold">{years.length}</span>
                <ChevronRight size={12} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${getStatusConfig(selectedStatus).color}`}>
                  {getStatusConfig(selectedStatus).icon} {selectedStatus} ({selectedYears.length})
                </span>
              </div>
              <button
                onClick={closeModal}
                className="inline-flex items-center p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
              >
                <X size={16} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              <div className="space-y-2">
                {selectedYears.map((yearData) => (
                  <div
                    key={yearData.year}
                    className="flex items-center justify-between p-3 rounded-lg border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900">{yearData.year}</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        yearData.status === "success"
                          ? "text-green-600 bg-green-100"
                          : yearData.status === "in_progress"
                          ? "text-yellow-600 bg-yellow-100"
                          : yearData.status === "failed"
                          ? "text-red-600 bg-red-100"
                          : "text-gray-600 bg-gray-100"
                      }`}>
                        {yearData.status}
                      </span>
                    </div>
                    
                    {stepActions[index].yearLevelActions && stepActions[index].yearLevelActions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-2">
                        {stepActions[index].yearLevelActions.map((action, idx) => (
                          <ActionButton key={idx} icon={action.icon} onClick={action.onClick} title={action.title} />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
} 