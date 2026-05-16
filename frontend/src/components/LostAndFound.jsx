import { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteItem as deleteItemApi,
  getAllItems,
  reportItem,
  updateItem,
} from "../api/items";

const INITIAL_FORM = {
  title: "",
  description: "",
  category: "",
  status: "lost",
  location: "",
};

const CATEGORIES = [
  "Electronics",
  "Clothing",
  "Accessories",
  "Documents",
  "Keys",
  "Other",
];

function LostAndFound() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState(null);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load items.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  const stats = useMemo(() => {
    const total = items.length;
    const lost = items.filter((i) => i.status?.toLowerCase() === "lost").length;
    const found = items.filter((i) => i.status?.toLowerCase() === "found").length;
    const completed = items.filter((i) => i.completed).length;
    return { total, lost, found, completed };
  }, [items]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await reportItem({ ...form, completed: false });
      setForm(INITIAL_FORM);
      await fetchItems();
    } catch (err) {
      setError(err.message || "Failed to add item.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleComplete = async (item) => {
    setBusyId(item._id);
    setError(null);
    try {
      await updateItem(item._id, { completed: !item.completed });
      await fetchItems();
    } catch (err) {
      setError(err.message || "Failed to update item.");
    } finally {
      setBusyId(null);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Delete "${item.title}"?`)) return;

    setBusyId(item._id);
    setError(null);
    try {
      await deleteItemApi(item._id);
      await fetchItems();
    } catch (err) {
      setError(err.message || "Failed to delete item.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div className="dashboard__brand">
          <span className="dashboard__logo" aria-hidden="true">
            LF
          </span>
          <div>
            <h1>Lost &amp; Found</h1>
            <p>Track, report, and resolve campus lost items</p>
          </div>
        </div>
      </header>

      {error && (
        <div className="dashboard__alert" role="alert">
          {error}
          <button
            type="button"
            className="dashboard__alert-dismiss"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      <section className="dashboard__stats" aria-label="Summary statistics">
        <article className="stat-card">
          <span className="stat-card__label">Total items</span>
          <strong className="stat-card__value">{stats.total}</strong>
        </article>
        <article className="stat-card stat-card--lost">
          <span className="stat-card__label">Lost</span>
          <strong className="stat-card__value">{stats.lost}</strong>
        </article>
        <article className="stat-card stat-card--found">
          <span className="stat-card__label">Found</span>
          <strong className="stat-card__value">{stats.found}</strong>
        </article>
        <article className="stat-card stat-card--done">
          <span className="stat-card__label">Completed</span>
          <strong className="stat-card__value">{stats.completed}</strong>
        </article>
      </section>

      <div className="dashboard__grid">
        <section className="panel panel--form">
          <h2>Add item</h2>
          <p className="panel__hint">Report a new lost or found item.</p>

          <form className="item-form" onSubmit={handleSubmit}>
            <label className="item-form__field">
              <span>Title</span>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Blue backpack"
              />
            </label>

            <label className="item-form__field">
              <span>Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Describe the item..."
              />
            </label>

            <label className="item-form__field">
              <span>Category</span>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Select category
                </option>
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </label>

            <label className="item-form__field">
              <span>Status</span>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </label>

            <label className="item-form__field">
              <span>Location</span>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Library, Room 201"
              />
            </label>

            <button
              type="submit"
              className="btn btn--primary"
              disabled={submitting}
            >
              {submitting ? "Adding…" : "Add item"}
            </button>
          </form>
        </section>

        <section className="panel panel--table">
          <div className="panel__table-head">
            <div>
              <h2>All items</h2>
              <p className="panel__hint">Mark resolved items or remove records.</p>
            </div>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={fetchItems}
              disabled={loading}
            >
              Refresh
            </button>
          </div>

          <div className="table-wrap">
            {loading ? (
              <p className="dashboard__status">Loading items…</p>
            ) : items.length === 0 ? (
              <p className="dashboard__status">No items yet. Add one using the form.</p>
            ) : (
              <table className="items-table">
                <thead>
                  <tr>
                    <th scope="col">Done</th>
                    <th scope="col">Title</th>
                    <th scope="col">Description</th>
                    <th scope="col">Category</th>
                    <th scope="col">Status</th>
                    <th scope="col">Location</th>
                    <th scope="col">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item._id}
                      className={item.completed ? "items-table__row--done" : ""}
                    >
                      <td>
                        <label className="items-table__check">
                          <input
                            type="checkbox"
                            checked={Boolean(item.completed)}
                            disabled={busyId === item._id}
                            onChange={() => handleToggleComplete(item)}
                            aria-label={`Mark ${item.title} as completed`}
                          />
                        </label>
                      </td>
                      <td className="items-table__title">{item.title}</td>
                      <td className="items-table__desc">{item.description}</td>
                      <td>{item.category}</td>
                      <td>
                        <span
                          className={`badge badge--${item.status?.toLowerCase()}`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td>{item.location}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn--danger btn--sm"
                          disabled={busyId === item._id}
                          onClick={() => handleDelete(item)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default LostAndFound;
