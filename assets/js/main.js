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

    document.addEventListener('DOMContentLoaded', function () {
        initNav();
        initDark();
    });
})();
