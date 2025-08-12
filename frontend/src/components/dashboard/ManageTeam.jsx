// src/components/dashboard/ManageTeam.jsx

import { useState, useEffect } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManageTeam = () => {
  const [team, setTeam] = useState([]);
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const privateApi = usePrivateApi();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await privateApi.get("/content/about");
        setTeam(response.data.teamMembers);
      } catch (err) {
        setSaveState({
          status: "error",
          message: "Failed to load team members.",
        });
      }
    };
    fetchTeam();
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
    if (!window.confirm("Are you sure you want to delete this team member?"))
      return;
    try {
      await privateApi.delete(`/content/team/${id}`);
      setTeam(team.filter((member) => member._id !== id));
    } catch (err) {
      setSaveState({
        status: "error",
        message: "Failed to delete team member.",
      });
    }
  };

  const handleOpenModal = (member = null) => {
    setSelectedFile(null);
    setSaveState({ status: "idle", message: "" });
    if (member) {
      setIsEditing(true);
      setFormData(member);
    } else {
      setIsEditing(false);
      setFormData({ name: "", title: "", imgSrc: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);
  const handleFormChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", formData.name);
    data.append("title", formData.title);
    if (selectedFile) {
      data.append("image", selectedFile);
    }

    setSaveState({ status: "loading", message: "Saving..." });
    try {
      if (isEditing) {
        const response = await privateApi.put(
          `/content/team/${formData._id}`,
          data,
        );
        setTeam(
          team.map((member) =>
            member._id === formData._id ? response.data.data : member,
          ),
        );
      } else {
        const response = await privateApi.post("/content/team", data);
        setTeam([...team, response.data.data]);
      }
      setSaveState({
        status: "success",
        message: "Team member saved successfully!",
      });
      setTimeout(() => handleCloseModal(), 1500);
    } catch (err) {
      setSaveState({ status: "error", message: "Failed to save team member." });
    }
  };

  return (
    <div className="card mt-5">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="card-title">Manage Team Members</h3>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            Add New Member
          </button>
        </div>
        {saveState.status === "error" && (
          <p className="alert alert-danger mt-3">{saveState.message}</p>
        )}
        <div className="table-responsive mt-3">
          <table className="table">
            <tbody>
              {team.map((member) => (
                <tr key={member._id}>
                  <td>
                    <img
                      src={member.imgSrc}
                      alt={member.name}
                      width="50"
                      className="me-3 rounded-circle"
                    />
                    {member.name}
                  </td>
                  <td>{member.title}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => handleOpenModal(member)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(member._id)}
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
                {/* ✅ This modal header is now complete */}
                <div className="modal-header">
                  <h5 className="modal-title">
                    {isEditing ? "Edit Team Member" : "Add New Team Member"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name || ""}
                      onChange={handleFormChange}
                      className="form-control"
                      required
                    />
                  </div>
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
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Profile Image</label>
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      className="form-control"
                      accept="image/*"
                    />
                    {isEditing && formData.imgSrc && (
                      <small className="form-text">
                        Current image:{" "}
                        <a
                          href={formData.imgSrc}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View
                        </a>
                      </small>
                    )}
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

export default ManageTeam;
