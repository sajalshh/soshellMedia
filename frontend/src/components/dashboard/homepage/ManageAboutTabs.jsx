// src/components/dashboard/homepage/ManageAboutTabs.jsx

import { useState, useEffect } from "react";
import usePrivateApi from "../../../hooks/usePrivateApi";

const ManageAboutTabs = () => {
  const [tabsData, setTabsData] = useState([]);
  // 1. Replaced the simple 'message' state with our new state object
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const privateApi = usePrivateApi();

  useEffect(() => {
    const fetchTabsData = async () => {
      try {
        const response = await privateApi.get("/homepage/about-tabs");
        setTabsData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch tabs data", error);
        // Set an error state if the initial fetch fails
        setSaveState({
          status: "error",
          message: "Error: Could not load tab content.",
        });
      }
    };
    fetchTabsData();
  }, [privateApi]); // Added privateApi to the dependency array

  // 2. Added the effect to auto-clear the status message after a few seconds
  useEffect(() => {
    if (saveState.status === "success" || saveState.status === "error") {
      const timer = setTimeout(() => {
        setSaveState({ status: "idle", message: "" });
      }, 4000);
      return () => clearTimeout(timer); // Cleanup the timer
    }
  }, [saveState.status]);

  const handleTabChange = (id, field, value, listItemIndex = null) => {
    setTabsData(
      tabsData.map((tab) => {
        if (tab._id === id) {
          if (field === "listItems") {
            const updatedListItems = [...tab.listItems];
            updatedListItems[listItemIndex] = value;
            return { ...tab, listItems: updatedListItems };
          }
          return { ...tab, [field]: value };
        }
        return tab;
      }),
    );
  };

  const handleSaveChanges = async (id) => {
    const tabToSave = tabsData.find((tab) => tab._id === id);
    // 3. Updated the save handler to set loading, success, and error states
    setSaveState({ status: "loading", message: "Saving..." });
    try {
      await privateApi.put(`/homepage/about-tabs/${id}`, tabToSave);
      setSaveState({
        status: "success",
        message: "Tab content updated successfully!",
      });
    } catch (error) {
      setSaveState({
        status: "error",
        message: "Error: Could not save tab content.",
      });
    }
  };

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h3 className="card-title">Edit 'We Understand' Section Tabs</h3>
        {/* 4. Display the status message at the top of the component */}
        {saveState.status !== "idle" && (
          <div className={`alert mt-3 status-message ${saveState.status}`}>
            {saveState.message}
          </div>
        )}
        {tabsData.map((tab) => (
          <div key={tab._id} className="border p-3 rounded mb-4">
            <h5 className="mb-3">Editing Tab: {tab.tabTitle}</h5>
            {/* All the input fields remain the same */}
            <div className="mb-2">
              <label className="form-label">Tab Title</label>
              <input
                type="text"
                className="form-control"
                value={tab.tabTitle}
                onChange={(e) =>
                  handleTabChange(tab._id, "tabTitle", e.target.value)
                }
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Heading</label>
              <input
                type="text"
                className="form-control"
                value={tab.heading}
                onChange={(e) =>
                  handleTabChange(tab._id, "heading", e.target.value)
                }
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Paragraph</label>
              <textarea
                className="form-control"
                rows="3"
                value={tab.paragraph}
                onChange={(e) =>
                  handleTabChange(tab._id, "paragraph", e.target.value)
                }
              ></textarea>
            </div>
            {tab.listItems.map((item, index) => (
              <div className="mb-2" key={index}>
                <label className="form-label">List Item {index + 1}</label>
                <input
                  type="text"
                  className="form-control"
                  value={item}
                  onChange={(e) =>
                    handleTabChange(tab._id, "listItems", e.target.value, index)
                  }
                />
              </div>
            ))}

            {/* 5. Updated the button to be dynamic */}
            <button
              className="btn btn-primary mt-3"
              onClick={() => handleSaveChanges(tab._id)}
              disabled={saveState.status === "loading"}
            >
              {saveState.status === "loading"
                ? "Saving..."
                : `Save "${tab.tabTitle}" Changes`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAboutTabs;
