<?php 

add_shortcode( 'my_form', 'calculator' );
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
