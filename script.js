// Tải danh sách bài viết từ nhiều JSON files
const POSTS_PER_PAGE = 6; // Số bài viết mỗi trang
let currentPage = 1;
let currentCategory = 'ALL';
let searchQuery = '';

async function loadPosts() {
    try {
        const files = [
            'data/posts/kien-thuc.json',
            'data/posts/kinh-nghiem.json',
            'data/posts/goc-cong-nghe.json',
            'data/posts/lo-trinh.json'
        ];
        
        const allPosts = [];
        for (const file of files) {
            try {
                const response = await fetch(file);
                const posts = await response.json();
                allPosts.push(...posts);
            } catch (e) {
                console.warn(`Không thể tải ${file}:`, e);
            }
        }
        
        // Lưu toàn bộ posts (không deduplicate)
        window.allPostsRaw = allPosts;
        
        // Loại bỏ duplicate chỉ khi hiển thị ALL
        const uniquePosts = deduplicatePosts(allPosts);
        window.allPosts = uniquePosts;
        
        // Update total posts count
        updateSearchStats(uniquePosts.length);
        
        displayPosts(uniquePosts, 1);
    } catch (e) {
        console.error("Lỗi khi tải posts:", e);
    }
}

// Hàm loại bỏ duplicate posts và sắp xếp (bài ghim lên đầu)
function deduplicatePosts(posts) {
    const uniquePosts = [];
    const seenTitles = new Set();
    
    for (const post of posts) {
        if (!seenTitles.has(post.title)) {
            seenTitles.add(post.title);
            uniquePosts.push(post);
        }
    }
    
    // Sắp xếp theo ngày (mới nhất lên đầu)
    uniquePosts.sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/');
        const [dayB, monthB, yearB] = b.date.split('/');
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateB - dateA;
    });
    
    return uniquePosts;
}

