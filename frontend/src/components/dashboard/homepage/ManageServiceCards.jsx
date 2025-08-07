// src/components/dashboard/homepage/ManageServiceCards.jsx

import { useState, useEffect } from "react";
import usePrivateApi from "../../../hooks/usePrivateApi";

const ManageServiceCards = () => {
  const [cards, setCards] = useState([]);
  // 1. Replaced the simple 'message' state with our new state object
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const privateApi = usePrivateApi();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await privateApi.get("/homepage/service-cards");
        setCards(response.data.data);
      } catch (error) {
        console.error("Failed to fetch service cards", error);
        // Set an error state if the initial fetch fails
        setSaveState({
          status: "error",
          message: "Error: Could not load service cards.",
        });
      }
    };
    fetchCards();
  }, [privateApi]); // Added privateApi dependency

  // 2. Added the effect to auto-clear the status message
  useEffect(() => {
    if (saveState.status === "success" || saveState.status === "error") {
      const timer = setTimeout(() => {
        setSaveState({ status: "idle", message: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [saveState.status]);

  const handleChange = (cardId, field, value, descIndex = null) => {
    setCards(
      cards.map((card) => {
        if (card._id === cardId) {
          if (field === "description") {
            const updatedDesc = [...card.description];
            updatedDesc[descIndex].text = value; // Only updating text for simplicity
            return { ...card, description: updatedDesc };
          }
          return { ...card, [field]: value };
        }
        return card;
      }),
    );
  };

  const handleSaveChanges = async (cardId) => {
    const cardToSave = cards.find((card) => card._id === cardId);
    // 3. Updated the save handler to set loading, success, and error states
    setSaveState({ status: "loading", message: "Saving..." });
    try {
      await privateApi.put(`/homepage/service-cards/${cardId}`, cardToSave);
      setSaveState({
        status: "success",
        message: "Card updated successfully!",
      });
    } catch (error) {
      setSaveState({ status: "error", message: "Error: Could not save card." });
    }
  };

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h3 className="card-title">Edit Service Cards</h3>
        {/* 4. Display the status message at the top of the component */}
        {saveState.status !== "idle" && (
          <div className={`alert mt-3 status-message ${saveState.status}`}>
            {saveState.message}
          </div>
        )}
        {cards.map((card) => (
          <div key={card._id} className="border p-3 rounded mb-4">
            <h5 className="mb-3">Editing Card: {card.title}</h5>
            {/* All input fields remain the same */}
            <div className="mb-2">
              <label className="form-label">Card Title</label>
              <input
                type="text"
                className="form-control"
                value={card.title}
                onChange={(e) =>
                  handleChange(card._id, "title", e.target.value)
                }
              />
            </div>
            {card.description.map((desc, index) => (
              <div className="mb-2" key={index}>
                <label className="form-label">{desc.heading}</label>
                <input
                  type="text"
                  className="form-control"
                  value={desc.text}
                  onChange={(e) =>
                    handleChange(card._id, "description", e.target.value, index)
                  }
                />
              </div>
            ))}
            <div className="row mt-2">
              <div className="col-md-6 mb-2">
                <label className="form-label">Floating Title</label>
                <input
                  type="text"
                  className="form-control"
                  value={card.floatingTitle}
                  onChange={(e) =>
                    handleChange(card._id, "floatingTitle", e.target.value)
                  }
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Floating Subtitle</label>
                <input
                  type="text"
                  className="form-control"
                  value={card.floatingSub}
                  onChange={(e) =>
                    handleChange(card._id, "floatingSub", e.target.value)
                  }
                />
              </div>
            </div>

            {/* 5. Updated the button to be dynamic */}
            <button
              className="btn btn-primary mt-3"
              onClick={() => handleSaveChanges(card._id)}
              disabled={saveState.status === "loading"}
            >
              {saveState.status === "loading"
                ? "Saving..."
                : `Save "${card.title}"`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageServiceCards;
