// Tải danh sách bài viết từ nhiều JSON files
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
        displayPosts(uniquePosts);
    } catch (e) {
        console.error("Lỗi khi tải posts:", e);
    }
}

// Hàm loại bỏ duplicate posts
function deduplicatePosts(posts) {
    const uniquePosts = [];
    const seenTitles = new Set();
    
    for (const post of posts) {
        if (!seenTitles.has(post.title)) {
            seenTitles.add(post.title);
            uniquePosts.push(post);
        }
    }
    
    return uniquePosts;
}

// Hiển thị danh sách bài viết
function displayPosts(posts) {
    const container = document.getElementById('post-list');
    if (!container) return;
    container.innerHTML = posts.map(post => `
        <div class="post-card">
            <h2>${post.featured ? '⭐ ' : ''}${post.title}</h2>
            <p><small>${post.date} | Danh mục: ${post.category}</small></p>
            <p>${post.summary}</p>
            <a href="${post.category === 'LO_TRINH' ? 'lo-trinh-detail.html' : 'post-detail.html'}?path=${post.path}" style="color: #1abc9c; font-weight: bold;">Đọc chi tiết →</a>
        </div>
    `).join('');
}

// Lọc bài viết theo Menu
function filterPosts(category) {
    if (category === 'ALL') {
        // Hiển thị tất cả, có deduplicate
        displayPosts(window.allPosts);
    } else if (category === 'BAI_VIET_HAY') {
        // Hiển thị tất cả bài có featured = true
        const featured = window.allPostsRaw.filter(p => p.featured === true);
        displayPosts(featured);
    } else {
        // Filter từ raw data, không deduplicate trong category
        const filtered = window.allPostsRaw.filter(p => p.category === category);
        displayPosts(filtered);
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
            
            // Convert YouTube shortcode to HTML embed
            // Format: {{youtube:VIDEO_ID}} hoặc {{youtube:VIDEO_ID|Title}}
            text = text.replace(/\{\{youtube:([a-zA-Z0-9_-]+)(?:\|([^}]+))?\}\}/g, (match, videoId, title) => {
                const videoTitle = title || 'YouTube Video';
                return `<div class="video-container">
<iframe width="100%" height="400" src="https://www.youtube.com/embed/${videoId}" title="${videoTitle}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>`;
            });
            
            contentArea.innerHTML = marked.parse(text);
            
            // Kích hoạt tô màu code
            if (window.Prism) Prism.highlightAll();
            
            // Add copy buttons to code blocks
            addCopyButtons();
        } catch (e) {
            contentArea.innerHTML = "<h2>Lỗi: Không tìm thấy nội dung bài viết.</h2>";
        }
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