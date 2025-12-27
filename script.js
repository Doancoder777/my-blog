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

// ========== COMMENT SYSTEM ==========
// Thay URL này bằng URL của Google Apps Script sau khi deploy
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzgI4FFguNFDOjmvJ3qYI68n8jFTKEid0kBXoRgasqy6VX-S99I0jAIi_7SM0IGtPY/exec';

// Get current page identifier
function getPageId() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('path') || window.location.pathname;
}

// Submit comment (main or reply)
async function submitComment(parentId = null) {
    const name = document.getElementById('comment-name').value.trim();
    const email = document.getElementById('comment-email').value.trim();
    const text = document.getElementById('comment-text').value.trim();
    const status = document.getElementById('comment-status');
    const button = document.getElementById('submit-comment');
    
    // Validation
    if (!name || !text) {
        status.className = 'error';
        status.textContent = 'Vui lòng nhập tên và nội dung bình luận!';
        return;
    }
    
    // Disable button
    button.disabled = true;
    button.textContent = 'Đang gửi...';
    status.style.display = 'none';
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'add',
                pageId: getPageId(),
                name: name,
                email: email,
                text: text,
                parentId: parentId,
                timestamp: new Date().toISOString()
            })
        });
        
        // Show success
        status.className = 'success';
        status.textContent = '✅ Bình luận đã được gửi thành công!';
        
        // Clear form
        document.getElementById('comment-name').value = '';
        document.getElementById('comment-email').value = '';
        document.getElementById('comment-text').value = '';
        
        // Reload comments after 1 second
        setTimeout(() => {
            loadComments();
            status.style.display = 'none';
        }, 1500);
        
    } catch (error) {
        console.error('Error:', error);
        status.className = 'error';
        status.textContent = '❌ Có lỗi xảy ra. Vui lòng thử lại!';
    } finally {
        button.disabled = false;
        button.textContent = 'Gửi bình luận';
    }
}

// Submit reply to a comment
async function submitReply(commentId) {
    const name = document.getElementById(`reply-name-${commentId}`).value.trim();
    const text = document.getElementById(`reply-text-${commentId}`).value.trim();
    const status = document.getElementById(`reply-status-${commentId}`);
    const button = document.getElementById(`reply-button-${commentId}`);
    
    if (!name || !text) {
        status.className = 'error';
        status.textContent = 'Vui lòng nhập tên và nội dung!';
        return;
    }
    
    button.disabled = true;
    button.textContent = 'Đang gửi...';
    status.style.display = 'none';
    
    try {
        await fetch(SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                action: 'add',
                pageId: getPageId(),
                name: name,
                email: '',
                text: text,
                parentId: commentId,
                timestamp: new Date().toISOString()
            })
        });
        
        status.className = 'success';
        status.textContent = '✅ Trả lời thành công!';
        
        setTimeout(() => {
            loadComments();
        }, 1000);
        
    } catch (error) {
        console.error('Error:', error);
        status.className = 'error';
        status.textContent = '❌ Có lỗi xảy ra!';
    } finally {
        button.disabled = false;
        button.textContent = 'Gửi';
    }
}

// Toggle reply form
function toggleReplyForm(commentId) {
    const form = document.getElementById(`reply-form-${commentId}`);
    const isVisible = form.style.display === 'block';
    
    // Hide all other reply forms
    document.querySelectorAll('.reply-form').forEach(f => f.style.display = 'none');
    
    // Toggle current form
    form.style.display = isVisible ? 'none' : 'block';
    
    if (!isVisible) {
        // Focus on name input
        document.getElementById(`reply-name-${commentId}`).focus();
    }
}

// Load comments for current page
async function loadComments() {
    const commentsList = document.getElementById('comments-list');
    
    if (!commentsList) return;
    
    try {
        const response = await fetch(`${SCRIPT_URL}?action=get&pageId=${encodeURIComponent(getPageId())}`);
        const comments = await response.json();
        
        if (!comments || comments.length === 0) {
            commentsList.innerHTML = '<p style="text-align: center; color: #666;">Chưa có bình luận nào. Hãy là người đầu tiên bình luận! 💬</p>';
            return;
        }
        
        // Organize comments into parent and replies
        const parentComments = comments.filter(c => !c.parentId);
        const repliesMap = {};
        
        comments.forEach(c => {
            if (c.parentId) {
                if (!repliesMap[c.parentId]) repliesMap[c.parentId] = [];
                repliesMap[c.parentId].push(c);
            }
        });
        
        // Sort parent comments by timestamp descending
        parentComments.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        // Render comments with replies
        commentsList.innerHTML = parentComments.map(comment => {
            const commentId = comment.timestamp; // Use timestamp as unique ID
            const replies = repliesMap[commentId] || [];
            
            // Sort replies ascending (oldest first)
            replies.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
            
            return renderComment(comment, commentId, replies);
        }).join('');
        
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML = '<p style="text-align: center; color: #666;">Không thể tải bình luận. Vui lòng thử lại sau.</p>';
    }
}

// Render a single comment with its replies
function renderComment(comment, commentId, replies) {
    const date = new Date(comment.timestamp);
    const isAuthor = String(comment.name).trim() === '35386';
    const displayName = isAuthor ? 'Hữu Đoan' : String(comment.name);
    const avatar = displayName.charAt(0).toUpperCase();
    const dateStr = date.toLocaleDateString('vi-VN', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    
    const repliesHtml = replies.map(reply => {
        const replyDate = new Date(reply.timestamp);
        const isReplyAuthor = String(reply.name).trim() === '35386';
        const replyDisplayName = isReplyAuthor ? 'Hữu Đoan' : String(reply.name);
        const replyAvatar = replyDisplayName.charAt(0).toUpperCase();
        const replyDateStr = replyDate.toLocaleDateString('vi-VN', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        return `
            <div class="comment-reply ${isReplyAuthor ? 'author-comment' : ''}">
                <div class="comment-header">
                    <div class="comment-avatar ${isReplyAuthor ? 'author-avatar' : ''}">${replyAvatar}</div>
                    <div class="comment-meta">
                        <div class="comment-author">
                            ${replyDisplayName}
                            ${isReplyAuthor ? '<span class="author-badge">Tác giả</span>' : ''}
                        </div>
                        <div class="comment-date">${replyDateStr}</div>
                    </div>
                </div>
                <p class="comment-text">${reply.text}</p>
            </div>
        `;
    }).join('');
    
    return `
        <div class="comment-item ${isAuthor ? 'author-comment' : ''}">
            <div class="comment-header">
                <div class="comment-avatar ${isAuthor ? 'author-avatar' : ''}">${avatar}</div>
                <div class="comment-meta">
                    <div class="comment-author">
                        ${displayName}
                        ${isAuthor ? '<span class="author-badge">Tác giả</span>' : ''}
                    </div>
                    <div class="comment-date">${dateStr}</div>
                </div>
            </div>
            <p class="comment-text">${comment.text}</p>
            <button class="reply-button" onclick="toggleReplyForm('${commentId}')">💬 Trả lời</button>
            
            <!-- Reply Form -->
            <div class="reply-form" id="reply-form-${commentId}" style="display: none;">
                <input type="text" id="reply-name-${commentId}" placeholder="Tên của bạn *" required>
                <textarea id="reply-text-${commentId}" placeholder="Nội dung trả lời..." required></textarea>
                <button id="reply-button-${commentId}" onclick="submitReply('${commentId}')">Gửi</button>
                <div id="reply-status-${commentId}"></div>
            </div>
            
            <!-- Replies -->
            ${repliesHtml ? `<div class="comment-replies">${repliesHtml}</div>` : ''}
        </div>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

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