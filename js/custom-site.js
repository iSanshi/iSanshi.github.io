document.addEventListener('DOMContentLoaded', () => {
  initWeChatModal();
  initPublicationPage();
});

function initWeChatModal() {
  const modal = document.querySelector('[data-wechat-modal]');
  const openButton = document.querySelector('[data-wechat-modal-open]');
  if (!modal || !openButton) return;

  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('wechat-modal-open');
  };

  const openModal = () => {
    modal.hidden = false;
    document.body.classList.add('wechat-modal-open');
  };

  openButton.addEventListener('click', openModal);
  modal.querySelectorAll('[data-wechat-modal-close]').forEach((node) => {
    node.addEventListener('click', closeModal);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) {
      closeModal();
    }
  });
}

function initPublicationPage() {
  const configNode = document.getElementById('publication-page-config');
  if (!configNode || !window.location.pathname.includes('/publication/')) return;

  let config = null;
  try {
    config = JSON.parse(configNode.textContent);
    if (typeof config === 'string') {
      config = JSON.parse(config);
    }
  } catch (_) {
    return;
  }

  const authorContainer = document.querySelector('.pub .article-metadata > div');
  const authorLinks = config.author_links || [];
  const authors = config.authors || [];

  if (authorContainer && authors.length) {
    authorContainer.innerHTML = authors.map((name, index) => {
      const label = name === 'admin' ? 'Rongtao Zhang' : name;
      const href = authorLinks[index] || (name === 'admin' ? '/' : '');
      const content = label === 'Rongtao Zhang' ? `<strong class="author-self">${label}</strong>` : label;
      return href ? `<span><a href="${href}">${content}</a></span>` : `<span>${content}</span>`;
    }).join(', ');
  }

  let publicationValue = null;
  document.querySelectorAll('.pub .row').forEach((row) => {
    const heading = row.querySelector('.pub-row-heading');
    if (!heading) return;
    const headingText = heading.textContent.trim();

    if (headingText === 'Type') {
      row.style.display = 'none';
      return;
    }

    if (headingText === 'Publication') {
      publicationValue = row.querySelector('.col-12.col-md-9');
      row.style.display = 'none';
    }
  });

  if (publicationValue) {
    const headerContainer = document.querySelector('.pub .article-container.pt-3');
    const metadata = headerContainer?.querySelector('.article-metadata');
    const buttonRow = headerContainer?.querySelector('.btn-links');

    if (headerContainer && metadata && !headerContainer.querySelector('.pub-header-venue')) {
      const venue = document.createElement('div');
      venue.className = 'pub-header-venue';
      venue.innerHTML = publicationValue.innerHTML;
      headerContainer.insertBefore(venue, buttonRow || metadata.nextSibling);
    }
  }

  const featuredImage = document.querySelector('.pub .featured-image-wrapper img.featured-image, .pub .featured-image-wrapper img');
  if (featuredImage) {
    const basePath = window.location.pathname.replace(/\/$/, '');
    featuredImage.src = `${basePath}/featured.png`;
    featuredImage.removeAttribute('srcset');
    featuredImage.removeAttribute('sizes');
  }
}
