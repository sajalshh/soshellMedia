import React from "react";
import { Link } from "react-router-dom";
import { categories, recentPostsSidebar, tags } from "../data";

const SidebarWidget = ({ title, children }) => (
  <div className="single-sidebar-widget">
    <div className="wid-title">
      <h3>
        <img src="/assets/img/star-3.png" alt="img" />
        {title}
      </h3>
    </div>
    {children}
  </div>
);

export default function Sidebar() {
  return (
    <div className="main-sidebar">
      <SidebarWidget title="Search">
        <div className="search-widget">
          <form action="#">
            <input type="text" placeholder="Search here" />
            <button type="submit" aria-label="Search">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div>
      </SidebarWidget>

      <SidebarWidget title="Categories">
        <div className="news-widget-categories">
          <ul>
            {categories.map((category) => (
              <li key={category.name}>
                <Link to="/news">{category.name}</Link>{" "}
                <span>({category.count})</span>
              </li>
            ))}
          </ul>
        </div>
      </SidebarWidget>

      <SidebarWidget title="Recent Post">
        <div className="recent-post-area">
          {recentPostsSidebar.map((post) => (
            <div className="recent-items" key={post.id}>
              <div className="recent-thumb">
                <img src={post.imgSrc} alt="img" />
              </div>
              <div className="recent-content">
                <span>digital</span>
                <h6>
                  <Link to={`/news-details/${post.id}`}>{post.title}</Link>
                </h6>
                <ul>
                  <li>
                    <i className="fa-solid fa-calendar-days"></i> {post.date}
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </SidebarWidget>

      <div className="news-banner-img">
        <img src="/assets/img/news/Banner.png" alt="img" />
      </div>

      <SidebarWidget title="Tags Clouds">
        <div className="tagcloud">
          {tags.map((tag) => (
            <Link to="/news" key={tag}>
              {tag}
            </Link>
          ))}
        </div>
      </SidebarWidget>
    </div>
  );
}
