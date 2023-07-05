import React, { useState, useEffect } from 'react';
import './styles.css';


const Table = () => {
  const [data, setData] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [companyFilter,setCompanyFilter]=useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', company: '', status: '', notes: '' });

  // Load table data from local storage on component mount
  useEffect(() => {
    const storedData = localStorage.getItem('tableData');
    if (storedData) {
      setData(JSON.parse(storedData));
    }
  }, []);

  // Save table data to local storage when it changes
  useEffect(() => {
    localStorage.setItem('tableData', JSON.stringify(data));
  }, [data]);

  const handleDeleteRecord = (id) => {
    const updatedData = data.filter((record) => record.id !== id);
    setData(updatedData);
  };
  

  const handleStatusFilter = (event) => {
    const selectedStatuses = Array.from(event.target.selectedOptions, (option) => option.value);
    setStatusFilter(selectedStatuses);
  };

  const handleCompanyFilter = (event) => {
    const selectedCompany = Array.from(event.target.selectedOptions, (option) => option.value);
    setCompanyFilter(selectedCompany);
  };

  const handleCheckboxChange = (event, id) => {
    const checked = event.target.checked;
    const updatedData = data.map((record) => {
      if (record.id === id) {
        return { ...record, selected: checked };
      }
      return record;
    });
    setData(updatedData);
  };

  const handleSelectAll = () => {
    const updatedData = data.map((record) => ({ ...record, selected: !selectAll }));
    setData(updatedData);
    setSelectAll(!selectAll);
  };

  const handleFormInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const { name, company, status, notes } = formData;
    const newRecord = { name, company, status, notes, lastUpdated: new Date().toISOString().slice(0, 10) };
    setData(prevData => [...prevData, newRecord]);
    setFormData({ name: '', company: '', status: '', notes: '' });
    setShowForm(false);
  };

  const sortedData = data.sort((a, b) => a.status.localeCompare(b.status) && a.company.localeCompare(b.company));
  
  const filteredData = sortedData.filter((record) =>
    statusFilter.length === 0 ? true : statusFilter.includes(record.status) &&
    companyFilter.length === 0 ? true : companyFilter.includes(record.company)
    );
  
   

  const handleFormCancel = () => {
      setFormData({ name: '', company: '', status: '', notes: '' });
      setShowForm(false);
    };
  

  return (
    <div className="app-container">
      <h1>Team Members</h1>
      <button className="add-members-btn" onClick={() => setShowForm(true)}>Add Members +</button>

      {showForm && (
        <form className="form-container" onSubmit={handleFormSubmit}>
          <label>
            Name:
            <input type="text" name="name" value={formData.name} onChange={handleFormInputChange} />
          </label>
          <br />
          <label>
            Company:
            <input type="text" name="company" value={formData.company} onChange={handleFormInputChange} />
          </label>
          <br />
          <label>
            Status:
            <input type="text" name="status" value={formData.status} onChange={handleFormInputChange} />
          </label>
          <br />
          <label>
            Notes:
            <input type="text" name="notes" value={formData.notes} onChange={handleFormInputChange} />
          </label>
          <br />
          <button type="submit">Add</button>
          <button type="button" onClick={handleFormCancel}>
              Cancel
         </button>
        </form>
      )}

        <select multiple onChange={handleCompanyFilter}>
        <option onChange={handleSelectAll}>All</option>
        <option value="DC United">DC United</option>
        <option value="Manchester United">Manchester United</option>
        <option value="LA Galaxy">LA Galaxy</option>
      </select>
      
      <select multiple onChange={handleStatusFilter}>
        <option value="Active">Active</option>
        <option value="Closed">Closed</option>
      </select>
      
      <table  className="record-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            </th>
            <th>Name</th>
            <th>Company</th>
            <th>Status</th>
            <th>Last Updated</th>
            <th>Notes</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((record) => (
            <tr key={record.id}>
              <td>
                <input
                  type="checkbox"
                  checked={record.selected || false}
                  onChange={(event) => handleCheckboxChange(event, record.id)}
                />
              </td>
              <td>{record.name}</td>
              <td>{record.company}</td>
              <td>{record.status}</td>
              <td>{record.lastUpdated}</td>
              <td>{record.notes}</td>
              <td>
                <button onClick={() => handleDeleteRecord(record.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;