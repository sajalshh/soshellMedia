import React, { useState, useEffect } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManagePortfolio = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);

  // State for text fields
  const [currentItem, setCurrentItem] = useState({
    title: "",
    category: "",
    displayOrder: 0,
  });

  // Separate state for the file
  const [videoFile, setVideoFile] = useState(null);

  // --- NEW: Loading & Progress States ---
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const privateApi = usePrivateApi();

  const fetchItems = async () => {
    try {
      const response = await privateApi.get("/portfolio");
      setItems(response.data.data);
    } catch (error) {
      console.error("Failed to fetch portfolio items:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await privateApi.get("/categories");
      setCategories(response.data.data);
      if (response.data.data.length > 0 && !isEditing) {
        setCurrentItem((prev) => ({
          ...prev,
          category: response.data.data[0]._id,
        }));
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentItem.category) {
      alert("Please select a category.");
      return;
    }

    const formData = new FormData();
    formData.append("title", currentItem.title);
    formData.append("category", currentItem.category);
    formData.append("displayOrder", currentItem.displayOrder);

    if (videoFile) {
      formData.append("videoFile", videoFile);
    }

    const method = isEditing ? "put" : "post";
    const url = isEditing ? `/portfolio/${editId}` : "/portfolio";

    // --- START UPLOAD ---
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Pass configuration with onUploadProgress
      await privateApi[method](url, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total,
          );
          setUploadProgress(percentCompleted);
        },
      });

      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Failed to save item:", error);
      alert("Failed to save. Check console for details.");
    } finally {
      // --- END UPLOAD ---
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item._id);
    setCurrentItem({
      title: item.title,
      category: item.category?._id || "",
      displayOrder: item.displayOrder,
    });
    setVideoFile(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await privateApi.delete(`/portfolio/${id}`);
        fetchItems();
      } catch (error) {
        console.error("Failed to delete item:", error);
      }
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setCurrentItem({
      title: "",
      category: categories.length > 0 ? categories[0]._id : "",
      displayOrder: 0,
    });
    setVideoFile(null);
    if (document.getElementById("videoFileInput")) {
      document.getElementById("videoFileInput").value = "";
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h3 className="card-title">
          {isEditing ? "Edit Portfolio Item" : "Add New Portfolio Item"}
        </h3>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              name="title"
              value={currentItem.title}
              onChange={handleInputChange}
              required
              disabled={isUploading} // Disable while uploading
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              name="category"
              value={currentItem.category}
              onChange={handleInputChange}
              required
              disabled={isUploading} // Disable while uploading
            >
              <option value="" disabled>
                -- Select a Category --
              </option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Video (MP4/WebM)</label>
            <input
              type="file"
              id="videoFileInput"
              className="form-control"
              onChange={handleFileChange}
              accept="video/mp4, video/webm"
              required={!isEditing}
              disabled={isUploading} // Disable while uploading
            />
            {isEditing && (
              <small className="text-muted">
                Leave empty to keep current video
              </small>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Display Order</label>
            <input
              type="number"
              className="form-control"
              name="displayOrder"
              value={currentItem.displayOrder}
              onChange={handleInputChange}
              disabled={isUploading} // Disable while uploading
            />
          </div>

          {/* --- PROGRESS BAR SECTION --- */}
          {isUploading && (
            <div className="mb-3">
              <label className="form-label text-primary fw-bold">
                Uploading Video... {uploadProgress}%
              </label>
              <div className="progress" style={{ height: "25px" }}>
                <div
                  className="progress-bar progress-bar-striped progress-bar-animated"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {uploadProgress}%
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isUploading} // Prevent double clicks
          >
            {isUploading
              ? "Uploading..."
              : isEditing
              ? "Update Item"
              : "Add Item"}
          </button>
          {isEditing && !isUploading && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={resetForm}
            >
              Cancel Edit
            </button>
          )}
        </form>

        <hr className="my-4" />

        <h4 className="mt-4">Existing Portfolio Items</h4>
        <ul className="list-group">
          {items.map((item) => (
            <li
              key={item._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{item.title}</strong>
                <br />
                <small className="text-muted">
                  {item.category?.name} - Order: {item.displayOrder}
                </small>
              </div>
              <div>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleEdit(item)}
                  disabled={isUploading}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(item._id)}
                  disabled={isUploading}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ManagePortfolio;
