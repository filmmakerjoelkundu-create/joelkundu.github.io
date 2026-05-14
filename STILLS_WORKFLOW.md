# Stills Management Workflow

## Architecture

### Single Source of Truth
- ALL stills stored in: `config.gallery.projects[].stills`
- Selected Works references gallery projects (no duplicate stills)
- Hero Background selects from unified gallery stills pool

### Data Flow
```\nGallery Project (Master)\n├── Project Metadata (name, director, camera, etc.)\n├── Stills Array [src, alt, type: 'still'|'bts']\n└── selectedWorksId (if promoted)\n\nSelected Works Project\n├── Full Crew Metadata\n├── galleryProjectId (links to gallery)\n└── Uses gallery stills (no duplication)\n```\n\n## Workflows

### Workflow 1: Add New Project with Stills
1. Go to Gallery section\n2. Click "+ Add Project"\n3. Upload stills/BTS images with metadata\n4. Project appears in Gallery with filters\n5. Optionally promote to Selected Works

### Workflow 2: Add to Selected Works Directly
1. Go to Selected Works section\n2. Click "+ Add Project"\n3. Upload stills (stored in gallery automatically)\n4. Add full crew metadata\n5. Project appears in both Gallery and Selected Works

### Workflow 3: Promote Gallery Project to Selected Works
1. In Gallery, click project\n2. Click "Promote to Selected Works"\n3. Add crew details (Director, Producer, etc.)\n4. Project now in Selected Works with same stills

### Workflow 4: Hero Background Selection
1. Go to Dashboard → Hero section\n2. "Hero Background Slideshow" card\n3. See ALL stills from Gallery (grid view)\n4. Click to select/deselect\n5. Live site randomly picks 10 from selected\n6. Falls back to random if none selected

## Implementation Tasks

### Phase 1: Fix Gallery Still Upload
- [ ] Add still/BTS upload to Gallery Project Modal
- [ ] Support multiple file upload
- [ ] Tag stills as 'still' or 'bts'
- [ ] Preview before upload

### Phase 2: Sync Selected Works with Gallery
- [ ] When adding SW project, check if gallery project exists
- [ ] If exists: link to gallery, add crew metadata
- [ ] If not: create gallery project, then link
- [ ] SW uses gallery stills (no duplication)

### Phase 3: Fix Hero Background Selector
- [ ] Fix render bug (not showing until select all)
- [ ] Show all gallery stills in grid
- [ ] Click to toggle selection
- [ ] Save to config.hero.backgroundStills

### Phase 4: Import Portfolio Data
- [ ] Scan /mnt/c/Users/kundu/Desktop/Portfolio Data\n- [ ] Parse project folders
- [ ] Extract stills and posters
- [ ] Create gallery projects
- [ ] Promote to Selected Works where applicable

## Testing
- [ ] Add still in Gallery → appears in Hero selector
- [ ] Add still in SW → appears in Gallery
- [ ] Promote Gallery→SW → stills sync
- [ ] Hero BG selects 10 random from chosen
- [ ] Filter Gallery by project/type
- [ ] Import Portfolio Data projects
