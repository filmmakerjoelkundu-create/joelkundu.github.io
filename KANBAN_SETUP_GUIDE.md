# 🎬 Portfolio Sample - Kanban Development System Guide

**Created:** May 15, 2026  
**Status:** ✅ Board Created & Ready  
**Location:** `/mnt/c/Users/kundu/Desktop/portfolio-sample`

---

## 📊 Overview

I've analyzed all 40+ documentation files in `.cleanup_archive/`, reviewed the codebase, and set up a comprehensive Kanban system to manage the development and bug fixes for your portfolio site.

**What You're Building:**
- **Live Site**: Public-facing cinematography portfolio (HTML/CSS/JS)
- **Dashboard CMS**: Password-protected admin panel (Node.js/Express)
- **Config-driven**: All content managed via `config/site-config.json`

---

## 🎯 Your Kanban Board

### Board Structure

```
t_10edfc8f [MASTER] Portfolio Sample - Complete Development & Bug Fixes
│
├─→ t_a6c3f894  [P0] Fix poster preview instability (programmer)
├─→ t_ac66b685  [P0] Security fixes - env vars (programmer)
├─→ t_10e0c25e  [P1] Input validation & rate limiting (programmer)
├─→ t_130aac3a  [P1] Connect work-detail.html to dashboard (programmer)
├─→ t_d52f648d  [P1] Implement contact form backend (programmer)
├─→ t_0f398012  [P2] Remove dead code (reviewer)
├─→ t_8ba8c6b7  [P2] Add error handling (reviewer)
├─→ t_35080d6b  [P2] Performance optimizations (programmer)
├─→ t_c9eeef22  [P2] Documentation update (recorder)
├─→ t_2c4db931  [P3] Testing & verification (reviewer)
└─→ t_90e9d1c3  [P3] Integration testing & final review (reviewer)
```

**Dependency Graph:**
- All P0, P1, P2 tasks can run in parallel
- P3 tasks depend on completion of all upstream tasks
- Master task `t_10edfc8f` tracks overall progress

---

## 👥 Your Profiles

You have 5 profiles configured:

| Profile | Model | Role |
|---------|-------|------|
| `default` | GLM-5.1 | General tasks, coordination |
| `designer` | GLM-5.1 | UI/UX, visual design |
| `programmer` | Qwen3.5-397B | Code implementation |
| `recorder` | GLM-5.1 | Documentation |
| `researcher` | GLM-5.1 | Research, discovery |
| `reviewer` | Qwen3.5-397B | Code review, QA, testing |

---

## 📋 Task Breakdown

### P0 - Critical (Must Fix First)

#### t_a6c3f894: Fix poster preview instability
**Assignee:** programmer  
**Problem:** Blob URLs expire, previews stick between projects, no caching

**Key Issues:**
- 6 projects have blob URLs in config
- No temporary upload cache
- Preview doesn't clear on modal close
- No cleanup mechanism

**Solution:**
1. Implement `window.pendingUploads` cache
2. Two-stage upload (temp → config)
3. Clear preview on modal events
4. Replace blob URLs with data URLs

**Files:** `dashboard-server/index.html`, `server.js`

---

#### t_ac66b685: Security fixes - Move secrets to environment variables
**Assignee:** programmer  
**Problem:** JWT secret, password hash, API keys hardcoded in source

**Required:**
1. Create `.env` file with secure secrets
2. Move `JWT_SECRET` to `process.env`
3. Move `PASSWORD_HASH` to `process.env`
4. Move `OMDB_API_KEY` to `process.env`
5. Add `.env` to `.gitignore`
6. Fix `eval()` in pattern editor

**Commands:**
```bash
# Generate JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Generate PASSWORD_HASH
node -e "console.log(require('bcryptjs').hashSync('JOELKUNDU', 10))"
```

**Files:** `server.js`, `.env`, `.env.example`, `.gitignore`

---

### P1 - High Priority

#### t_10e0c25e: Input validation, rate limiting, security headers
**Assignee:** programmer

**Required Packages:**
- `express-validator` (input sanitization)
- `express-rate-limit` (rate limiting)
- `helmet` (security headers)

**Implementation:**
- Login rate limiter: 5 attempts per 15 min
- API rate limiter: 100 requests per min
- Security headers (CSP, etc.)
- Input validation on all endpoints

