import React, { useState, useEffect } from 'react';
import { BookmarkCheck, Plus, Search, Copy, Check, Trash2, Edit3, Tag, Folder } from 'lucide-react';
import { Header } from '../components/layout/Header';
import { GlassCard } from '../components/common/GlassCard';
import { templateService } from '../services/templateService';
import { useToast } from '../context/ToastContext';

export const TemplatesPage = () => {
  const [allTemplates, setAllTemplates] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  // New Template Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Personal');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [editingId, setEditingId] = useState(null);

  const { addToast } = useToast();

  const categories = ['All', 'HR', 'Marketing', 'Sales', 'Customer Support', 'Personal'];

  // Load ALL templates once; filter entirely client-side
  const loadTemplates = async () => {
    try {
      setLoading(true);
      const res = await templateService.getTemplates({});
      if (res.data.success) {
        setAllTemplates(res.data.templates);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtered view — reacts instantly to search & category
  const templates = allTemplates.filter((t) => {
    const matchCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const q = search.toLowerCase().trim();
    const matchSearch = !q ||
      t.title.toLowerCase().includes(q) ||
      t.content.toLowerCase().includes(q) ||
      (t.category || '').toLowerCase().includes(q) ||
      (t.tags || []).some((tag) => tag.toLowerCase().includes(q));
    return matchCategory && matchSearch;
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    addToast('Template content copied!', 'success');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;
    try {
      await templateService.deleteTemplate(id);
      addToast('Template deleted', 'info');
      loadTemplates();
    } catch (err) {
      addToast('Failed to delete template', 'error');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const tagArray = tags.split(',').map((t) => t.trim()).filter(Boolean);
      if (editingId) {
        await templateService.updateTemplate(editingId, { title, category, content, tags: tagArray });
        addToast('Template updated successfully!', 'success');
      } else {
        await templateService.createTemplate({ title, category, content, tags: tagArray });
        addToast('Template created successfully!', 'success');
      }
      setShowModal(false);
      resetForm();
      loadTemplates();
    } catch (err) {
      addToast('Failed to save template', 'error');
    }
  };

  const resetForm = () => {
    setTitle('');
    setCategory('Personal');
    setContent('');
    setTags('');
    setEditingId(null);
  };

  const openEditModal = (tpl) => {
    setEditingId(tpl._id);
    setTitle(tpl.title);
    setCategory(tpl.category);
    setContent(tpl.content);
    setTags(tpl.tags ? tpl.tags.join(', ') : '');
    setShowModal(true);
  };

  return (
    <div className="flex-1 space-y-6 pb-12">
      <Header title="Email Templates" />

      <div className="px-6 max-w-6xl mx-auto space-y-6">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-brand-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search templates..."
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
              />
            </div>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-500/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>New Template</span>
            </button>
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((tpl) => (
            <GlassCard key={tpl._id} className="flex flex-col justify-between p-5">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-500 border border-brand-500/20">
                    {tpl.category}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(tpl)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(tpl._id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">{tpl.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 font-mono bg-slate-50/50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-200/50 dark:border-slate-800/50 line-clamp-4 leading-relaxed whitespace-pre-wrap">
                  {tpl.content}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-[10px] text-slate-400">
                  <Tag className="w-3 h-3" />
                  <span>{tpl.tags?.join(', ') || 'Template'}</span>
                </div>
                <button
                  onClick={() => handleCopy(tpl._id, tpl.content)}
                  className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-brand-500 hover:text-white text-xs font-medium transition-all"
                >
                  {copiedId === tpl._id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedId === tpl._id ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Modal for Create/Edit Template */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg glass-card rounded-3xl p-6 space-y-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {editingId ? 'Edit Template' : 'Create New Template'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm"
                  placeholder="e.g. Sales Pitch Draft"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm"
                >
                  <option value="HR">HR</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Sales">Sales</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Content</label>
                <textarea
                  rows={5}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm"
                  placeholder="Type or paste template text..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider mb-1">Tags (Comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border text-sm"
                  placeholder="Outreach, Demo, Proposal"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-200 dark:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-brand-600 text-white shadow-md"
                >
                  Save Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
