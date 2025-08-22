// src/components/dashboard/ManageServices.jsx

import React, { useState, useEffect } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

// Helper for save state messages
const StatusMessage = ({ status, message }) => {
  if (status === "idle") return null;
  return <span className={`status-message ms-3 ${status}`}>{message}</span>;
};

// Component to manage the main page content
const ManagePageContent = () => {
  const [content, setContent] = useState({
    breadcrumbHeading: "",
    breadcrumbDescription: "",
    sectionTitle: "",
    sectionSubtitle: "",
  });
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const privateApi = usePrivateApi();

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await privateApi.get("/services/content");
        if (response.data.data) {
          setContent(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch page content", error);
      }
    };
    fetchContent();
  }, [privateApi]);

  const handleChange = (e) => {
    setContent({ ...content, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveState({ status: "loading", message: "Saving..." });
    try {
      await privateApi.put("/services/content", content);
      setSaveState({ status: "success", message: "Content saved!" });
    } catch (error) {
      setSaveState({ status: "error", message: "Failed to save." });
    } finally {
      setTimeout(() => setSaveState({ status: "idle", message: "" }), 3000);
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <h4 className="card-title">Manage Service Page Main Content</h4>
        <form onSubmit={handleSubmit}>
          {/* Form fields for page content */}
          <div className="mb-3">
            <label className="form-label">Breadcrumb Heading</label>
            <input
              type="text"
              className="form-control"
              name="breadcrumbHeading"
              value={content.breadcrumbHeading}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Breadcrumb Description</label>
            <textarea
              className="form-control"
              name="breadcrumbDescription"
              value={content.breadcrumbDescription}
              onChange={handleChange}
              rows="3"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Section Title</label>
            <input
              type="text"
              className="form-control"
              name="sectionTitle"
              value={content.sectionTitle}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Section Subtitle</label>
            <input
              type="text"
              className="form-control"
              name="sectionSubtitle"
              value={content.sectionSubtitle}
              onChange={handleChange}
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={saveState.status === "loading"}
          >
            {saveState.status === "loading" ? "Saving..." : "Save Content"}
          </button>
          <StatusMessage
            status={saveState.status}
            message={saveState.message}
          />
        </form>
      </div>
    </div>
  );
};

// Main component to manage service cards
const ManageServices = () => {
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null); // null for new, or service object for editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });

  const privateApi = usePrivateApi();

  const fetchServices = async () => {
    try {
      const response = await privateApi.get("/services/cards");
      setServices(response.data.data);
    } catch (error) {
      console.error("Failed to fetch services", error);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []); // ESlint will complain, but we only want to fetch once on mount.

  const openModal = (service = null) => {
    setEditingService(
      service || {
        title: "",
        subtitle: "",
        description: "",
        slug: "",
        displayOrder: 0,
        image: null,
      },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    setEditingService((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaveState({ status: "loading", message: "Saving..." });

    const formData = new FormData();
    Object.keys(editingService).forEach((key) => {
      if (key !== "_id" && key !== "__v") {
        // Don't append mongo internals
        formData.append(key, editingService[key]);
      }
    });

    try {
      if (editingService._id) {
        // Update existing
        await privateApi.put(
          `/services/cards/${editingService._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } else {
        // Create new
        await privateApi.post("/services/cards", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setSaveState({ status: "success", message: "Service saved!" });
      fetchServices(); // Re-fetch to show the latest data
      closeModal();
    } catch (error) {
      setSaveState({ status: "error", message: "Save failed." });
    } finally {
      setTimeout(() => setSaveState({ status: "idle", message: "" }), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await privateApi.delete(`/services/cards/${id}`);
        fetchServices(); // Re-fetch
      } catch (error) {
        alert("Failed to delete service.");
      }
    }
  };

  return (
    <>
      <ManagePageContent />

      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="card-title">Manage Service Cards</h4>
            <button className="btn btn-primary" onClick={() => openModal()}>
              Add New Service
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
                {services.map((service) => (
                  <tr key={service._id}>
                    <td>{service.displayOrder}</td>
                    <td>
                      <img
                        src={service.image}
                        alt={service.title}
                        style={{ width: "100px", height: "auto" }}
                      />
                    </td>
                    <td>{service.title}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => openModal(service)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(service._id)}
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

      {/* Bootstrap Modal for Add/Edit */}
      {isModalOpen && (
        <div className="modal show" style={{ display: "block" }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingService._id ? "Edit Service" : "Add New Service"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  {/* Form fields */}
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={editingService.title}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Subtitle</label>
                    <input
                      type="text"
                      name="subtitle"
                      className="form-control"
                      value={editingService.subtitle}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      value={editingService.description}
                      onChange={handleFormChange}
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">
                      URL Slug (e.g., 'videography')
                    </label>
                    <input
                      type="text"
                      name="slug"
                      className="form-control"
                      value={editingService.slug}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Display Order</label>
                    <input
                      type="number"
                      name="displayOrder"
                      className="form-control"
                      value={editingService.displayOrder}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Image</label>
                    <input
                      type="file"
                      name="image"
                      className="form-control"
                      onChange={handleFormChange}
                      accept="image/*"
                      required={!editingService._id}
                    />
                    {editingService._id && editingService.image && (
                      <small>
                        Current:{" "}
                        <a
                          href={editingService.image}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Image
                        </a>
                        . Upload new to replace.
                      </small>
                    )}
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
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saveState.status === "loading"}
                  >
                    {saveState.status === "loading"
                      ? "Saving..."
                      : "Save Changes"}
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

export default ManageServices;
