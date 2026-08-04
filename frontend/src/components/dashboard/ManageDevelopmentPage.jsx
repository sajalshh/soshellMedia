import React, { useEffect, useState } from "react";
import { Trash2, Pencil, Plus } from "lucide-react";
import usePrivateApi from "../../hooks/usePrivateApi";
import TechIcon, { TECH_ICON_OPTIONS, TECH_CATEGORIES } from "../dev/techIcons";
import LinkThumbnail from "../dev/LinkThumbnail";

const StatusMessage = ({ status, message }) => {
  if (status === "idle") return null;
  return <span className={`status-message ms-3 ${status}`}>{message}</span>;
};

/* ============================================================
   PAGE CONTENT (hero + section headings + CTA)
   ============================================================ */
const CONTENT_FIELDS = [
  { name: "badgeText", label: "Hero Badge Text", type: "text" },
  { name: "heading", label: "Hero Heading", type: "text" },
  { name: "description", label: "Hero Description", type: "textarea" },
  { name: "techSectionTitle", label: "Tech Section Title", type: "text" },
  { name: "techSectionSubtitle", label: "Tech Section Subtitle", type: "text" },
  {
    name: "showcaseSectionTitle",
    label: "Showcase Section Title",
    type: "text",
  },
  {
    name: "showcaseSectionSubtitle",
    label: "Showcase Section Subtitle",
    type: "text",
  },
  { name: "processSectionTitle", label: "Process Section Title", type: "text" },
  {
    name: "processSectionSubtitle",
    label: "Process Section Subtitle",
    type: "text",
  },
  { name: "ctaHeading", label: "CTA Heading", type: "text" },
  { name: "ctaSubheading", label: "CTA Subheading", type: "text" },
];

const DevContentForm = ({ content, onSaved }) => {
  const [form, setForm] = useState(content || {});
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const privateApi = usePrivateApi();

  useEffect(() => setForm(content || {}), [content]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaveState({ status: "loading", message: "Saving..." });
    try {
      const response = await privateApi.put("/development/content", form);
      onSaved?.(response.data.data);
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
        <h4 className="card-title">Development Page — Text Content</h4>
        <form onSubmit={handleSubmit}>
          <div className="row">
            {CONTENT_FIELDS.map((field) => (
              <div
                className={
                  field.type === "textarea" ? "col-12 mb-3" : "col-md-6 mb-3"
                }
                key={field.name}
              >
                <label className="form-label">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    className="form-control"
                    name={field.name}
                    rows="3"
                    value={form[field.name] || ""}
                    onChange={handleChange}
                  />
                ) : (
                  <input
                    type="text"
                    className="form-control"
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handleChange}
                  />
                )}
              </div>
            ))}
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

/* ============================================================
   TECHNOLOGIES
   ============================================================ */
const DevTechnologiesManager = ({ technologies, refetch }) => {
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const privateApi = usePrivateApi();

  const openModal = (tech = null) => {
    setEditing(
      tech || {
        name: "",
        iconKey: TECH_ICON_OPTIONS[0]?.key || "",
        category: "Tools",
        displayOrder: technologies.length + 1,
      },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleChange = (e) => {
    setEditing((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing._id) {
        await privateApi.put(
          `/development/technologies/${editing._id}`,
          editing,
        );
      } else {
        await privateApi.post("/development/technologies", editing);
      }
      refetch();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "Save failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this technology?")) return;
    try {
      await privateApi.delete(`/development/technologies/${id}`);
      refetch();
    } catch {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="card-title">Tech Stack Icons</h4>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={16} className="me-1" /> Add Technology
          </button>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Icon</th>
                <th>Name</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {technologies.map((tech) => (
                <tr key={tech._id}>
                  <td>{tech.displayOrder}</td>
                  <td>
                    <TechIcon iconKey={tech.iconKey} size={24} />
                  </td>
                  <td>{tech.name}</td>
                  <td>{tech.category}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => openModal(tech)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(tech._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editing && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editing._id ? "Edit Technology" : "Add Technology"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={editing.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Icon</label>
                    <div className="d-flex align-items-center gap-3">
                      <select
                        name="iconKey"
                        className="form-control"
                        value={editing.iconKey}
                        onChange={handleChange}
                        required
                      >
                        {TECH_ICON_OPTIONS.map((opt) => (
                          <option key={opt.key} value={opt.key}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div style={{ flexShrink: 0 }}>
                        <TechIcon iconKey={editing.iconKey} size={28} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      name="category"
                      className="form-control"
                      value={editing.category}
                      onChange={handleChange}
                    >
                      {TECH_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Display Order</label>
                    <input
                      type="number"
                      name="displayOrder"
                      className="form-control"
                      value={editing.displayOrder}
                      onChange={handleChange}
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
                    Save
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

/* ============================================================
   PROCESS STEPS
   ============================================================ */
const DevProcessManager = ({ process, refetch }) => {
  const [editing, setEditing] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const privateApi = usePrivateApi();

  const openModal = (step = null) => {
    setEditing(
      step || { title: "", description: "", displayOrder: process.length + 1 },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
  };

  const handleChange = (e) => {
    setEditing((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing._id) {
        await privateApi.put(`/development/process/${editing._id}`, editing);
      } else {
        await privateApi.post("/development/process", editing);
      }
      refetch();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "Save failed.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this process step?")) return;
    try {
      await privateApi.delete(`/development/process/${id}`);
      refetch();
    } catch {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="card-title">Process Steps</h4>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={16} className="me-1" /> Add Step
          </button>
        </div>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Title</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {process.map((step) => (
                <tr key={step._id}>
                  <td>{step.displayOrder}</td>
                  <td>{step.title}</td>
                  <td className="tw-max-w-[320px] tw-truncate">
                    {step.description}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => openModal(step)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(step._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editing && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editing._id ? "Edit Step" : "Add Step"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  />
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      name="title"
                      className="form-control"
                      value={editing.title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      name="description"
                      className="form-control"
                      rows="3"
                      value={editing.description}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Display Order</label>
                    <input
                      type="number"
                      name="displayOrder"
                      className="form-control"
                      value={editing.displayOrder}
                      onChange={handleChange}
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
                    Save
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

/* ============================================================
   PROJECTS (paste-a-link showcase)
   ============================================================ */
const DevProjectsManager = ({ projects, refetch }) => {
  const [editing, setEditing] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const privateApi = usePrivateApi();

  const openModal = (project = null) => {
    setThumbnailFile(null);
    setEditing(
      project
        ? { ...project, tags: (project.tags || []).join(", ") }
        : {
            title: "",
            url: "",
            description: "",
            tags: "",
            displayOrder: projects.length + 1,
            isActive: true,
          },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditing(null);
    setThumbnailFile(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditing((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(editing).forEach(([key, value]) => {
        if (key === "_id" || key === "__v" || key === "thumbnailOverride")
          return;
        formData.append(key, value);
      });
      if (thumbnailFile) {
        formData.append("thumbnailFile", thumbnailFile);
      }

      if (editing._id) {
        await privateApi.put(`/development/projects/${editing._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await privateApi.post("/development/projects", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      refetch();
      closeModal();
    } catch (error) {
      alert(error.response?.data?.message || "Save failed.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this project?")) return;
    try {
      await privateApi.delete(`/development/projects/${id}`);
      refetch();
    } catch {
      alert("Failed to delete.");
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4 className="card-title">Project Showcase</h4>
          <button className="btn btn-primary" onClick={() => openModal()}>
            <Plus size={16} className="me-1" /> Add Project
          </button>
        </div>
        <p className="tw-text-white/50 tw-text-sm tw-mb-3">
          Paste a live URL — the front-page thumbnail on the public site is
          generated automatically from that link. Upload an image below only if
          you want to override the auto-generated thumbnail.
        </p>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Preview</th>
                <th>Title</th>
                <th>URL</th>
                <th>Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project._id}>
                  <td>{project.displayOrder}</td>
                  <td style={{ width: 90 }}>
                    <div style={{ width: 72, height: 54 }}>
                      <LinkThumbnail
                        url={project.url}
                        imgSrc={project.thumbnailOverride || undefined}
                        alt={project.title}
                      />
                    </div>
                  </td>
                  <td>{project.title}</td>
                  <td className="tw-max-w-[220px] tw-truncate">
                    {project.url}
                  </td>
                  <td>{project.isActive ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() => openModal(project)}
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(project._id)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && editing && (
        <div
          className="modal show"
          style={{ display: "block", overflowY: "auto" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editing._id ? "Edit Project" : "Add Project"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  />
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-md-7">
                      <div className="mb-3">
                        <label className="form-label">Title</label>
                        <input
                          type="text"
                          name="title"
                          className="form-control"
                          value={editing.title}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Project URL</label>
                        <input
                          type="text"
                          name="url"
                          className="form-control"
                          placeholder="https://example.com"
                          value={editing.url}
                          onChange={handleChange}
                          required
                        />
                        <small className="form-text text-muted">
                          The live thumbnail preview updates automatically as
                          you type.
                        </small>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Description</label>
                        <textarea
                          name="description"
                          className="form-control"
                          rows="3"
                          value={editing.description}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Tags (comma separated)
                        </label>
                        <input
                          type="text"
                          name="tags"
                          className="form-control"
                          placeholder="Shopify, E-commerce"
                          value={editing.tags}
                          onChange={handleChange}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          Override Thumbnail (optional)
                        </label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => setThumbnailFile(e.target.files[0])}
                        />
                      </div>
                      <div className="row">
                        <div className="col-6 mb-3">
                          <label className="form-label">Display Order</label>
                          <input
                            type="number"
                            name="displayOrder"
                            className="form-control"
                            value={editing.displayOrder}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-6 mb-3 d-flex align-items-end">
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              id="isActive"
                              name="isActive"
                              checked={!!editing.isActive}
                              onChange={handleChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor="isActive"
                            >
                              Active (visible on site)
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-5">
                      <label className="form-label">Live Preview</label>
                      <div
                        style={{
                          width: "100%",
                          aspectRatio: "4 / 3",
                          borderRadius: 12,
                          overflow: "hidden",
                        }}
                      >
                        <LinkThumbnail
                          url={editing.url}
                          imgSrc={
                            thumbnailFile
                              ? URL.createObjectURL(thumbnailFile)
                              : editing.thumbnailOverride || undefined
                          }
                          alt={editing.title}
                        />
                      </div>
                    </div>
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
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save"}
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

/* ============================================================
   MAIN
   ============================================================ */
const ManageDevelopmentPage = () => {
  const [content, setContent] = useState(null);
  const [technologies, setTechnologies] = useState([]);
  const [process, setProcess] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const privateApi = usePrivateApi();

  const fetchAll = async () => {
    try {
      const response = await privateApi.get("/development");
      const data = response.data.data;
      setContent(data.content);
      setTechnologies(data.technologies || []);
      setProcess(data.process || []);
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Failed to fetch development page data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <p></p>;

  return (
    <>
      <DevContentForm content={content} onSaved={setContent} />
      <DevTechnologiesManager technologies={technologies} refetch={fetchAll} />
      <DevProcessManager process={process} refetch={fetchAll} />
      <DevProjectsManager projects={projects} refetch={fetchAll} />
    </>
  );
};

export default ManageDevelopmentPage;
