/**
 * Secondary Nav Search
 *
 * Constructs the search form and wires up open/close behavior. If
 * SearchWP Live Ajax Search is active, the input also gets the class
 * + data attribute that plugin needs to attach its autocomplete; if
 * not, the form just submits to the native WordPress ?s= search.
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

		// Detect SearchWP Live Ajax Search. Conditionally adding its
		// hooks (rather than always) keeps the input clean on sites
		// that don't use SearchWP.
		var hasLiveAjax = !!(
			window.jQuery &&
			typeof window.jQuery.fn.SearchWPLiveSearch === 'function'
		);

		var inputClasses = 'sns-input' + (hasLiveAjax ? ' searchwp-live-search-input' : '');
		var inputDataAttr = hasLiveAjax ? 'data-swpengine="default" ' : '';

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
				'class="' + inputClasses + '" ' +
				'name="s" ' +
				'placeholder="Search the site..." ' +
				'autocomplete="off" ' +
				inputDataAttr +
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
		// Open / close handlers
		// -------------------------------------------------------------
		function openSearch() {
			form.classList.add('is-open');
			menuWrap.classList.add('sns-active');
			toggle.setAttribute('aria-expanded', 'true');
			// Slight delay so the input is focusable after the transition starts
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

		// ESC closes the search
		document.addEventListener('keydown', function (e) {
			if (e.key === 'Escape' && form.classList.contains('is-open')) {
				closeSearch();
			}
		});

		// -------------------------------------------------------------
		// If SearchWP Live Ajax is present, the plugin usually attaches
		// on DOM ready by scanning for inputs with the
		// `searchwp-live-search-input` class. Because we appended the
		// form dynamically, we trigger its init again here so it picks
		// up the new input regardless of load order.
		// -------------------------------------------------------------
		if (hasLiveAjax) {
			window.jQuery(input).SearchWPLiveSearch();
		}
	});
})();
