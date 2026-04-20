import '../styles/CategoryManager.css';
import React, { useState, useContext, useEffect } from 'react';
import { ExpenseContext } from '../context/ExpenseContext';

const CategoryManager = () => {
  const { categories, addCategory, updateCategory, deleteCategory, fetchCategories } = useContext(ExpenseContext);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    color: '#007bff',
    icon: '📦'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (editingCategory) {
        await updateCategory(editingCategory._id, formData);
      } else {
        await addCategory(formData);
      }

      setFormData({ name: '', color: '#007bff', icon: '📦' });
      setShowForm(false);
      setEditingCategory(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save category');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      color: category.color,
      icon: category.icon
    });
    setShowForm(true);
  };

  const handleDelete = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(categoryId);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to delete category');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingCategory(null);
    setFormData({ name: '', color: '#007bff', icon: '📦' });
    setError('');
  };

  const commonIcons = ['🍽️', '🚗', '🛍️', '🎬', '💡', '🏥', '📚', '✈️', '📦', '🎵', '💻', '🏠', '💼', '🎯', '📱'];

  return (
    <div className="category-manager">
      <div className="category-header">
        <h2>Manage Categories</h2>
        <button
          onClick={() => setShowForm(true)}
          className="add-category-btn"
          disabled={showForm}
        >
          + Add Category
        </button>
      </div>

      {error && <div className="form-error">{error}</div>}

      {showForm && (
        <form onSubmit={handleSubmit} className="category-form">
          <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>

          <div className="form-group">
            <label htmlFor="categoryName">Category Name</label>
            <input
              type="text"
              id="categoryName"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Groceries"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="categoryColor">Color</label>
            <input
              type="color"
              id="categoryColor"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Icon</label>
            <div className="icon-selector">
              {commonIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, icon })}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-btn">
              {loading ? 'Saving...' : (editingCategory ? 'Update' : 'Add')} Category
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category._id || category.name} className="category-card">
            <div className="category-info">
              <span
                className="category-icon"
                style={{ backgroundColor: category.color }}
              >
                {category.icon}
              </span>
              <span className="category-name">{category.name}</span>
              {category.isDefault && <span className="default-badge">Default</span>}
            </div>

            {!category.isDefault && (
              <div className="category-actions">
                <button
                  onClick={() => handleEdit(category)}
                  className="edit-btn"
                  disabled={showForm}
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleDelete(category._id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;