---

#### t_130aac3a: Connect work-detail.html to dashboard data
**Assignee:** programmer

**Problem:** Uses hardcoded `workData` instead of config

**Solution:**
1. Fetch config from `/config/site-config.json`
2. Extract project from `selectedWorks` array
3. Populate poster, credits, stills dynamically
4. Add loading/error states

---

#### t_d52f648d: Implement contact form backend
**Assignee:** programmer

**Options:**
- **Option A (Recommended):** Formspree integration
- **Option B:** Custom Node.js endpoint with nodemailer

**Requirements:**
- AJAX submission
- Rate limiting (spam protection)
- Success/error feedback
- Config-driven settings

---

### P2 - Medium Priority

#### t_0f398012: Remove dead code and console.logs
**Assignee:** reviewer

**Scope:**
- 500+ lines commented code in `dashboard-server/index.html`
- 300+ lines in `script.js`
- Console.logs throughout

**Action:**
- Delete all commented code
- Replace `console.log` with `logger.js`
- Keep only explanatory comments
- Remove unused imports/variables

---

#### t_8ba8c6b7: Add proper error handling
**Assignee:** reviewer

**Requirements:**
- Wrap all async in try-catch
- Proper error responses (status codes)
- Log errors with stack traces
- User-friendly error messages
- Error boundaries in frontend

---

#### t_35080d6b: Performance optimizations
**Assignee:** programmer

**Optimizations:**
1. **Image optimization:** Install `sharp`, compress on upload, resize, WebP
2. **Config caching:** Memory cache with file watcher
3. **Frontend:** Lazy load, debounce, optimize animations

**Targets:**
- Image upload < 2s (5MB)
- Config load < 100ms
- Lighthouse score > 90

---

#### t_c9eeef22: Documentation update
**Assignee:** recorder

**Create:**
- `README.md` (update)
- `docs/DEPLOYMENT.md`
- `docs/SECURITY.md`
- `docs/TROUBLESHOOTING.md`
- `docs/API.md`
- `docs/ARCHITECTURE.md`

**Consolidate:** Move important docs from `.cleanup_archive/` to `/docs/`

---

### P3 - Low Priority (Depends on upstream)

#### t_2c4db931: Testing & verification
**Assignee:** reviewer

**Test Categories:**
1. Functional (login, upload, save, themes, gallery, form)
2. Security (rate limiting, validation, JWT)
3. Performance (load times, memory)
4. Browser (Chrome, Firefox, Safari, mobile)
5. Edge cases (large files, invalid formats, network failures)

---

#### t_90e9d1c3: Integration testing & final review
**Assignee:** reviewer  
**Dependencies:** All other tasks

**Gate Criteria:**
- All P0 and P1 tasks completed
- No critical bugs
- All tests passing
- Documentation complete
- Security issues resolved

**Deliverables:**
- Final test report
- Deployment readiness checklist
- Known issues list
- Next steps recommendations

---

## 🚀 How to Use This Kanban System

### View Your Board

```bash
# List all tasks
hermes kanban ls

# Show task details
hermes kanban show t_a6c3f894

# View by assignee
hermes kanban ls --assignee programmer

# View by status
hermes kanban ls --status todo
```

### Work on a Task

```bash
# Claim a task (dispatcher does this automatically)
hermes kanban claim t_a6c3f894

# Complete a task
hermes kanban complete t_a6c3f894 --summary "Fixed poster preview with temp cache"

# Add comments
hermes kanban comment t_a6c3f894 "Found additional issue: still upload also needs fixing"

# Block a task (needs human input)
hermes kanban block t_a6c3f894 --reason "Waiting for user to provide Formspree ID"
```

### Task Dependencies

Tasks with dependencies automatically stay in `todo` until parents complete:

```bash
# Link parent → child
hermes kanban link <parent_id> <child_id>

# Example: Final review depends on all fixes
hermes kanban link t_a6c3f894 t_90e9d1c3
```

### Recovery Actions

If a task gets stuck:

```bash
# Reclaim (abort and reset to ready)
hermes kanban reclaim t_a6c3f894

# Reassign to different profile
hermes kanban reassign t_a6c3f894 reviewer --reclaim

# Change profile model
hermes -p programmer model qwen/qwen3.5-397b-a17b
hermes kanban reclaim t_a6c3f894
```

