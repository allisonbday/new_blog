// Automatically wrap each Quarto post card in a flip card structure and add a back side with art
window.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.quarto-listing-default .quarto-post').forEach(function(card, i) {
    // Skip if already wrapped
    if (card.parentElement && card.parentElement.classList.contains('quarto-flip-inner')) return;

    // Create flip card structure
    var flipCard = document.createElement('div');
    flipCard.className = 'quarto-flip-card';
    var flipInner = document.createElement('div');
    flipInner.className = 'quarto-flip-inner';
    var front = document.createElement('div');
    front.className = 'quarto-flip-front';
    var back = document.createElement('div');
    back.className = 'quarto-flip-back';

    // Move the card into the front
    card.parentNode.insertBefore(flipCard, card);
    flipCard.appendChild(flipInner);
    flipInner.appendChild(front);
    flipInner.appendChild(back);
    front.appendChild(card);

    // Add art to the back (customize path as needed)
    var img = document.createElement('img');
    img.src = card.querySelector('img') ? card.querySelector('img').src : 'https://placekitten.com/400/250';
    img.alt = 'Project Art';
    img.style.maxWidth = '90%';
    img.style.borderRadius = '12px';
    back.appendChild(img);
  });
});
