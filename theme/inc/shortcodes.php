<?php 

add_shortcode( 'robo_calc', 'calculator' );
function calculator() {
  if(!function_exists('CFS')) return '';

  $robots = CFS()->get( 'calc_robots');

  if(!$robots || !count($robots)) return '';
  foreach( $robots as $index => &$robot ) {
    if($robot['hide']) continue;

    $post = get_post( $robot['page'][0] );
    $image = get_the_post_thumbnail_url($post->ID, 'medium');
    $robot['title']  = get_the_title($post);
    $robot['image']  = $image ? $image : bloginfo('home') . '/wp-content/uploads/2018/05/no-image.jpg';
    $robot['link'] = get_permalink($post->ID);
  }
  $cfs = htmlspecialchars(json_encode($robots), ENT_QUOTES, 'UTF-8');
  return '<div id="robot-calc-react" data-cfs="'.$cfs.'" data-url="'.admin_url("admin-ajax.php?action=send_mail").'"></div>';
}

add_shortcode( 'robo_home', 'robots_at_home' );
function robots_at_home($atts) {

  if(!function_exists('CFS')) return '';

  $post_id = $atts['id'] ?? null;
  if(!$post_id) return 'Не указан id';

  $robots = CFS()->get( 'calc_robots', (int) $post_id);

  if(!$robots || !count($robots)) return '';
  $content = '<div class="grid gap-6 lg:grid-cols-3">';
  foreach( $robots as $index => &$robot ) {
    if($robot['hide']) continue;

    $post = get_post( $robot['page'][0] );
    $image = get_the_post_thumbnail_url($post->ID, 'medium');
    $robot['title']  = get_the_title($post);
    $robot['image']  = $image ? $image : bloginfo('home') . '/wp-content/uploads/2018/05/no-image.jpg';
    $robot['link'] = get_permalink($post->ID);
    ob_start();
    include('robot-cart.php');
    $content .= ob_get_clean();
  }

  $content .= '</div>';

  return $content;
}