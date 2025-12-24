// Record Collection Manager
class RecordCollection {
    constructor() {
        this.records = [];
        this.editingId = null;
        this.loading = true;
        this.init();
    }

    async init() {
        this.showLoading();
        await this.loadRecords();
        this.hideLoading();
        this.renderRecords();
        this.setupEventListeners();
        this.updateStats();
        this.loading = false;
    }

    async loadRecords() {
        try {
            // Load from JSON file
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('Failed to load data.json');
            }
            const jsonData = await response.json();
            
            // Check if there are local overrides (user changes)
            const localOverrides = localStorage.getItem('vinylRecords');
            if (localOverrides) {
                const localData = JSON.parse(localOverrides);
                // Merge: use local data if it exists, otherwise use JSON data
                // If local data has records, use it (user has made changes)
                if (localData && localData.length > 0) {
                    this.records = localData;
                } else {
                    this.records = jsonData;
                }
            } else {
                this.records = jsonData;
            }
        } catch (error) {
            console.error('Error loading records:', error);
            // Fallback to localStorage if JSON file doesn't exist
            const stored = localStorage.getItem('vinylRecords');
            this.records = stored ? JSON.parse(stored) : [];
        }
    }

    saveRecords() {
        // Save to localStorage as override/cache
        localStorage.setItem('vinylRecords', JSON.stringify(this.records));
        this.updateStats();
    }

    setupEventListeners() {
        // Add record form
        const form = document.getElementById('record-form');
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addRecord();
        });

        // Edit form
        const editForm = document.getElementById('edit-form');
        editForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEdit();
        });

        // Search
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            this.filterRecords(e.target.value);
        });

        // Modal close
        const modal = document.getElementById('edit-modal');
        const closeBtn = document.querySelector('.close');
        const cancelBtn = document.getElementById('cancel-edit');

        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });

        cancelBtn.addEventListener('click', () => {
            this.closeModal();
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeModal();
            }
        });

        // Export JSON button
        const exportBtn = document.getElementById('export-btn');
        exportBtn.addEventListener('click', () => {
            this.exportToJSON();
        });
    }

    addRecord() {
        const form = document.getElementById('record-form');
        const formData = new FormData(form);

        const record = {
            id: Date.now().toString(),
            artist: formData.get('artist').trim(),
            album: formData.get('album').trim(),
            year: formData.get('year') || null,
            genre: formData.get('genre').trim() || null,
            condition: formData.get('condition'),
            notes: formData.get('notes').trim() || null,
            dateAdded: new Date().toISOString()
        };

        this.records.unshift(record);
        this.saveRecords();
        this.renderRecords();
        form.reset();
    }

    editRecord(id) {
        const record = this.records.find(r => r.id === id);
        if (!record) return;

        this.editingId = id;
        document.getElementById('edit-id').value = id;
        document.getElementById('edit-artist').value = record.artist;
        document.getElementById('edit-album').value = record.album;
        document.getElementById('edit-year').value = record.year || '';
        document.getElementById('edit-genre').value = record.genre || '';
        document.getElementById('edit-condition').value = record.condition;
        document.getElementById('edit-notes').value = record.notes || '';

        this.openModal();
    }

    saveEdit() {
        const id = document.getElementById('edit-id').value;
        const record = this.records.find(r => r.id === id);
        if (!record) return;

        const form = document.getElementById('edit-form');
        const formData = new FormData(form);

        record.artist = formData.get('artist').trim();
        record.album = formData.get('album').trim();
        record.year = formData.get('year') || null;
        record.genre = formData.get('genre').trim() || null;
        record.condition = formData.get('condition');
        record.notes = formData.get('notes').trim() || null;

        this.saveRecords();
        this.renderRecords();
        this.closeModal();
    }

    deleteRecord(id) {
        if (confirm('Are you sure you want to delete this record?')) {
            this.records = this.records.filter(r => r.id !== id);
            this.saveRecords();
            this.renderRecords();
        }
    }

    filterRecords(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        const cards = document.querySelectorAll('.record-card');
        let visibleCount = 0;

        cards.forEach(card => {
            const artist = card.dataset.artist.toLowerCase();
            const album = card.dataset.album.toLowerCase();
            const matches = !term || artist.includes(term) || album.includes(term);
            card.style.display = matches ? 'block' : 'none';
            if (matches) visibleCount++;
        });

        const emptyState = document.getElementById('empty-state');
        emptyState.classList.toggle('show', visibleCount === 0 && this.records.length > 0);
    }

    renderRecords(filteredRecords = null) {
        const container = document.getElementById('records-container');
        const emptyState = document.getElementById('empty-state');
        const recordsToRender = filteredRecords || this.records;

        if (recordsToRender.length === 0) {
            container.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        container.innerHTML = recordsToRender.map(record => this.createRecordCard(record)).join('');

        // Re-attach event listeners
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.record-card').dataset.id;
                this.editRecord(id);
            });
        });

        document.querySelectorAll('.btn-danger').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.closest('.record-card').dataset.id;
                this.deleteRecord(id);
            });
        });
    }

    createRecordCard(record) {
        return `
            <div class="record-card" data-id="${record.id}" data-artist="${this.escapeHtml(record.artist)}" data-album="${this.escapeHtml(record.album)}">
                <h3>${this.escapeHtml(record.album)}</h3>
                <p class="artist">${this.escapeHtml(record.artist)}</p>
                <div class="record-details">
                    ${record.year ? `<div class="record-detail"><strong>Year:</strong> ${record.year}</div>` : ''}
                    ${record.genre ? `<div class="record-detail"><strong>Genre:</strong> ${record.genre}</div>` : ''}
                    <div class="record-detail">
                        <strong>Condition:</strong>
                        <span class="condition-badge condition-${this.escapeHtml(record.condition)}">${this.escapeHtml(record.condition)}</span>
                    </div>
                    ${record.notes ? `<div class="record-detail"><strong>Notes:</strong> ${this.escapeHtml(record.notes)}</div>` : ''}
                </div>
                <div class="card-actions">
                    <button class="btn btn-edit">Edit</button>
                    <button class="btn btn-danger">Delete</button>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        const count = this.records.length;
        document.getElementById('record-count').textContent = `${count} record${count !== 1 ? 's' : ''}`;
    }

    openModal() {
        const modal = document.getElementById('edit-modal');
        modal.classList.add('show');
    }

    closeModal() {
        const modal = document.getElementById('edit-modal');
        modal.classList.remove('show');
        this.editingId = null;
        document.getElementById('edit-form').reset();
    }

    exportToJSON() {
        const dataStr = JSON.stringify(this.records, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.json';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    showLoading() {
        const loadingState = document.getElementById('loading-state');
        const recordsContainer = document.getElementById('records-container');
        if (loadingState) loadingState.classList.add('show');
        if (recordsContainer) recordsContainer.classList.add('hidden');
    }

    hideLoading() {
        const loadingState = document.getElementById('loading-state');
        const recordsContainer = document.getElementById('records-container');
        if (loadingState) loadingState.classList.remove('show');
        if (recordsContainer) recordsContainer.classList.remove('hidden');
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
    new RecordCollection();
});

