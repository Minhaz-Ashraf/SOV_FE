import React, { useState } from "react";

const TabBarTwo = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].name); // Initialize with the first tab

  const handleTabClick = (tabName) => {
    setActiveTab(tabName);
  };
  return (
    <div>
      {/* Tab Bar */}

      <div className="flex  pl-[19.5%]">
        {tabs.map((tab) =>
          tab?.props?.profileView === "/admin/approvals" ||
          tab?.props?.profileView === "/admin/applications-review" ? null : (
            <button
              key={tab.name}
              onClick={() => handleTabClick(tab.name)}
              className={`py-2 md:px-4 sm:px-2 focus:outline-none ${
                activeTab === tab.name
                  ? "border-b-2 border-primary"
                  : "text-gray-500"
              }`}
            >
              {tab.label}
            </button>
          )
        )}
      </div>

      {/* Render Active Tab Component */}
      <>
        {tabs.map((tab) => (
          <div
            className={`${
              tab?.props?.profileView === "/admin/approvals" ||
              tab?.props?.profileView === "/admin/applications-review"
                ? " mx-44 "
                : " mr-6 mt-6 md:ml-[19%] sm:ml-[17.5%]"
            }  `}
          >
            {activeTab === tab.name ? (
              <tab.component key={tab.name} {...tab.props}   />     
            ) : null}
          </div>
        ))}
      </>
    </div>
  );
};

export default TabBarTwo;