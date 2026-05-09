(function () {
    function initNav() {
        document.querySelectorAll('.nav-toggle').forEach(function (btn) {
            var row = btn.closest('.nav-row');
            if (!row) return;
            var list = row.nextElementSibling;
            if (!list) return;

            btn.addEventListener('click', function () {
                var expanded = btn.getAttribute('aria-expanded') === 'true';
                btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
                list.classList.toggle('nav-hidden');
            });
        });
    }

    function initDark() {
        var btn = document.getElementById('btn-dark');
        if (!btn) return;
        btn.addEventListener('click', function () {
            var isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('dark', isDark ? '1' : '');
        });
    }

    function initToc() {
        var toc = document.getElementById('toc');
        if (!toc) return;
        var postBody = document.querySelector('.post-body');
        if (!postBody) return;
        var headings = Array.from(postBody.querySelectorAll('h1, h2, h3'));
        if (!headings.length) return;

        var items = headings.map(function (h) {
            return '<li class="toc-' + h.tagName.toLowerCase() + '"><a href="#' + h.id + '">' + h.textContent + '</a></li>';
        }).join('');
        toc.innerHTML = '<p class="toc-title">목차</p><ul>' + items + '</ul>';

        var links = Array.from(toc.querySelectorAll('a'));
        function highlight() {
            var atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 10;
            var threshold = atBottom ? window.innerHeight : 120;
            var active = null;
            headings.forEach(function (h) {
                if (h.getBoundingClientRect().top < threshold) active = h.id;
            });
            links.forEach(function (a) {
                a.classList.toggle('active', a.getAttribute('href') === '#' + active);
            });
        }
        window.addEventListener('scroll', highlight, { passive: true });
        highlight();
    }

    document.addEventListener('DOMContentLoaded', function () {
        initNav();
        initDark();
        initToc();
    });
})();
