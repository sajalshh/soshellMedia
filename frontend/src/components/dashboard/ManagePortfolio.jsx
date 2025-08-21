import React, { useState, useEffect } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManagePortfolio = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentItem, setCurrentItem] = useState({
    title: "",
    category: "", 
    videoUrl: "",
    displayOrder: 0,
  });
  const [isEditing, setIsEditing] = useState(false);
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
        // Set a default category for the "Add New" form
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
  }, []); // Runs on component mount

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!currentItem.category) {
      alert("Please select a category.");
      return;
    }
    const method = isEditing ? "put" : "post";
    const url = isEditing ? `/portfolio/${currentItem._id}` : "/portfolio";

    try {
      await privateApi[method](url, currentItem);
      resetForm();
      fetchItems();
    } catch (error) {
      console.error("Failed to save item:", error);
    }
  };

  const handleEdit = (item) => {
    setIsEditing(true);
    setCurrentItem({ ...item, category: item.category?._id || "" });
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
    setCurrentItem({
      title: "",
      category: categories.length > 0 ? categories[0]._id : "",
      videoUrl: "",
      displayOrder: 0,
    });
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
            <label className="form-label">Wistia Video URL</label>
            <input
              type="text"
              className="form-control"
              name="videoUrl"
              value={currentItem.videoUrl}
              onChange={handleInputChange}
              placeholder="https://fast.wistia.net/embed/iframe/..."
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Display Order</label>
            <input
              type="number"
              className="form-control"
              name="displayOrder"
              value={currentItem.displayOrder}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isEditing ? "Update Item" : "Add Item"}
          </button>
          {isEditing && (
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
                >
                  Edit
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleDelete(item._id)}
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
