// Resilient in-memory store if MongoDB server is offline
const bcrypt = require('bcryptjs');

const defaultHashedPassword = bcrypt.hashSync('password123', 10);

const users = [
  {
    _id: '66a1b2c3d4e5f67890123456',
    name: 'Executive User',
    email: 'user@example.com',
    password: defaultHashedPassword,
    role: 'user',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date('2026-01-15T08:00:00Z')
  },
  {
    _id: '66a1b2c3d4e5f67890123457',
    name: 'Platform Admin',
    email: 'admin@example.com',
    password: defaultHashedPassword,
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
    createdAt: new Date('2026-01-01T08:00:00Z')
  }
];

const emails = [
  {
    _id: 'email_001',
    userId: '66a1b2c3d4e5f67890123456',
    type: 'generate-email',
    prompt: 'Recipient: Client, Purpose: Q3 Project Update, Tone: Professional',
    generatedText: 'Dear Client,\n\nI am pleased to provide an update on our Q3 project milestones. All deliverables remain on schedule.\n\nBest regards,\nExecutive Team',
    metadata: { recipient: 'Client', purpose: 'Q3 Update' },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    _id: 'email_002',
    userId: '66a1b2c3d4e5f67890123456',
    type: 'summarize',
    prompt: 'Email regarding budget allocation and final deadline approval',
    generatedText: '### Summary\nThe finance team has approved the budget.\n\n### Key Points\n- Budget: $50,000\n- Deadline: Friday 5 PM',
    metadata: {},
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5)
  }
];

const templates = [
  {
    _id: 'tpl_001',
    title: 'Project Kickoff Announcement',
    category: 'HR',
    content: 'Hi Team,\n\nWe are excited to launch our upcoming project. Please join the kickoff meeting on Monday at 10 AM.\n\nRegards,\nManagement',
    userId: '66a1b2c3d4e5f67890123456',
    tags: ['Kickoff', 'Internal'],
    createdAt: new Date()
  },
  {
    _id: 'tpl_002',
    title: 'Sales Follow-up Pitch',
    category: 'Sales',
    content: 'Hi {{name}},\n\nFollowing up on our recent demo. I wanted to check if you had any questions regarding our enterprise pricing tier.\n\nBest,\nSales Team',
    userId: '66a1b2c3d4e5f67890123456',
    tags: ['Sales', 'Demo'],
    createdAt: new Date()
  },
  {
    _id: 'tpl_003',
    title: 'Customer Support Escalation Response',
    category: 'Customer Support',
    content: 'Dear {{customer_name}},\n\nThank you for reaching out. We have escalated your ticket #{{ticket_id}} to senior engineering.',
    userId: '66a1b2c3d4e5f67890123456',
    tags: ['Support', 'Urgent'],
    createdAt: new Date()
  }
];

const activities = [
  {
    _id: 'act_001',
    userId: '66a1b2c3d4e5f67890123456',
    activity: 'Generated Email',
    details: 'Q3 Update for Client',
    time: new Date(Date.now() - 1000 * 60 * 60 * 2)
  },
  {
    _id: 'act_002',
    userId: '66a1b2c3d4e5f67890123456',
    activity: 'Summarized Email',
    details: 'Budget Allocation Document',
    time: new Date(Date.now() - 1000 * 60 * 60 * 5)
  }
];

const systemLogs = [
  {
    _id: 'sys_001',
    level: 'info',
    message: 'User logged in successfully',
    endpoint: '/api/auth/login',
    method: 'POST',
    statusCode: 200,
    ip: '127.0.0.1',
    createdAt: new Date()
  },
  {
    _id: 'sys_002',
    level: 'info',
    message: 'AI Generation processed via Gemini API',
    endpoint: '/api/ai/generate-email',
    method: 'POST',
    statusCode: 200,
    ip: '127.0.0.1',
    createdAt: new Date()
  }
];

module.exports = {
  users,
  emails,
  templates,
  activities,
  systemLogs
};
