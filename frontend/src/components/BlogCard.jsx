import { useState } from 'react';
import { Heart, ExternalLink, Calendar } from 'lucide-react';

const BlogCard = ({ blog, detailed = false, isHome = false }) => {
  const [hovered, setHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    if (isHome) {
      setExpanded(!expanded);
    }
  };

  const isDetailed = isHome ? expanded : detailed;

  const previewContent = blog.content.length > 120
    ? blog.content.substring(0, 120) + '...'
    : blog.content;

  const dateStr = new Date(blog.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric'
  });

  const [liked, setLiked] = useState(() => {
    // Check localStorage for liked state
    const stored = localStorage.getItem(`blog_liked_${blog.id || blog._id}`);
    return stored === 'true' || blog.liked || false;
  });
  const [likeCount, setLikeCount] = useState(blog.likes || 0);
  const [likeLoading, setLikeLoading] = useState(false);

  const handleToggleLike = async (e) => {
    if (e) e.stopPropagation();
    if (likeLoading) return;
    setLikeLoading(true);
    try {
      const blogId = blog.id || blog._id;
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/blog/like/${blogId}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setLikeCount(data.likes);
        localStorage.setItem(`blog_liked_${blogId}`, data.liked.toString());
      }
    } catch (err) {
      console.error('Like failed:', err);
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col py-5 my-1 border-t border-black dark:border-white transition-all duration-300 relative ${isHome ? 'cursor-pointer hover:bg-black/[0.03] dark:hover:bg-white/[0.03] px-2 -mx-2' : ''
        }`}
    >
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex flex-col flex-1">
          <h3 className="font-semibold text-[15px]">
            {blog.title}
          </h3>
          <p className={`text-[13px] text-muted mt-2 leading-relaxed ${isDetailed ? 'whitespace-pre-line' : ''}`}>
            {isDetailed ? blog.content : previewContent}
          </p>
        </div>

        <div className="flex flex-col items-start sm:items-end mt-1 sm:mt-0 text-[12px] text-muted gap-2 shrink-0">
          <div className="flex items-center gap-1.5 font-medium">
            <Calendar size={13} />
            <span>{dateStr}</span>
          </div>
          {blog.links && blog.links.length > 0 && (
            <div className="flex flex-col items-start sm:items-end gap-1 mt-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-main)] opacity-80">Sources</span>
              {blog.links.map((link, idx) => (
                <a
                  key={idx}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-[var(--text-main)] transition-colors text-[12px]"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={12} />
                  <span>{link.replace(/^https?:\/\/(www\.)?/, '')}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            disabled={likeLoading}
            className={`flex items-center gap-1.5 text-[12px] font-medium transition-all duration-200 neo-button-sm !py-1.5 !px-3 ${liked
                ? 'text-red-500'
                : 'text-muted hover:text-red-400'
              }`}
          >
            <Heart size={14} fill={liked ? 'currentColor' : 'none'} />
            <span>{likeCount}</span>
          </button>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="flex gap-1.5 text-[11px] text-muted">
              {blog.tags.map(tag => (
                <span key={tag} className="opacity-70">#{tag}</span>
              ))}
            </div>
          )}
        </div>
      </div>

      {isHome && hovered && (
        <span className="absolute bottom-2 right-4 text-[11px] text-[var(--accent)] font-medium animate-pulse">
          {expanded ? '← Collapse' : '→ Open Full'}
        </span>
      )}
    </div>
  );
};

export default BlogCard;
