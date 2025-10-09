// src/components/dashboard/ManageCaseStudies.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePrivateApi from "../../hooks/usePrivateApi";

const ManageCaseStudies = () => {
  const [studies, setStudies] = useState([]);
  const [error, setError] = useState("");
  const privateApi = usePrivateApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCaseStudies = async () => {
      try {
        const response = await privateApi.get("/casestudies");
        setStudies(response.data.data);
      } catch (err) {
        setError("Failed to load case studies.");
      }
    };
    fetchCaseStudies();
  }, [privateApi]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this case study?"))
      return;
    try {
      await privateApi.delete(`/casestudies/${id}`);
      setStudies(studies.filter((s) => s._id !== id));
    } catch (err) {
      setError("Failed to delete case study.");
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center">
          <h4 className="card-title">Case Studies</h4>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/admincasestudy")}
          >
            Add New Case Study
          </button>
        </div>

        {error && <p className="alert alert-danger mt-3">{error}</p>}

        <div className="table-responsive mt-3">
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Client</th>
                <th>Industry</th>
                <th>Date</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {studies.map((study) => (
                <tr key={study._id}>
                  <td>{study.title}</td>
                  <td>{study.client}</td>
                  <td>{study.industry}</td>
                  <td>{new Date(study.createdAt).toLocaleDateString()}</td>
                  <td className="text-end">
                    <button
                      className="btn btn-sm btn-secondary me-2"
                      onClick={() =>
                        navigate(`/admincasestudy/edit/${study._id}`)
                      }
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(study._id)}
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
  );
};

export default ManageCaseStudies;
