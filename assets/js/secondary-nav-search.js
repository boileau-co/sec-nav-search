/**
 * Secondary Nav Search
 *
 * Constructs the search form and wires up open/close behavior.
 * SearchWP Live Ajax Search is initialized on first open, by which
 * point all scripts are guaranteed to have loaded.
 *
 * Receives values from PHP via window.snsData (see wp_localize_script
 * in secondary-nav-search.php).
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var menuWrap = document.getElementById('et-secondary-menu');
		var toggle   = document.querySelector('#et-secondary-menu .sns-toggle');
		if (!menuWrap || !toggle) {
			return;
		}

		var homeUrl = (window.snsData && window.snsData.homeUrl) || '/';

		// -------------------------------------------------------------
		// Build the form and append as a sibling of the <ul>, inside
		// #et-secondary-menu, so it can position absolutely over the
		// whole secondary menu area.
		// -------------------------------------------------------------
		var form = document.createElement('form');
		form.setAttribute('role', 'search');
		form.setAttribute('method', 'get');
		form.setAttribute('action', homeUrl);
		form.setAttribute('id', 'sns-form');
		form.className = 'sns-form';
		form.innerHTML =
			'<label for="sns-input" class="sns-sr-only">Search</label>' +
			'<input ' +
				'type="search" ' +
				'id="sns-input" ' +
				'class="sns-input searchwp-live-search-input" ' +
				'name="s" ' +
				'placeholder="Search the site..." ' +
				'autocomplete="off" ' +
				'data-swpengine="default" ' +
			'/>' +
			'<button type="submit" aria-label="Submit search">' +
				'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
					'<circle cx="11" cy="11" r="8"/>' +
					'<line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
				'</svg>' +
			'</button>' +
			'<button type="button" class="sns-close" aria-label="Close search">' +
				'<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
					'<line x1="18" y1="6" x2="6" y2="18"/>' +
					'<line x1="6" y1="6" x2="18" y2="18"/>' +
				'</svg>' +
			'</button>';

		menuWrap.appendChild(form);

		var input    = form.querySelector('.sns-input');
		var closeBtn = form.querySelector('.sns-close');

		// -------------------------------------------------------------
		// SearchWP Live Ajax init — runs on first open so all scripts
		// are guaranteed loaded by the time this executes.
		// -------------------------------------------------------------
		var swpInitialized = false;
		function maybeInitSearchWP() {
			if (swpInitialized) { return; }
			if (window.jQuery && typeof window.jQuery.fn.SearchWPLiveSearch === 'function') {
				window.jQuery(input).SearchWPLiveSearch();
				swpInitialized = true;
			}
		}

		// -------------------------------------------------------------
		// Open / close handlers
		// -------------------------------------------------------------
		function openSearch() {
			form.classList.add('is-open');
			menuWrap.classList.add('sns-active');
			toggle.setAttribute('aria-expanded', 'true');
			maybeInitSearchWP();
			setTimeout(function () { input.focus(); }, 50);
		}

		function closeSearch() {
			form.classList.remove('is-open');
			menuWrap.classList.remove('sns-active');
			toggle.setAttribute('aria-expanded', 'false');
			input.value = '';
			toggle.focus();
		}

		toggle.addEventListener('click', function (e) {
			e.preventDefault();
			if (form.classList.contains('is-open')) {
				closeSearch();
			} else {
				openSearch();
			}
		});

		closeBtn.addEventListener('click', function (e) {
			e.preventDefault();
			closeSearch();
		});

		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && form.classList.contains('is-open')) {
				closeSearch();
			}
		});
	});
})();
