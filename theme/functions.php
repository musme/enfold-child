<?php

if ( ! defined( 'ITISTIME_LOCAL' ) ) {
	define( 'ITISTIME_LOCAL', wp_get_environment_type() === 'local' );
}

if ( ! defined( 'ITISTIME_VERSION' ) ) {
	$theme = wp_get_theme();
	$version = ITISTIME_LOCAL ? time() : '14';
	define( 'ITISTIME_VERSION', $version );
}

//https://support.bestwebsoft.com/hc/en-us/articles/202353439
// add_filter( 'cptch_add_form', 'add_my_forms' );
// function add_my_forms($forms) {
// 	$forms['calc_form'] = "Форма расчета";
// 	return $forms;
// }

wp_enqueue_script('app', get_theme_file_uri() . '/js/script.min.js', ['wp-element'], ITISTIME_VERSION, true);
if(!is_admin()) {
	wp_enqueue_style( 'app-styles', get_stylesheet_directory_uri() . '/styles.css', [], ITISTIME_VERSION, 'all' );
}

add_action('wp_ajax_send_mail', 'send_mail');
add_action('wp_ajax_nopriv_send_mail', 'send_mail');
function send_mail() {
	$data = isset($_POST['data']) ? json_decode(stripslashes($_POST['data']), true) : null;

	if(!$data) wp_send_json_error(['error' => json_last_error()], 401);

	remove_all_filters( 'wp_mail_from' );
	remove_all_filters( 'wp_mail_from_name' );

	$headers = array(
		'From: itis-time.ru <info@itis-time.ru>',
		'content-type: text/html',
		'Cc: ',
		'Cc: ',
	);

	ob_start();
	include('inc/robot-calc-email.php');
	$letter = ob_get_clean();

	wp_mail( get_option('admin_email'), 'Смета расценок на роботов от itis-time.ru', $letter, $headers );
	wp_mail( $data['email'], 'Смета расценок на роботов от itis-time.ru', $letter, $headers );
	wp_send_json(['success' => true]);
	wp_die();
}

add_action('template_redirect', 'add_attachment_redirect');
function add_attachment_redirect() {
    global $wp_query, $post;
		if(is_attachment()) {
			$wp_query->set_404();
			status_header(404); 
		}
} 

add_filter( 'wp_mail_from_name', 'set_sender_name' );
function set_sender_name() {
	return "itis-time.ru";
}

add_action('wp_footer','include_scripts');
function include_scripts() {
	ob_start();
	include('inc/scripts.php');
	$scripts = ob_get_clean();
	echo $scripts;
}

require get_theme_file_path( 'inc/shortcodes.php' );