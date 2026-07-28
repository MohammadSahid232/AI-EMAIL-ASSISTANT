const Template = require('../models/Template');
const { getIsFallback } = require('../config/db');
const memoryStore = require('../utils/memoryStore');

// Get all templates for user
exports.getTemplates = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { category, search } = req.query;

    if (getIsFallback()) {
      let filtered = memoryStore.templates.filter(
        (t) => t.userId.toString() === userId.toString() || t.isPublic
      );

      if (category && category !== 'All') {
        filtered = filtered.filter((t) => t.category === category);
      }

      if (search) {
        const q = search.toLowerCase();
        filtered = filtered.filter(
          (t) => t.title.toLowerCase().includes(q) || t.content.toLowerCase().includes(q)
        );
      }

      return res.status(200).json({ success: true, count: filtered.length, templates: filtered });
    }

    const query = {
      $or: [{ userId }, { isPublic: true }]
    };

    if (category && category !== 'All') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    const templates = await Template.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: templates.length,
      templates
    });
  } catch (err) {
    next(err);
  }
};

// Create template
exports.createTemplate = async (req, res, next) => {
  try {
    const { title, category, content, tags } = req.body;
    const userId = req.user._id || req.user.id;

    if (getIsFallback()) {
      const newTpl = {
        _id: `tpl_${Date.now()}`,
        title,
        category: category || 'Personal',
        content,
        userId: userId.toString(),
        tags: tags || [],
        createdAt: new Date()
      };
      memoryStore.templates.unshift(newTpl);
      return res.status(201).json({ success: true, template: newTpl });
    }

    const template = await Template.create({
      title,
      category,
      content,
      tags,
      userId
    });

    res.status(201).json({
      success: true,
      template
    });
  } catch (err) {
    next(err);
  }
};

// Update template
exports.updateTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category, content, tags } = req.body;
    const userId = req.user._id || req.user.id;

    if (getIsFallback()) {
      const tplIndex = memoryStore.templates.findIndex((t) => t._id === id);
      if (tplIndex === -1) {
        return res.status(404).json({ success: false, error: 'Template not found' });
      }
      if (memoryStore.templates[tplIndex].userId.toString() !== userId.toString()) {
        return res.status(403).json({ success: false, error: 'Not authorized to modify this template' });
      }
      memoryStore.templates[tplIndex] = {
        ...memoryStore.templates[tplIndex],
        title: title || memoryStore.templates[tplIndex].title,
        category: category || memoryStore.templates[tplIndex].category,
        content: content || memoryStore.templates[tplIndex].content,
        tags: tags || memoryStore.templates[tplIndex].tags
      };
      return res.status(200).json({ success: true, template: memoryStore.templates[tplIndex] });
    }

    let template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }

    if (template.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to modify this template' });
    }

    template = await Template.findByIdAndUpdate(id, { title, category, content, tags }, { new: true, runValidators: true });

    res.status(200).json({
      success: true,
      template
    });
  } catch (err) {
    next(err);
  }
};

// Delete template
exports.deleteTemplate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user._id || req.user.id;

    if (getIsFallback()) {
      const tplIndex = memoryStore.templates.findIndex((t) => t._id === id);
      if (tplIndex === -1) {
        return res.status(404).json({ success: false, error: 'Template not found' });
      }
      memoryStore.templates.splice(tplIndex, 1);
      return res.status(200).json({ success: true, message: 'Template removed successfully' });
    }

    const template = await Template.findById(id);
    if (!template) {
      return res.status(404).json({ success: false, error: 'Template not found' });
    }

    if (template.userId.toString() !== userId.toString()) {
      return res.status(403).json({ success: false, error: 'Not authorized to delete this template' });
    }

    await template.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Template removed successfully'
    });
  } catch (err) {
    next(err);
  }
};
