import React from 'react';

export type TabType = 'Templates' | 'Drafts' | 'Published';

interface TabsSectionProps {
  activeTab: TabType;
  onChangeTab: (tab: TabType) => void;
  counts: {
    Templates: number;
    Drafts: number;
    Published: number;
  };
}

export const TabsSection: React.FC<TabsSectionProps> = ({
  activeTab,
  onChangeTab,
  counts,
}) => {
  const tabs: TabType[] = ['Templates', 'Drafts', 'Published'];

  return (
    <div className="flex justify-center px-4">
      <div className="inline-flex items-center gap-1 rounded-2xl border border-[#DCE0F5] bg-[#FFFFFF] p-1.5 shadow-2xs">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onChangeTab(tab)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#AF4418] ${
                isActive
                  ? 'bg-[#AF4418] text-[#FFFFFF] font-bold shadow-xs'
                  : 'text-[#646074] hover:text-[#1E1C24] hover:bg-[#F2F3FB]'
              }`}
            >
              <span>{tab}</span>
              <span
                className={`text-xs tabular-nums px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-[#FFFFFF]/25 text-[#FFFFFF]'
                    : 'text-[#646074] bg-[#F2F3FB]'
                }`}
              >
                {counts[tab]}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
