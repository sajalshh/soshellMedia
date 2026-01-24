import { useEffect, useState } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManageAboutPage = () => {
  const privateApi = usePrivateApi();

  const [formData, setFormData] = useState({
    headingPrefix: "",
    headingHighlight: "",
    subHeading: "",
    paragraphs: [""],
  });

  const [saveState, setSaveState] = useState({ status: "idle", message: "" });

  // ==========================
  // Fetch existing About data
  // ==========================
  useEffect(() => {
    const fetchAbout = async () => {
      try {
        // NOTE: you can change this endpoint if you decide to keep /content/about
        const response = await privateApi.get("/about");

        setFormData({
          headingPrefix: response.data.headingPrefix || "",
          headingHighlight: response.data.headingHighlight || "",
          subHeading: response.data.subHeading || "",
          paragraphs:
            response.data.paragraphs && response.data.paragraphs.length > 0
              ? response.data.paragraphs
              : [""],
        });
      } catch (err) {
        console.error("Failed to load About Page content:", err);
        setSaveState({
          status: "error",
          message: "Failed to load About Page content.",
        });
      }
    };

    fetchAbout();
  }, [privateApi]);

  // auto clear error after few seconds (same pattern as your other pages)
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

  // ==========================
  // Handlers
  // ==========================
  const handleInputChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleParagraphChange = (index, value) => {
    setFormData((prev) => {
      const updated = [...prev.paragraphs];
      updated[index] = value;
      return { ...prev, paragraphs: updated };
    });
  };

  const handleAddParagraph = () => {
    setFormData((prev) => ({
      ...prev,
      paragraphs: [...prev.paragraphs, ""],
    }));
  };

  const handleRemoveParagraph = (index) => {
    setFormData((prev) => {
      const updated = prev.paragraphs.filter((_, i) => i !== index);
      return {
        ...prev,
        paragraphs: updated.length > 0 ? updated : [""],
      };
    });
  };

  // ==========================
  // Save
  // ==========================
  const handleSave = async () => {
    // validation
    if (!formData.headingPrefix.trim() || !formData.headingHighlight.trim()) {
      setSaveState({
        status: "error",
        message: "Heading Prefix and Heading Highlight are required.",
      });
      return;
    }

    const cleanedParagraphs = formData.paragraphs
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    if (cleanedParagraphs.length === 0) {
      setSaveState({
        status: "error",
        message: "At least one paragraph is required.",
      });
      return;
    }

    setSaveState({ status: "loading", message: "Saving..." });

    try {
      await privateApi.put("/about", {
        headingPrefix: formData.headingPrefix,
        headingHighlight: formData.headingHighlight,
        subHeading: formData.subHeading,
        paragraphs: cleanedParagraphs,
      });

      setSaveState({
        status: "success",
        message: "About Page updated successfully!",
      });
    } catch (err) {
      console.error("Failed to save About Page:", err);
      setSaveState({
        status: "error",
        message: "Failed to save About Page content.",
      });
    }
  };

  return (
    <div className="card mt-5">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="card-title">Manage About Page</h3>

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saveState.status === "loading"}
          >
            {saveState.status === "loading" ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {saveState.status === "error" && (
          <p className="alert alert-danger mt-3">{saveState.message}</p>
        )}

        {saveState.status === "success" && (
          <p className="alert alert-success mt-3">{saveState.message}</p>
        )}

        {/* Heading */}
        <div className="mt-4">
          <label className="form-label">Heading Prefix</label>
          <input
            type="text"
            name="headingPrefix"
            value={formData.headingPrefix}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Example: About"
          />
        </div>

        <div className="mt-3">
          <label className="form-label">Heading Highlight</label>
          <input
            type="text"
            name="headingHighlight"
            value={formData.headingHighlight}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Example: Soshell Media"
          />
        </div>

        {/* Sub Heading */}
        <div className="mt-3">
          <label className="form-label">Sub Heading (optional)</label>
          <input
            type="text"
            name="subHeading"
            value={formData.subHeading}
            onChange={handleInputChange}
            className="form-control"
            placeholder="Example: Who we are & what we believe"
          />
        </div>

        {/* Paragraphs */}
        <div className="mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <label className="form-label mb-0">Paragraphs</label>

            <button
              type="button"
              className="btn btn-sm btn-secondary"
              onClick={handleAddParagraph}
            >
              + Add Paragraph
            </button>
          </div>

          <div className="mt-3">
            {formData.paragraphs.map((para, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <small className="text-muted">Paragraph {index + 1}</small>

                  <button
                    type="button"
                    className="btn btn-sm btn-danger"
                    onClick={() => handleRemoveParagraph(index)}
                    disabled={formData.paragraphs.length === 1}
                  >
                    Remove
                  </button>
                </div>

                <textarea
                  className="form-control"
                  rows={4}
                  value={para}
                  onChange={(e) => handleParagraphChange(index, e.target.value)}
                  placeholder="Write your paragraph here..."
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAboutPage;
