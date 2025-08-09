// src/components/dashboard/ManageServiceCards.jsx

import { useState, useEffect } from "react";
import useAxiosPrivate from "../../../hooks/usePrivateApi";

const ManageServiceCards = () => {
  const [cards, setCards] = useState([]);
  const [message, setMessage] = useState("");
  // 1. New state to manage a separate file input for each card
  const [fileInputs, setFileInputs] = useState({});
  const privateApi = useAxiosPrivate();

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await privateApi.get("/homepage/service-cards");
        setCards(response.data.data);
      } catch (error) {
        console.error("Failed to fetch service cards", error);
      }
    };
    fetchCards();
  }, []);

  const handleChange = (cardId, field, value, descIndex = null) => {
    setCards(cards.map((card) => {
      if (card._id === cardId) {
        if (field === "description") {
          const updatedDesc = [...card.description];
          updatedDesc[descIndex].text = value; 
          return { ...card, description: updatedDesc };
        }
        return { ...card, [field]: value };
      }
      return card;
    }));
  };
  
  // 2. New handler for file input changes
  const handleFileChange = (cardId, file) => {
    setFileInputs(prev => ({ ...prev, [cardId]: file }));
  };

  const handleSaveChanges = async (cardId) => {
    const cardToSave = cards.find((card) => card._id === cardId);
    setMessage("Saving...");
    
    // 3. Use FormData to send both text and the image file
    const formData = new FormData();
    formData.append('title', cardToSave.title);
    formData.append('floatingTitle', cardToSave.floatingTitle);
    formData.append('floatingSub', cardToSave.floatingSub);
    // When sending a nested array with FormData, it's best to stringify it
    formData.append('description', JSON.stringify(cardToSave.description));
    
    // Append the new file if one was selected for this specific card
    if (fileInputs[cardId]) {
        formData.append('image', fileInputs[cardId]);
    }

    try {
      const response = await privateApi.put(`/homepage/service-cards/${cardId}`, formData);
      // Update local state with the returned data to show the new image instantly
      setCards(cards.map(c => c._id === cardId ? response.data.data : c));
      setFileInputs(prev => ({ ...prev, [cardId]: null })); // Clear the selected file
      setMessage("Card updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Error: Could not save card.");
    }
  };

  return (
    <div className="card mt-5">
      <div className="card-body">
        <h3 className="card-title">Edit Service Cards</h3>
        {message && <div className="alert alert-info">{message}</div>}
        {cards.map((card) => (
          <div key={card._id} className="border p-3 rounded mb-4">
            <h5 className="mb-3">Editing Card: {card.title}</h5>
            <div className="mb-2">
              <label className="form-label">Card Title</label>
              <input
                type="text"
                className="form-control"
                value={card.title}
                onChange={(e) => handleChange(card._id, "title", e.target.value)}
              />
            </div>
            {card.description.map((desc, index) => (
              <div className="mb-2" key={index}>
                <label className="form-label">{desc.heading}</label>
                <input
                  type="text"
                  className="form-control"
                  value={desc.text}
                  onChange={(e) => handleChange(card._id, "description", e.target.value, index)}
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
                  onChange={(e) => handleChange(card._id, "floatingTitle", e.target.value)}
                />
              </div>
              <div className="col-md-6 mb-2">
                <label className="form-label">Floating Subtitle</label>
                <input
                  type="text"
                  className="form-control"
                  value={card.floatingSub}
                  onChange={(e) => handleChange(card._id, "floatingSub", e.target.value)}
                />
              </div>
            </div>

            {/* 4. Add the new file input and image preview */}
            <div className="mb-2 mt-2">
                <label className="form-label">Card Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={(e) => handleFileChange(card._id, e.target.files[0])} 
                />
                <small className="form-text">Current Image:</small><br/>
                <img src={card.image} alt="preview" style={{ width: '100px', marginTop: '10px', borderRadius: '5px' }} />
            </div>

            <button
              className="btn btn-primary mt-3"
              onClick={() => handleSaveChanges(card._id)}
            >
              Save "{card.title}"
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageServiceCards;