// src/components/dashboard/ManageSeo.jsx
import { useState, useEffect } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManageSeo = () => {
  const privateApi = usePrivateApi();
  const [seoData, setSeoData] = useState([]);
  const [saveState, setSaveState] = useState({ status: "idle", message: "" });
  const [savingId, setSavingId] = useState(null);

  useEffect(() => {
    const fetchSeoData = async () => {
      try {
        const response = await privateApi.get("/seo/all");
        setSeoData(response.data.data);
      } catch (error) {
        console.error("Failed to fetch SEO data", error);
        setSaveState({
          status: "error",
          message: "Error: Could not load SEO data.",
        });
      }
    };
    fetchSeoData();
  }, [privateApi]);

  useEffect(() => {
    if (saveState.status === "success" || saveState.status === "error") {
      const timer = setTimeout(() => {
        setSaveState({ status: "idle", message: "" });
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [saveState.status]);

  const handleChange = (id, field, value) => {
    setSeoData(
      seoData.map((data) =>
        data._id === id ? { ...data, [field]: value } : data,
      ),
    );
  };

  const handleSaveChanges = async (id) => {
    const dataToSave = seoData.find((data) => data._id === id);
    setSaveState({ status: "loading", message: "Saving..." });
    setSavingId(id);

    try {
      // Send the object as-is — backend will normalize keywords whether it's a string or array
      await privateApi.put(`/seo/${id}`, dataToSave);
      setSaveState({
        status: "success",
        message: `SEO for ${dataToSave.pageUrl} updated successfully!`,
      });
    } catch (error) {
      console.error(error);
      setSaveState({
        status: "error",
        message: "Error: Could not save SEO data.",
      });
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="card manage-seo-card">
      <div className="card-body">
        <h4 className="card-title">Manage Page SEO</h4>
        {saveState.status !== "idle" && (
          <div className={`alert mt-3 status-message ${saveState.status}`}>
            {saveState.message}
          </div>
        )}

        {seoData.map((data) => (
          <div key={data._id} className="seo-entry border p-3 rounded mb-4">
            <h5 className="mb-3 seo-header">
              Page: <code>{data.pageUrl}</code>
            </h5>

            <div className="mb-3 form-group">
              <label className="form-label">Title Tag</label>
              <input
                type="text"
                className="form-control"
                value={data.title || ""}
                onChange={(e) =>
                  handleChange(data._id, "title", e.target.value)
                }
              />
            </div>

            <div className="mb-3 form-group">
              <label className="form-label">Meta Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={data.metaDescription || ""}
                onChange={(e) =>
                  handleChange(data._id, "metaDescription", e.target.value)
                }
              />
            </div>

            <hr />
            <h6 className="mt-3 seo-section-subtitle">
              Social Media / Open Graph
            </h6>

            <div className="mb-3 form-group">
              <label className="form-label">Social Title</label>
              <input
                type="text"
                className="form-control"
                value={data.ogTitle || ""}
                onChange={(e) =>
                  handleChange(data._id, "ogTitle", e.target.value)
                }
              />
            </div>

            <div className="mb-3 form-group">
              <label className="form-label">Social Description</label>
              <textarea
                className="form-control"
                rows="2"
                value={data.ogDescription || ""}
                onChange={(e) =>
                  handleChange(data._id, "ogDescription", e.target.value)
                }
              />
            </div>

            <div className="mb-3 form-group">
              <label className="form-label">Social Image URL</label>
              <input
                type="text"
                className="form-control"
                value={data.ogImage || ""}
                onChange={(e) =>
                  handleChange(data._id, "ogImage", e.target.value)
                }
              />
            </div>

            {/* ---------------- Keywords input ---------------- */}
            <div className="mb-3 form-group">
              <label className="form-label">Keywords (comma-separated)</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. marketing, seo, content"
                value={
                  Array.isArray(data.keywords)
                    ? data.keywords.join(", ")
                    : data.keywords || ""
                }
                onChange={(e) =>
                  handleChange(data._id, "keywords", e.target.value)
                }
              />
              <small className="form-text text-muted">
                Enter comma-separated keywords. They will be normalized on save.
              </small>
            </div>

            <button
              className="btn btn-primary mt-2"
              onClick={() => handleSaveChanges(data._id)}
              disabled={saveState.status === "loading" && savingId === data._id}
            >
              {saveState.status === "loading" && savingId === data._id
                ? "Saving..."
                : `Save SEO for ${data.pageUrl}`}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageSeo;