// Hiển thị danh sách bài viết với phân trang
function displayPosts(posts, page = 1, shouldScroll = false) {
    const container = document.getElementById('post-list');
    if (!container) return;
    
    currentPage = page;
    const start = (page - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;
    const postsToShow = posts.slice(start, end);
    
    container.innerHTML = postsToShow.map(post => {
        const url = post.category === 'LO_TRINH' ? 'lo-trinh-detail.html' : 'post-detail.html';
        return `
        <div class="post-card" onclick="window.location.href='${url}?path=${post.path}'">
            <div class="post-meta">
                <span class="post-date">📅 ${post.date}</span>
                <span class="post-category">${post.category}</span>
            </div>
            <h2>${post.featured ? '⭐ ' : ''}${post.title}</h2>
            <p class="post-summary">${post.summary}</p>
            <span class="read-more">Xem thêm →</span>
        </div>
    `;
    }).join('');
    
    // Hiển thị phân trang
    renderPagination(posts.length, page);
    
    // Chỉ scroll lên đầu khi chuyển trang hoặc search
    if (shouldScroll) {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Render phân trang
function renderPagination(totalPosts, currentPage) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
    
    // Không hiển thị pagination nếu chỉ có 1 trang
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let html = '<div class="pagination-buttons">';
    
    // Nút Previous
    if (currentPage > 1) {
        html += `<button onclick="changePage(${currentPage - 1})" class="page-btn">« Trước</button>`;
    }
    
    // Các nút số trang
    for (let i = 1; i <= totalPages; i++) {
        // Hiển thị: 1 ... 4 5 [6] 7 8 ... 20
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button onclick="changePage(${i})" class="page-btn ${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += `<span class="page-dots">...</span>`;
        }
    }
    
    // Nút Next
    if (currentPage < totalPages) {
        html += `<button onclick="changePage(${currentPage + 1})" class="page-btn">Sau »</button>`;
    }
    
    html += '</div>';
    html += `<p class="pagination-info">Trang ${currentPage} / ${totalPages} (${totalPosts} bài viết)</p>`;
    
    paginationContainer.innerHTML = html;
}

// Chuyển trang
function changePage(page) {
    if (currentCategory === 'ALL') {
        displayPosts(window.allPosts, page, true);
    } else if (currentCategory === 'BAI_VIET_HAY') {
        const featured = window.allPostsRaw.filter(p => p.featured === true);
        displayPosts(featured, page, true);
    } else {
        const filtered = window.allPostsRaw.filter(p => p.category === currentCategory);
        displayPosts(filtered, page, true);
    }
}

// Search posts
function searchPosts(query) {
    searchQuery = query.toLowerCase().trim();
    currentPage = 1;
    
    let posts = currentCategory === 'ALL' ? window.allPosts : 
                currentCategory === 'BAI_VIET_HAY' ? window.allPostsRaw.filter(p => p.featured === true) :
                window.allPostsRaw.filter(p => p.category === currentCategory);
    
    if (searchQuery) {
        posts = posts.filter(post => 
            post.title.toLowerCase().includes(searchQuery) ||
            post.summary.toLowerCase().includes(searchQuery) ||
            post.category.toLowerCase().includes(searchQuery)
        );
    }
    
    updateSearchStats(posts.length);
    displayPosts(posts, 1, true);
}

// Update search stats
function updateSearchStats(count) {
    const totalEl = document.getElementById('total-posts');
    const statsEl = document.getElementById('search-stats');
    
    if (totalEl) {
        totalEl.textContent = count;
    }
    
    if (statsEl && searchQuery) {
        statsEl.innerHTML = `Tìm thấy: <strong>${count}</strong> bài viết`;
    } else if (statsEl) {
        statsEl.innerHTML = `Tổng: <strong id="total-posts">${count}</strong> bài viết`;
    }
}

// Lọc bài viết theo Menu
function filterPosts(category) {
    currentCategory = category;
    searchQuery = '';
    document.getElementById('search-input').value = '';
    
    if (category === 'ALL') {
        // Hiển thị tất cả, có deduplicate
        updateSearchStats(window.allPosts.length);
        displayPosts(window.allPosts, 1, false);
    } else if (category === 'BAI_VIET_HAY') {
        // Hiển thị tất cả bài có featured = true
        const featured = window.allPostsRaw.filter(p => p.featured === true);
        updateSearchStats(featured.length);
        displayPosts(featured, 1, false);
    } else {
        // Filter từ raw data, không deduplicate trong category
        const filtered = window.allPostsRaw.filter(p => p.category === category);
        updateSearchStats(filtered.length);
        displayPosts(filtered, 1, false);
    }
}

// Render nội dung Markdown
async function renderMarkdown() {
    const params = new URLSearchParams(window.location.search);
    const path = params.get('path');
    const contentArea = document.getElementById('post-content');
    
    if (path && contentArea) {
        try {
            const response = await fetch(path);
            let text = await response.text();
            
            // Fix image paths - Convert relative paths to absolute from root
            text = text.replace(/!\[([^\]]*)\]\(\.\.\/\.\.\/assets\//g, '![$1](assets/');
            text = text.replace(/!\[([^\]]*)\]\(\.\.\/\.\.\/\.\.\/assets\//g, '![$1](assets/');
            
            // Convert YouTube shortcode to HTML embed with unique IDs
            // Format: {{youtube:VIDEO_ID}} hoặc {{youtube:VIDEO_ID|Title}}
            let videoCounter = 0;
            text = text.replace(/\{\{youtube:([a-zA-Z0-9_-]+)(?:\|([^}]+))?\}\}/g, (match, videoId, title) => {
                const videoTitle = title || 'YouTube Video';
                const iframeId = `youtube-player-${videoCounter++}`;
                return `<div class="video-container">
<iframe id="${iframeId}" width="100%" height="400" src="https://www.youtube.com/embed/${videoId}?enablejsapi=1" title="${videoTitle}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`;
            });
            
            contentArea.innerHTML = marked.parse(text);
            
            // Initialize YouTube player control
            initYouTubePlayers();
            
            // Kích hoạt tô màu code
            if (window.Prism) Prism.highlightAll();
            
            // Add copy buttons to code blocks
            addCopyButtons();
        } catch (e) {
            contentArea.innerHTML = "<h2>Lỗi: Không tìm thấy nội dung bài viết.</h2>";
        }
    }
}

// Initialize YouTube players to auto-pause others when one plays
let youtubePlayers = [];

function onYouTubeIframeAPIReady() {
    const iframes = document.querySelectorAll('iframe[id^="youtube-player-"]');
    
    iframes.forEach((iframe, index) => {
        const player = new YT.Player(iframe.id, {
            events: {
                'onStateChange': function(event) {
                    // When this video starts playing (state 1)
                    if (event.data === YT.PlayerState.PLAYING) {
                        // Pause all other videos
                        youtubePlayers.forEach((p, i) => {
                            if (i !== index && p.getPlayerState() === YT.PlayerState.PLAYING) {
                                p.pauseVideo();
                            }
                        });
                    }
                }
            }
        });
        youtubePlayers.push(player);
    });
}

function initYouTubePlayers() {
    // Wait for API to be ready
    if (typeof YT !== 'undefined' && YT.Player) {
        onYouTubeIframeAPIReady();
    } else {
        // API not ready yet, wait for it
        window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;
    }
}

// Add copy buttons to all code blocks
function addCopyButtons() {
    const codeBlocks = document.querySelectorAll('pre');
    
    codeBlocks.forEach((block) => {
        // Create copy button
        const button = document.createElement('button');
        button.className = 'copy-button';
        button.textContent = 'Copy';
        
        // Add click event
        button.addEventListener('click', () => {
            const code = block.querySelector('code');
            const text = code.textContent;
            
            // Copy to clipboard
            navigator.clipboard.writeText(text).then(() => {
                // Change button text
                button.textContent = 'Copied';
                button.classList.add('copied');
                
                // Reset after 2 seconds
                setTimeout(() => {
                    button.textContent = 'Copy';
                    button.classList.remove('copied');
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy:', err);
                button.textContent = 'Error';
            });
        });
        
        // Add button to code block
        block.style.position = 'relative';
        block.appendChild(button);
    });
}

// Khởi chạy
if (document.getElementById('post-list')) window.onload = loadPosts;

// Hero Slider Animation
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

if (slides.length > 0) {
    function nextSlide() {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    // Change slide every 4 seconds
    setInterval(nextSlide, 4000);
}