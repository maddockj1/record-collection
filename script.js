// Record Collection Manager - Read-only from JSON
class RecordCollection {
    constructor() {
        this.records = [];
        this.init();
    }

    async init() {
        this.showLoading();
        await this.loadRecords();
        this.hideLoading();
        this.renderRecords();
        this.setupEventListeners();
        this.updateStats();
    }

    async loadRecords() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('Failed to load data.json');
            }
            this.records = await response.json();
        } catch (error) {
            console.error('Error loading records:', error);
            this.records = [];
        }
    }

    setupEventListeners() {
        // Search
        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', (e) => {
            this.filterRecords(e.target.value);
        });
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

    renderRecords() {
        const container = document.getElementById('records-container');
        const emptyState = document.getElementById('empty-state');

        if (this.records.length === 0) {
            container.innerHTML = '';
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        container.innerHTML = this.records.map(record => this.createRecordCard(record)).join('');
    }

    createRecordCard(record) {
        const albumCover = record.albumCover || record.cover || '';
        return `
            <div class="record-card" data-id="${record.id}" data-artist="${this.escapeHtml(record.artist)}" data-album="${this.escapeHtml(record.album)}">
                ${albumCover ? `<img src="${this.escapeHtml(albumCover)}" alt="${this.escapeHtml(record.album)}" class="album-cover" onerror="this.style.display='none'">` : ''}
                <div class="record-info">
                    <h3>${this.escapeHtml(record.album)}</h3>
                    <p class="artist">${this.escapeHtml(record.artist)}</p>
                    <div class="record-details">
                        ${record.year ? `<div class="record-detail"><strong>Year:</strong> ${record.year}</div>` : ''}
                        ${record.genre ? `<div class="record-detail"><strong>Genre:</strong> ${record.genre}</div>` : ''}
                    </div>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        const count = this.records.length;
        document.getElementById('record-count').textContent = `${count} record${count !== 1 ? 's' : ''}`;
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
