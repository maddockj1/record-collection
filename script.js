// Record Collection Manager - Read-only from JSON
class RecordCollection {
    constructor() {
        this.records = [];
        this.filteredRecords = [];
        this.currentSort = 'artist';
        this.currentGenre = 'all';
        this.currentView = 'grid';
        this.genres = new Set();
        this.init();
    }

    async init() {
        this.showLoading();
        await this.loadRecords();
        this.hideLoading();
        this.extractGenres();
        this.setupEventListeners();
        this.renderRecords();
        this.updateStats();
    }

    async loadRecords() {
        try {
            const response = await fetch('data.json');
            if (!response.ok) {
                throw new Error('Failed to load data.json');
            }
            this.records = await response.json();
            this.filteredRecords = [...this.records];
        } catch (error) {
            console.error('Error loading records:', error);
            this.records = [];
            this.filteredRecords = [];
        }
    }

    extractGenres() {
        this.genres.clear();
        this.records.forEach(record => {
            if (record.genre) {
                this.genres.add(record.genre);
            }
        });
        this.renderGenreButtons();
    }

    renderGenreButtons() {
        const container = document.getElementById('genre-buttons');
        const sortedGenres = Array.from(this.genres).sort();
        container.innerHTML = sortedGenres.map(genre => 
            `<button class="genre-btn" data-genre="${this.escapeHtml(genre)}">${this.escapeHtml(genre)}</button>`
        ).join('');
        
        // Re-attach event listeners
        document.querySelectorAll('.genre-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const genre = e.target.dataset.genre;
                this.filterByGenre(genre);
            });
        });
    }

    setupEventListeners() {
        // Search with debouncing
        const searchInput = document.getElementById('search-input');
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.filterRecords(e.target.value);
            }, 300);
        });

        // Sort
        const sortSelect = document.getElementById('sort-select');
        sortSelect.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applyFiltersAndSort();
        });

        // View toggle
        document.getElementById('grid-view-btn').addEventListener('click', () => {
            this.setView('grid');
        });
        document.getElementById('list-view-btn').addEventListener('click', () => {
            this.setView('list');
        });
    }

    filterByGenre(genre) {
        this.currentGenre = genre;
        
        // Update active button
        document.querySelectorAll('.genre-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.genre === genre);
        });
        
        this.applyFiltersAndSort();
    }

    filterRecords(searchTerm) {
        const term = searchTerm.toLowerCase().trim();
        this.searchTerm = term;
        this.applyFiltersAndSort();
    }

    applyFiltersAndSort() {
        // Apply search filter
        let filtered = this.records;
        if (this.searchTerm) {
            filtered = filtered.filter(record => {
                const artist = (record.artist || '').toLowerCase();
                const album = (record.album || '').toLowerCase();
                return artist.includes(this.searchTerm) || album.includes(this.searchTerm);
            });
        }

        // Apply genre filter
        if (this.currentGenre !== 'all') {
            filtered = filtered.filter(record => record.genre === this.currentGenre);
        }

        // Apply sorting
        filtered = this.sortRecords(filtered);
        
        this.filteredRecords = filtered;
        this.renderRecords();
        this.updateStats();
    }

    sortRecords(records) {
        const sorted = [...records];
        const [field, direction] = this.currentSort.includes('-desc') 
            ? [this.currentSort.replace('-desc', ''), 'desc']
            : [this.currentSort, 'asc'];

        sorted.sort((a, b) => {
            let aVal = a[field] || '';
            let bVal = b[field] || '';

            // Handle numeric sorting for year
            if (field === 'year') {
                aVal = parseInt(aVal) || 0;
                bVal = parseInt(bVal) || 0;
                return direction === 'asc' ? aVal - bVal : bVal - aVal;
            }

            // String sorting
            aVal = String(aVal).toLowerCase();
            bVal = String(bVal).toLowerCase();
            
            if (direction === 'asc') {
                return aVal.localeCompare(bVal);
            } else {
                return bVal.localeCompare(aVal);
            }
        });

        return sorted;
    }

    setView(view) {
        this.currentView = view;
        const container = document.getElementById('records-container');
        const gridBtn = document.getElementById('grid-view-btn');
        const listBtn = document.getElementById('list-view-btn');
        
        container.className = view === 'grid' ? 'records-grid' : 'records-list';
        gridBtn.classList.toggle('active', view === 'grid');
        listBtn.classList.toggle('active', view === 'list');
        
        // Re-render to apply view-specific changes
        this.renderRecords();
    }

    renderRecords() {
        const container = document.getElementById('records-container');
        const emptyState = document.getElementById('empty-state');
        const emptyStateContent = document.getElementById('empty-state-content');

        if (this.records.length === 0) {
            container.innerHTML = '';
            emptyStateContent.innerHTML = '<p>No records found in collection.</p>';
            emptyState.classList.add('show');
            return;
        }

        if (this.filteredRecords.length === 0) {
            container.innerHTML = '';
            emptyStateContent.innerHTML = `
                <p>No records match your search or filter.</p>
                <p class="empty-state-hint">Try adjusting your search or selecting a different genre.</p>
            `;
            emptyState.classList.add('show');
            return;
        }

        emptyState.classList.remove('show');
        container.innerHTML = this.filteredRecords.map(record => this.createRecordCard(record)).join('');
        
        // Setup lazy loading for images
        this.setupLazyLoading();
    }

    createRecordCard(record) {
        const albumCover = record.albumCover || record.cover || '';
        const isListView = this.currentView === 'list';
        
        return `
            <div class="record-card" data-id="${record.id}" data-artist="${this.escapeHtml(record.artist)}" data-album="${this.escapeHtml(record.album)}" data-genre="${this.escapeHtml(record.genre || '')}">
                ${albumCover ? `
                    <div class="album-cover-wrapper">
                        <img data-src="${this.escapeHtml(albumCover)}" alt="${this.escapeHtml(record.album)}" class="album-cover lazy" onerror="this.style.display='none'; this.parentElement.classList.add('no-cover');">
                        <div class="album-cover-placeholder"></div>
                    </div>
                ` : '<div class="album-cover-wrapper no-cover"><div class="album-cover-placeholder"></div></div>'}
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

    setupLazyLoading() {
        const lazyImages = document.querySelectorAll('img.lazy');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            lazyImages.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for browsers without IntersectionObserver
            lazyImages.forEach(img => {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
            });
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    updateStats() {
        const total = this.records.length;
        const showing = this.filteredRecords.length;
        const countText = showing === total 
            ? `${total} record${total !== 1 ? 's' : ''}`
            : `Showing ${showing} of ${total} record${total !== 1 ? 's' : ''}`;
        document.getElementById('record-count').textContent = countText;
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
