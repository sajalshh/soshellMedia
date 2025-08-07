// src/components/dashboard/ManageProjects.jsx

import { useState, useEffect } from "react";
import usePrivateApi from "../../../hooks/usePrivateApi";

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const privateApi = usePrivateApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [saveState, setSaveState] = useState({ status: "idle", message: "" });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await privateApi.get("/homepage/projects");
        setProjects(response.data.data);
      } catch (err) {
        setSaveState({ status: "error", message: "Failed to load projects." });
      }
    };
    fetchProjects();
  }, [privateApi]);

  useEffect(() => {
    if (saveState.status === "success" || saveState.status === "error") {
      const timer = setTimeout(() => {
        if (saveState.status === "error") {
          setSaveState({ status: "idle", message: "" });
        }
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [saveState.status]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?"))
      return;
    try {
      await privateApi.delete(`/homepage/projects/${id}`);
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      setSaveState({ status: "error", message: "Failed to delete project." });
    }
  };

  const handleOpenModal = (project = null) => {
    setSelectedFile(null);
    setSaveState({ status: "idle", message: "" });
    if (project) {
      setIsEditing(true);
      setFormData(project);
    } else {
      setIsEditing(false);
      setFormData({
        title: "",
        date: "",
        description: "",
        projectLink: "",
        displayOrder: projects.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    setSaveState({ status: "loading", message: "Saving..." });
    try {
      if (isEditing) {
        const response = await privateApi.put(
          `/homepage/projects/${formData._id}`,
          data,
        );
        setProjects(
          projects.map((p) =>
            p._id === formData._id ? response.data.data : p,
          ),
        );
      } else {
        const response = await privateApi.post("/homepage/projects", data);
        setProjects([...projects, response.data.data]);
      }
      setSaveState({
        status: "success",
        message: "Project saved successfully!",
      });
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      setSaveState({ status: "error", message: "Failed to save project." });
    }
  };

  return (
    <div className="card mt-5">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="card-title">Manage Projects</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            Add New Project
          </button>
        </div>
        {saveState.status === "error" && (
          <p className="alert alert-danger mt-3">{saveState.message}</p>
        )}
        {/* --- TABLE WITH PROJECT LIST RESTORED --- */}
        <div className="table-responsive mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr key={p._id}>
                  <td>{p.displayOrder}</td>
                  <td>
                    <img
                      src={p.image}
                      alt={p.title}
                      width="50"
                      className="me-3 rounded"
                    />
                    {p.title.replace(/\|/g, " ")}
                  </td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => handleOpenModal(p)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(p._id)}
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

      {isModalOpen && (
        <div
          className="modal show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit} encType="multipart/form-data">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Edit Project" : "Add New Project"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                {/* --- MODAL BODY WITH FORM FIELDS RESTORED --- */}
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title || ""}
                      onChange={handleFormChange}
                      className="form-control"
                      required
                    />
                    <small className="form-text text-muted">
                      Use a pipe `|` for a line break in the title.
                    </small>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="text"
                      name="date"
                      value={formData.date || ""}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      value={formData.description || ""}
                      onChange={handleFormChange}
                      className="form-control"
                      rows="3"
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Project Image</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      className="form-control"
                      accept="image/*"
                    />
                    {isEditing && formData.image && (
                      <small className="form-text">
                        Current image:{" "}
                        <a
                          href={formData.image}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Display Order</label>
                    <input
                      type="number"
                      name="displayOrder"
                      value={formData.displayOrder || ""}
                      onChange={handleFormChange}
                      className="form-control"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  {saveState.status !== "idle" && (
                    <span
                      className={`status-message ${saveState.status} me-auto`}
                    >
                      {saveState.message}
                    </span>
                  )}
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={saveState.status === "loading"}
                  >
                    Cancel
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
    </div>
  );
};

export default ManageProjects;
