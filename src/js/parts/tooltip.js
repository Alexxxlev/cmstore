const labels = document.querySelectorAll('[data-tooltip]');

labels.forEach(label => {
  label.addEventListener('mouseenter', showTooltip);
  label.addEventListener('touchstart', el=>{
      if(!el.target.classList.contains('tooltip-no-touch')) {
        el.preventDefault()
      }
      showTooltip(el)
  });
  label.addEventListener('mouseleave', hideTooltip);
});

function showTooltip(event) {
  if ((window.innerWidth >= 1024 || !event.target.classList.contains('tooltip-no-touch'))) {
    document.querySelectorAll('.tooltip').forEach(tooltip => tooltip.remove());

    const label = event.target;
    const tooltipText = label.dataset.tooltip || ''; 

    if (tooltipText) { 
      const tooltip = createTooltip(label.dataset.title, label.dataset.class, tooltipText);
      document.body.appendChild(tooltip);
      setPosition(event, tooltip);
      setTimeout(() => tooltip.style.opacity = '1', 10);
      setTimeout(() => tooltip.style.transform = 'translateY(0px)', 10);
      const bg = createBackground();
      document.body.appendChild(bg);
      tooltip.addEventListener('mouseout', () => hideTooltip(tooltip));
      bg.addEventListener('click', hideTooltip);
    }
  }
}

function hideTooltip(event) {
  if(document.querySelectorAll('.tooltip').length) {
    const tooltip = document.querySelector('.tooltip');
    const bg = document.querySelector('.tooltip__bg');

    if (!tooltip || !event.relatedTarget || !tooltip.contains(event.relatedTarget)) {
      tooltip.style.opacity = '0';
      setTimeout(() => tooltip.remove(), 300);
    }

    if (bg) {
      bg.style.opacity = '0';
      setTimeout(() => bg.remove(), 300);
    }
  }
}

function setPosition(event, tooltip) {
  const labelRect = event.target.getBoundingClientRect();
  const screenWidth = window.innerWidth;
  const tooltipWidth = tooltip.offsetWidth;
  const tooltipLeft = labelRect.left + window.pageXOffset + labelRect.width / 2 - tooltipWidth / 2;

  tooltip.style.left = Math.max(0, Math.min(screenWidth - tooltipWidth, tooltipLeft)) + 'px'; // Constrain to viewport
  tooltip.style.top = (labelRect.top + window.pageYOffset + labelRect.height + 14) + 'px';
}

function createTooltip(text, dataClass, tooltipText) {
  const tooltip = document.createElement('div');
  tooltip.classList.add('tooltip');
  console.log(text)
  if (text) {
    const titleElement = document.createElement('p');
    titleElement.classList.add('tooltip__title');
    titleElement.textContent = text;
    tooltip.appendChild(titleElement);
  }else {
    tooltip.classList.add('_no-title')
  }

  // Add content from data-tooltip
  if (tooltipText) {
    const textElement = document.createElement('p');
    textElement.classList.add('tooltip__text');
    textElement.innerHTML = tooltipText;
    tooltip.appendChild(textElement);
  }

  const closeLink = document.createElement('a');
  closeLink.classList.add('tooltip__close');
  closeLink.innerHTML = `
    <svg width="24" height="24">
      <use xlink:href="img/sprite.svg#icon-close"></use>
    </svg>
  `;
  closeLink.addEventListener('click', hideTooltip);
  tooltip.appendChild(closeLink);

  if (dataClass) {
    tooltip.classList.add(dataClass);
  }

  return tooltip;
}

function createBackground() {
  const bg = document.createElement('div');
  bg.classList.add('tooltip__bg');
  return bg;
}
