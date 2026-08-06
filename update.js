const fs = require('fs');
const css = fs.readFileSync('e:/Projects/Portfolio AI/Portfolio Project/assets/css/style.css', 'utf8');
const lines = css.split('\n');
const before = lines.slice(0, 1270).join('\n');
const after = lines.slice(1473).join('\n');
const newContent = \/*-----------------------------------*\\
  #RESUME — EDITORIAL BENTO
\\*-----------------------------------*/

.resume-header-wrapper {
  margin-bottom: 40px;
}

.resume-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.resume-header .article-title {
  margin-bottom: 0;
}

/* Premium CTA Button */
.btn-premium-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 12px 24px;
  border-radius: 12px;
  background: var(--border-gradient-onyx);
  color: var(--white-2);
  font-family: var(--ff-heading);
  font-size: var(--fs-6);
  font-weight: 600;
  letter-spacing: 0.02em;
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease, border-color 0.4s ease;
  border: 1px solid var(--jet);
  text-decoration: none;
}

.btn-premium-cta::before {
  content: "";
  position: absolute;
  inset: 1px;
  background: var(--bg-gradient-jet);
  border-radius: inherit;
  z-index: -1;
  transition: background 0.4s ease;
}

.btn-premium-cta::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(224, 184, 76, 0.2), transparent);
  transition: left 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  z-index: 0;
}

.btn-premium-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2), 0 0 12px rgba(224, 184, 76, 0.15);
  border-color: hsla(45, 100%, 72%, 0.3);
  color: var(--orange-yellow-crayola);
}

.btn-premium-cta:hover::before {
  background: var(--eerie-black-1);
}

.btn-premium-cta:hover::after {
  left: 100%;
}

.btn-premium-cta ion-icon {
  font-size: 20px;
  color: var(--orange-yellow-crayola);
  z-index: 1;
  transition: transform 0.3s ease;
}

.btn-premium-cta:hover ion-icon {
  transform: translateY(-2px);
}

.btn-premium-cta span {
  position: relative;
  z-index: 1;
}

/* Resume Grid */
.resume-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
}

/* Resume Column Title */
.resume-column-title {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
}

.resume-icon-box {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--border-gradient-onyx);
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: var(--shadow-1);
  z-index: 1;
}

.resume-icon-box::before {
  content: "";
  position: absolute;
  inset: 1px;
  background: var(--eerie-black-1);
  border-radius: inherit;
  z-index: -1;
}

.resume-icon-box ion-icon {
  font-size: 20px;
  color: var(--orange-yellow-crayola);
}

/* Timeline v2 Container */
.timeline-v2 {
  display: flex;
  flex-direction: column;
  position: relative;
  padding-left: 24px;
}

.timeline-v2::before {
  content: "";
  position: absolute;
  top: 10px;
  bottom: 0;
  left: 5px;
  width: 2px;
  background: linear-gradient(to bottom, var(--jet) 0%, var(--jet) 70%, transparent 100%);
  border-radius: 2px;
}

/* Timeline Item */
.timeline-v2-item {
  position: relative;
  margin-bottom: 32px;
}

.timeline-v2-item:last-child {
  margin-bottom: 0;
}

/* Node (Glowing dot) */
.timeline-v2-node {
  position: absolute;
  left: -24px;
  top: 10px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--text-gradient-yellow);
  box-shadow: 0 0 0 4px var(--eerie-black-2);
  z-index: 2;
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease;
}

.timeline-v2-item:hover .timeline-v2-node {
  transform: scale(1.3);
  box-shadow: 0 0 0 4px var(--eerie-black-2), 0 0 12px rgba(224, 184, 76, 0.5);
}

/* Timeline Card */
.timeline-v2-card {
  background: var(--eerie-black-1);
  border: 1px solid var(--jet);
  border-radius: 16px;
  padding: 24px;
  transition: border-color 0.4s ease, box-shadow 0.4s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.timeline-v2-item:hover .timeline-v2-card {
  border-color: hsla(45, 100%, 72%, 0.3);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2), 0 0 0 1px hsla(45, 100%, 72%, 0.05) inset;
  transform: translateY(-2px);
}

/* Featured Role styling */
.timeline-v2-item.featured-role .timeline-v2-card {
  background: linear-gradient(135deg, var(--eerie-black-1) 0%, hsla(45, 100%, 72%, 0.03) 100%);
  border-color: hsla(45, 100%, 72%, 0.2);
}

.timeline-v2-item.featured-role:hover .timeline-v2-card {
  border-color: hsla(45, 100%, 72%, 0.4);
}

/* Meta info (Date and Badge) */
.timeline-v2-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.timeline-v2-date {
  color: var(--orange-yellow-crayola);
  font-size: var(--fs-7);
  font-weight: 500;
  background: hsla(45, 100%, 72%, 0.08);
  padding: 4px 10px;
  border-radius: 6px;
  letter-spacing: 0.02em;
}

.timeline-v2-badge {
  background: hsla(45, 100%, 72%, 0.15);
  color: var(--orange-yellow-crayola);
  font-size: 10px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 6px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border: 1px solid hsla(45, 100%, 72%, 0.2);
}

/* Title and Company */
.timeline-v2-title {
  font-family: var(--ff-heading);
  font-size: var(--fs-4);
  color: var(--white-2);
  margin-bottom: 6px;
  transition: color 0.3s ease;
}

.timeline-v2-item:hover .timeline-v2-title {
  color: var(--orange-yellow-crayola);
}

.timeline-v2-company {
  display: block;
  font-size: var(--fs-6);
  color: var(--light-gray-70);
  font-weight: 500;
  margin-bottom: 16px;
}

.timeline-v2-item.featured-role .timeline-v2-company {
  color: var(--white-1);
}

/* Description and Lists */
.timeline-v2-desc {
  color: var(--light-gray);
  font-weight: var(--fw-300);
  line-height: 1.6;
  font-size: var(--fs-6);
  margin-bottom: 16px;
}

.timeline-v2-list {
  list-style: none;
  padding-left: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.timeline-v2-list li {
  color: var(--light-gray);
  font-weight: var(--fw-300);
  line-height: 1.6;
  font-size: var(--fs-6);
  position: relative;
  padding-left: 18px;
}

.timeline-v2-list li::before {
  content: "";
  position: absolute;
  left: 0;
  top: 9px;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--jet);
  transition: background 0.3s ease;
}

.timeline-v2-item:hover .timeline-v2-list li::before {
  background: var(--orange-yellow-crayola);
}

/* Resume Responsive */
@media (max-width: 900px) {
  .resume-grid {
    grid-template-columns: 1fr;
  }
}
\;
fs.writeFileSync('e:/Projects/Portfolio AI/Portfolio Project/assets/css/style.css', before + '\n' + newContent + '\n' + after, 'utf8');
