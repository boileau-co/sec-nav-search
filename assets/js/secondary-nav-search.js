/**
 * Secondary Nav Search
 *
 * The form is output in PHP (wp_footer) so SearchWP Live Ajax Search
 * can initialize it on DOMContentLoaded. This script runs after that
 * scan, moves the form into #et-secondary-menu, and wires up
 * open/close behaviour.
 */
(function () {
	'use strict';

	document.addEventListener('DOMContentLoaded', function () {
		var menuWrap = document.getElementById('et-secondary-menu');
		var toggle   = document.querySelector('#et-secondary-menu .sns-toggle');
		var form     = document.getElementById('sns-form');

		if (!menuWrap || !toggle || !form) {
			return;
		}

		// Move the form into the menu container for correct positioning.
		// SearchWP has already attached its listeners to the input, and
		// moving a DOM element does not detach event listeners.
		menuWrap.appendChild(form);

		var input    = form.querySelector('.sns-input');
		var closeBtn = form.querySelector('.sns-close');

		function openSearch() {
			form.classList.add('is-open');
			form.removeAttribute('aria-hidden');
			menuWrap.classList.add('sns-active');
			toggle.setAttribute('aria-expanded', 'true');
			setTimeout(function () { input.focus(); }, 50);
		}

		function closeSearch() {
			form.classList.remove('is-open');
			form.setAttribute('aria-hidden', 'true');
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