---

## 📊 Task Lifecycle

```
triage → todo → ready → running → done
                ↓
            blocked → unblock → ready
                ↓
            failed → retry → ready
```

**States:**
- `triage`: Parked for specification
- `todo`: Ready to be claimed (no dependencies or all parents done)
- `ready`: Claimed by dispatcher, worker starting
- `running`: Worker is executing
- `done`: Task completed successfully
- `blocked`: Waiting on external input
- `failed`: Worker crashed or timed out

---

## 🎯 Recommended Workflow

### Phase 1: Critical Fixes (Week 1)

1. **Start P0 tasks:**
   ```bash
   # The dispatcher will automatically assign to programmer
   # Tasks t_a6c3f894 and t_ac66b685 will run in parallel
   ```

2. **Monitor progress:**
   ```bash
   hermes kanban ls --assignee programmer
   hermes kanban show t_a6c3f894
   ```

3. **Review completions:**
   ```bash
   hermes kanban log t_a6c3f894
   ```

### Phase 2: High Priority (Week 2)

1. **Start P1 tasks** (after P0 complete):
   - Input validation & rate limiting
   - Connect work-detail.html
   - Contact form backend

2. **Parallel execution:** All P1 tasks can run simultaneously

### Phase 3: Quality Improvements (Week 3)

1. **Code quality:**
   - Remove dead code
   - Add error handling
   - Performance optimizations

2. **Documentation:**
   - Consolidate docs
   - Create deployment guide

### Phase 4: Testing & Review (Week 4)

1. **Comprehensive testing**
2. **Final integration review**
3. **Deployment readiness**

---

## 🧪 Testing Your Changes

### Manual Testing Checklist

```bash
# 1. Start the site server
cd /mnt/c/Users/kundu/Desktop/portfolio-sample
./START_SERVER.sh

# 2. Start dashboard server
cd dashboard-server
npm start

# 3. Test in browser
# - http://localhost:5001 (live site)
# - http://localhost:3000 (dashboard)
```

### Automated Testing (Optional)

Create `test-suite.js`:
```javascript
// Test password login
// Test image upload
// Test config save
// Test gallery filtering
// Test theme switching
```

---

## 📚 Reference Documents

All your documentation is in `.cleanup_archive/`:

**Key Documents:**
- `BUGFIX_SUMMARY.md` - Previous bug fixes
- `COMPREHENSIVE_FIX_SUMMARY.md` - Latest fixes
- `REFACTORING_PLAN.md` - Security & code quality plan
- `EDIT_FORM_FIX_PLAN.md` - Poster preview fix details
- `FEATURE_LIST.md` - All configurable features
- `AGENTS.md` - Complete feature documentation

---

## 🔧 Quick Commands Reference

```bash
# View board
hermes kanban ls

# Show task
hermes kanban show t_a6c3f894

# Complete task
hermes kanban complete t_a6c3f894

# Add comment
hermes kanban comment t_a6c3f894 "Update here"

# Block task
hermes kanban block t_a6c3f894 --reason "Needs input"

# Reclaim stuck task
hermes kanban reclaim t_a6c3f894

# Link dependencies
hermes kanban link t_parent t_child

# View logs
hermes kanban log t_a6c3f894

# Watch task events
hermes kanban watch t_a6c3f894
```

---

## ✅ Success Criteria

**Project Complete When:**
- [ ] All P0 and P1 tasks done
- [ ] No critical security issues
- [ ] All tests passing
- [ ] Documentation complete
- [ ] Site deploys successfully
- [ ] Dashboard fully functional
- [ ] Performance metrics met

---

## 🎬 Next Steps

1. **Start working on P0 tasks** - The dispatcher will automatically assign them to `programmer` profile

2. **Monitor progress** - Use `hermes kanban ls` to see status

3. **Review completions** - Check each task's log when done

4. **Move to P1** - After P0 tasks complete

5. **Iterate** - Block tasks if issues arise, add comments, reassign as needed

---

**Board Created:** May 15, 2026  
**Total Tasks:** 11 (1 master + 10 subtasks)  
**Profiles Involved:** programmer, reviewer, recorder  
**Estimated Timeline:** 3-4 weeks

Let's get this portfolio ship-shape! 🚀🎬
