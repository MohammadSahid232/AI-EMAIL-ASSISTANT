# MongoDB Atlas Database Backup & Disaster Recovery Guide

This document outlines the backup and restore procedures for the AI Email Assistant MongoDB Atlas production cluster.

---

## 1. Automated Backups (MongoDB Atlas)

MongoDB Atlas provides continuous cloud backups with point-in-time recovery (PITR) on M10+ tiers, and daily snapshots on free M0/M2/M5 tiers.

### Enabling Automated Backups
1. Log in to the [MongoDB Atlas Dashboard](https://cloud.mongodb.com).
2. Select your Project & Database Cluster.
3. Click on the **Backup** tab.
4. Ensure **Cloud Backups** are toggled ON.
5. Snapshot schedule:
   - **Daily Snapshots**: Retained for 7 days.
   - **Weekly Snapshots**: Retained for 4 weeks.
   - **Monthly Snapshots**: Retained for 12 months.

---

## 2. Manual On-Demand Backup (`mongodump`)

To perform a manual backup before major deployments or database migrations:

```bash
mongodump --uri="mongodb+srv://<USERNAME>:<PASSWORD>@cluster.mongodb.net/ai_email_assistant" --out=./backups/$(date +%Y-%m-%d_%H-%M-%S)
```

---

## 3. Disaster Recovery & Restore Procedure

### Option A: Restore via Atlas GUI
1. Navigate to Atlas Dashboard -> **Clusters** -> **Backup**.
2. Click **Restore** on the desired snapshot timestamp.
3. Select **Restore to a different cluster** or **Download Backup**.
4. Follow the prompt to complete cluster restoration.

### Option B: Restore via CLI (`mongorestore`)
```bash
mongorestore --uri="mongodb+srv://<USERNAME>:<PASSWORD>@cluster.mongodb.net/ai_email_assistant" --drop ./backups/<BACKUP_DIRECTORY>/ai_email_assistant
```

---

## 4. Disaster Recovery RPO / RTO Targets
- **Recovery Point Objective (RPO)**: < 1 hour (Continuous PITR)
- **Recovery Time Objective (RTO)**: < 15 minutes
