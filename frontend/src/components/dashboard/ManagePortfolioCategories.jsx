import React, { useState, useEffect } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManagePortfolioCategories = () => {
  const [categories, setCategories] = useState([]);
  const [currentCategory, setCurrentCategory] = useState({ name: "" });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const privateApi = usePrivateApi();

  const fetchCategories = async () => {
    try {
      const response = await privateApi.get("/categories");
      setCategories(response.data.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    setCurrentCategory({ ...currentCategory, name: e.target.value });
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentCategory({ name: "" });
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors
    const method = isEditing ? "put" : "post";
    const url = isEditing
      ? `/categories/${currentCategory._id}`
      : "/categories";

    try {
      await privateApi[method](url, { name: currentCategory.name });
      resetForm();
      fetchCategories();
    } catch (err) {
      console.error("Failed to save category:", err);
      setError(err.response?.data?.message || "An error occurred.");
    }
  };

  const handleEdit = (category) => {
    setIsEditing(true);
    setCurrentCategory(category);
    setError("");
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await privateApi.delete(`/categories/${id}`);
        fetchCategories();
      } catch (err) {
        console.error("Failed to delete category:", err);
        alert(err.response?.data?.message || "Failed to delete category.");
      }
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h4 className="card-title">
          {isEditing ? "Edit Category" : "Add New Category"}
        </h4>
        <form onSubmit={handleSave}>
          <div className="mb-3">
            <label className="form-label">Category Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={currentCategory.name}
              onChange={handleInputChange}
              required
            />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Update Category" : "Add Category"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary ms-2"
              onClick={resetForm}
            >
              Cancel
            </button>
          )}
        </form>

        <hr />

        <h5 className="mt-4">Existing Categories</h5>
        <ul className="list-group">
          {categories.map((cat) => (
            <li
              key={cat._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {cat.name}
              <div>
                <button
                  className="btn btn-sm btn-outline-primary me-2"
                  onClick={() => handleEdit(cat)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(cat._id)}
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

export default ManagePortfolioCategories;
