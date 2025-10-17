import React, { useState, useEffect } from "react";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManagePricing = () => {
  const [plans, setPlans] = useState([]);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const privateApi = usePrivateApi();

  const fetchPlans = async () => {
    try {
      const response = await privateApi.get("/pricing");
      setPlans(response.data.data);
    } catch (error) {
      console.error("Failed to fetch pricing plans", error);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openModal = (plan = null) => {
    setEditingPlan(
      plan
        ? { ...plan, features: plan.features.join("\n") }
        : {
            name: "",
            price: "",
            description: "",
            features: "",
            billingCycle: "monthly",
            highlighted: false,
            displayOrder: plans.length + 1,
          },
    );
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPlan(null);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingPlan((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPlan._id) {
        await privateApi.put(`/pricing/${editingPlan._id}`, editingPlan);
      } else {
        await privateApi.post("/pricing", editingPlan);
      }
      fetchPlans();
      closeModal();
    } catch (error) {
      console.error("Save failed:", error);
      alert("Save failed.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure?")) {
      try {
        await privateApi.delete(`/pricing/${id}`);
        fetchPlans();
      } catch (error) {
        alert("Failed to delete plan.");
      }
    }
  };

  return (
    // 👇 WRAP the return statement in a fragment
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="card-title">Manage Pricing Plans</h4>
            <button className="btn btn-primary" onClick={() => openModal()}>
              Add New Plan
            </button>
          </div>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Name</th>
                  <th>Price</th>
                  <th>Cycle</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan._id}>
                    <td>{plan.displayOrder}</td>
                    <td>
                      {plan.name} {plan.highlighted && "⭐"}
                    </td>
                    <td>{plan.price}</td>
                    <td>{plan.billingCycle}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary me-2"
                        onClick={() => openModal(plan)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(plan._id)}
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

      {isModalOpen && (
        <div className="modal show" style={{ display: "block" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleFormSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingPlan._id ? "Edit Plan" : "Add Plan"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={closeModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3 tw-text-white">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      value={editingPlan.name}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3 tw-text-white">
                    <label>Price (e.g., $79 or $790)</label>
                    <input
                      type="text"
                      name="price"
                      className="form-control"
                      value={editingPlan.price}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3 tw-text-white">
                    <label>Description</label>
                    <input
                      type="text"
                      name="description"
                      className="form-control"
                      value={editingPlan.description}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                  <div className="mb-3 tw-text-white">
                    <label>Features (one per line)</label>
                    <textarea
                      name="features"
                      className="form-control"
                      value={editingPlan.features}
                      onChange={handleFormChange}
                      rows="4"
                    ></textarea>
                  </div>
                  <div className="row tw-text-white">
                    <div className="col-md-4 mb-3">
                      <label>Billing Cycle</label>
                      <select
                        name="billingCycle"
                        className="form-select"
                        value={editingPlan.billingCycle}
                        onChange={handleFormChange}
                      >
                        <option value="monthly">Monthly</option>
                        <option value="annual">Annual</option>
                      </select>
                    </div>
                    <div className="col-md-4 mb-3">
                      <label>Display Order</label>
                      <input
                        type="number"
                        name="displayOrder"
                        className="form-control"
                        value={editingPlan.displayOrder}
                        onChange={handleFormChange}
                      />
                    </div>
                    <div className="col-md-4 mb-3 d-flex align-items-end">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          name="highlighted"
                          className="form-check-input"
                          checked={editingPlan.highlighted}
                          onChange={handleFormChange}
                        />
                        <label className="form-check-label">
                          Highlight this plan?
                        </label>
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
                  <button type="submit" className="btn btn-primary">
                    Save
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

export default ManagePricing;
