import React, { useState, useEffect } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManageWorkProcess = () => {
  const [steps, setSteps] = useState([]);
  const [editingStep, setEditingStep] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const privateApi = usePrivateApi();

  const fetchSteps = async () => {
    try {
      const response = await privateApi.get("/work-process");
      setSteps(response.data.data);
    } catch (error) {
      console.error("Failed to fetch work process steps", error);
    }
  };

  useEffect(() => {
    fetchSteps();
  }, []);

  const openModal = (step = null) => {
    setEditingStep(
      step || {
        title: "",
        description: "",
        image: null,
        displayOrder: steps.length + 1,
      },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingStep(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setEditingStep((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in editingStep) {
      formData.append(key, editingStep[key]);
    }

    try {
      if (editingStep._id) {
        await privateApi.put(`/work-process/${editingStep._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await privateApi.post("/work-process", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      fetchSteps();
      closeModal();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Save failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this step?")) {
      try {
        await privateApi.delete(`/work-process/${id}`);
        fetchSteps();
      } catch (error) {
        alert("Failed to delete step.");
      }
    }
  };

  // --- CHANGE IS HERE ---
  return (
    // 👇 1. ADD THE OPENING FRAGMENT TAG HERE
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="card-title">Manage Work Process Steps</h4>
            <button className="btn btn-primary" onClick={() => openModal()}>
              Add New Step
            </button>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((step) => (
                  <tr key={step._id}>
                    <td>{step.displayOrder}</td>
                    <td>
                      <img
                        src={step.image}
                        alt={step.title}
                        style={{
                          width: "80px",
                          height: "auto",
                          borderRadius: "8px",
                        }}
                      />
                    </td>
                    <td>{step.title}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => openModal(step)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(step._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingStep._id ? "Edit Step" : "Add New Step"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label tw-text-white">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={editingStep.title}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label tw-text-white">
                      Description
                    </label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={editingStep.description}
                      onChange={handleFormChange}
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label tw-text-white">Image</label>
                    <input
                      type="file"
                      name="image"
                      className="form-control"
                      onChange={handleFormChange}
                      accept="image/*"
                      required={!editingStep._id}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label tw-text-white">Display Order</label>
                    <input
                      type="number"
                      name="displayOrder"
                      className="form-control"
                      value={editingStep.displayOrder}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={closeModal}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ManageWorkProcess;
