<?php
/**
 * Plugin Name: Secondary Nav Search
 * Description: Adds a search icon to the Divi secondary navigation with an inline slide-down expand animation. SearchWP integration is optional.
 * Version: 1.1.1
 * Author: Boileau & Co.
 * Text Domain: secondary-nav-search
 */

// Guard against direct access.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------
define( 'SNS_VERSION', '1.1.1' );
define( 'SNS_PATH', plugin_dir_path( __FILE__ ) );
define( 'SNS_URL',  plugin_dir_url( __FILE__ ) );

// ---------------------------------------------------------------------
// GitHub auto-updater (Plugin Update Checker by YahnisElsts)
// ---------------------------------------------------------------------
if ( file_exists( SNS_PATH . 'lib/plugin-update-checker/plugin-update-checker.php' ) ) {
	require SNS_PATH . 'lib/plugin-update-checker/plugin-update-checker.php';

	$sns_update_checker = YahnisElsts\PluginUpdateChecker\v5\PucFactory::buildUpdateChecker(
		'https://github.com/boileau-co/sec-nav-search/',
		__FILE__,
		'secondary-nav-search'
	);

	$sns_update_checker->setBranch( 'main' );

	// Private repo? Uncomment and add a Personal Access Token.
	// $sns_update_checker->setAuthentication( 'ghp_xxxxxxxxxxxxxxxxxxxxxx' );
}

// ---------------------------------------------------------------------
// 1. Inject the search toggle button into the Divi secondary menu.
// ---------------------------------------------------------------------
add_filter( 'wp_nav_menu_items', 'sns_inject_toggle', 10, 2 );
function sns_inject_toggle( $items, $args ) {
	if ( ! isset( $args->theme_location ) || 'secondary-menu' !== $args->theme_location ) {
		return $items;
	}

	$svg = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';

	$toggle = '<li class="menu-item sns-item">'
		. '<button type="button" class="sns-toggle" aria-label="Open search" aria-expanded="false" aria-controls="sns-form">'
		. $svg
		. '</button>'
		. '</li>';

	return $items . $toggle;
}

// ---------------------------------------------------------------------
// 2. Output the search form in the footer so it exists in the DOM when
//    SearchWP Pro scans for inputs on DOMContentLoaded.
//    JS moves it into #et-secondary-menu after the scan has run.
//
//    Filters:
//      sns_placeholder  — override the input placeholder text
// ---------------------------------------------------------------------
add_action( 'wp_footer', 'sns_output_form', 5 );
function sns_output_form() {
	$svg_search  = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>';
	$svg_close   = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
	$placeholder = apply_filters( 'sns_placeholder', 'Search the site...' );
	?>
	<form role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" id="sns-form" class="sns-form searchwp-form" aria-hidden="true">
		<label for="sns-input" class="sns-sr-only">Search</label>
		<input type="hidden" name="swp_form[form_id]" value="1">
		<input
			type="search"
			id="sns-input"
			class="sns-input swp-input--search swp-input"
			name="s"
			placeholder="<?php echo esc_attr( $placeholder ); ?>"
			autocomplete="off"
			data-swplive="true"
			data-swpengine="default"
		/>
		<button type="submit" aria-label="Submit search"><?php echo $svg_search; ?></button>
		<button type="button" class="sns-close" aria-label="Close search"><?php echo $svg_close; ?></button>
	</form>
	<?php
}

// ---------------------------------------------------------------------
// 3. Enqueue assets.
//
//    Filters:
//      sns_css_vars  — override CSS custom properties per site.
//                      Return an associative array of property => value.
//
//    Example in child theme's functions.php:
//      add_filter( 'sns_css_vars', function( $vars ) {
//          $vars['--sns-bg']   = '#fff';
//          $vars['--sns-text'] = '#111';
//          return $vars;
//      } );
// ---------------------------------------------------------------------
add_action( 'wp_enqueue_scripts', 'sns_enqueue' );
function sns_enqueue() {
	wp_enqueue_style(
		'secondary-nav-search',
		SNS_URL . 'assets/css/secondary-nav-search.css',
		array(),
		SNS_VERSION
	);

	$vars = apply_filters( 'sns_css_vars', array() );
	if ( ! empty( $vars ) ) {
		$css = ':root{';
		foreach ( $vars as $property => $value ) {
			$css .= sanitize_text_field( $property ) . ':' . sanitize_text_field( $value ) . ';';
		}
		$css .= '}';
		wp_add_inline_style( 'secondary-nav-search', $css );
	}

	wp_enqueue_script(
		'secondary-nav-search',
		SNS_URL . 'assets/js/secondary-nav-search.js',
		array( 'jquery' ),
		SNS_VERSION,
		true
	);
}
