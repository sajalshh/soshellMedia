// src/components/dashboard/ManageServices.jsx

import React, { useState, useEffect } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

// Helper for save state messages
const StatusMessage = ({ status, message }) => {
  if (status === "idle") return null;
  return <span className={`status-message ms-3 ${status}`}>{message}</span>;
};

// Component to manage the main page content (Unchanged)
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
  const [editingService, setEditingService] = useState(null);
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
  }, []);

  const openModal = (service = null) => {
    const defaultServiceState = {
      title: "",
      subtitle: "",
      description: "",
      slug: "",
      displayOrder: services.length + 1,
      image: null,
      detailTitle: "",
      detailSubtitle: "",
      detailImage: null,
      detailPoints: "",
    };

    if (service) {
      // If editing, merge existing service data with defaults to prevent 'undefined' values
      setEditingService({
        ...defaultServiceState,
        ...service,
        detailPoints: service.detailPoints
          ? service.detailPoints.join("\n")
          : "",
      });
    } else {
      // If creating new, use the clean default state
      setEditingService(defaultServiceState);
    }
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
    for (const key in editingService) {
      if (key !== "_id" && key !== "__v" && editingService[key] !== null) {
        formData.append(key, editingService[key]);
      }
    }

    try {
      if (editingService._id) {
        await privateApi.put(
          `/services/cards/${editingService._id}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
      } else {
        await privateApi.post("/services/cards", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      setSaveState({ status: "success", message: "Service saved!" });
      fetchServices();
      closeModal();
    } catch (error) {
      console.error("Save failed:", error);
      const errorMessage = error.response?.data?.message || "Save failed.";
      setSaveState({ status: "error", message: errorMessage });
    } finally {
      setTimeout(() => setSaveState({ status: "idle", message: "" }), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await privateApi.delete(`/services/cards/${id}`);
        fetchServices();
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
      {isModalOpen && editingService && (
        <div
          className="modal show"
          style={{ display: "block", overflowY: "auto" }}
          tabIndex="-1"
        >
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
                  <h6 className="form-section-title">
                    Card Content (for /services page)
                  </h6>
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
                      rows="3"
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Card Image</label>
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
                  <hr className="my-4" />
                  <h6 className="form-section-title">Detail Page Content</h6>
                  <div className="mb-3">
                    <label className="form-label">Detail Page Title</label>
                    <input
                      type="text"
                      name="detailTitle"
                      className="form-control"
                      value={editingService.detailTitle}
                      onChange={handleFormChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Detail Page Subtitle</label>
                    <input
                      type="text"
                      name="detailSubtitle"
                      className="form-control"
                      value={editingService.detailSubtitle}
                      onChange={handleFormChange}
                    />
                    <small className="form-text text-muted">
                      You can use HTML tags like &lt;b&gt; here.
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Detail Page Points</label>
                    <textarea
                      name="detailPoints"
                      className="form-control"
                      value={editingService.detailPoints}
                      onChange={handleFormChange}
                      rows="5"
                    ></textarea>
                    <small className="form-text text-muted">
                      Each line you enter here will become a separate bullet
                      point on the page.
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Detail Page Image</label>
                    <input
                      type="file"
                      name="detailImage"
                      className="form-control"
                      onChange={handleFormChange}
                      accept="image/*"
                      required={
                        !editingService._id && !editingService.detailImage
                      }
                    />
                    {editingService._id && editingService.detailImage && (
                      <small>
                        Current:{" "}
                        <a
                          href={editingService.detailImage}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Image
                        </a>
                        . Upload new to replace.
                      </small>
                    )}
                  </div>
                  <hr className="my-4" />
                  <h6 className="form-section-title">Settings</h6>
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
                  <StatusMessage
                    status={saveState.status}
                    message={saveState.message}
                  />
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
