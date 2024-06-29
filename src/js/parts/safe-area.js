document.addEventListener('DOMContentLoaded', function() {
    var element = document.documentElement; 
    if (element) {
        var safeAreaBottom = window.getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-bottom');
        if (safeAreaBottom) {
            element.style.paddingBottom = safeAreaBottom;
        }
    }
});