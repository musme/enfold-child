<?php
/*
 * Returns the schema.org markup based on the context value.
 * $args: context (string), echo (boolean) and post_type (string)
 */
if(!function_exists('avia_markup_helper'))
{
    function avia_markup_helper($args)
    {
        if(!empty($args))
        $args = array_merge(array('context' => '', 'echo' => true, 'post_type' => '', 'id' => '', 'custom_markup' => '', 'force' => false), $args);

		$args = apply_filters('avf_markup_helper_args', $args);
			
		// dont show markup if its deactivated. markup can still be enforced with args['force'] = true;
		if('inactive' == avia_get_option('markup') && $args['force'] == false) return;

        if(empty($args['context'])) return;

        // markup string - stores markup output
        $markup = ' ';
        $attributes = array();

        //try to fetch the right markup
        


        $attributes = apply_filters('avf_markup_helper_attributes', $attributes, $args);

        //we failed to fetch the attributes - let's stop
        if(empty($attributes)) return;

        foreach ($attributes as $key => $value)
        {
            $markup .= $key . '="' . $value . '" ';
        }

        $markup = apply_filters('avf_markup_helper_output', $markup, $args);

        if($args['echo'])
        {
            echo $markup;
        }
        else
        {
            return $markup;
        }
    }
}




if(!function_exists('av_blog_entry_markup_helper'))
{
	function av_blog_entry_markup_helper( $id , $exclude = array())
	{
		if('inactive' == avia_get_option('markup')) return;
		
		$logo = $logo_url = $logo_h = $logo_w = $url_string = $url_h = $url_w = "";
		$post = get_post($id);
		if($logo = avia_get_option('logo'))
		{
			 $logo = apply_filters('avf_logo', $logo);
			 if(is_numeric($logo)){ 
				 $logo = wp_get_attachment_image_src($logo, 'full'); 
				 $logo_url = $logo[0]; 
				}
				else
				{
					$logo_url = $logo;
				}
		} 
				
		$thumb_id = get_post_thumbnail_id($id);  
		
		if($thumb_id)
		{
			$url = wp_get_attachment_image_src($thumb_id, 'full'); 
			$url_string = $url[0];
			$url_w = $url[1];
			$url_h = $url[2];
			
		}
		else
		{
			if(is_array($logo)){			
				$url_string = $logo[0];
				$url_w = $logo[1];
				$url_h = $logo[2];
			}
			else
			{
				$url_string = $logo;
				$url_w = 0;
				$url_h = 0;
			}
		}
		
		
		$author_name 		= apply_filters('avf_author_name', get_the_author_meta('display_name', $post->post_author), $post->post_author);
		$publisher_markup 	= avia_markup_helper(array('context' => 'blog_publisher','echo'=>false));
		$author_markup 		= avia_markup_helper(array('context' => 'author','echo'=>false));
		$date_markup 		= avia_markup_helper(array('context' => 'blog_date_modified','echo'=>false));
		$entry_time_markup 	= avia_markup_helper(array('context' => 'entry_time','echo'=>false));
		$main_entity_markup = avia_markup_helper(array('context' => 'blog_mainEntityOfPage','echo'=>false));
		$image_markup 		= avia_markup_helper(array('context' => 'image','echo'=>false));		
		
		$output = "";
		
		if( !in_array('image', $exclude) )
		{
			$output .= "
			<span class='av-structured-data' {$image_markup} itemprop='image'>
					   <span itemprop='url' >{$url_string}</span>
					   <span itemprop='height' >{$url_h}</span>
					   <span itemprop='width' >{$url_w}</span>
				  </span>";
		}
		
		if( !in_array('publisher', $exclude) )
		{
			$output .= "<span class='av-structured-data' {$publisher_markup}>
				<span itemprop='name'>{$author_name}</span>
				<span itemprop='logo' itemscope itemtype='http://schema.org/ImageObject'>
				   <span itemprop='url'>{$logo_url}</span>
				 </span>
			  </span>";
		}
		
		if( !in_array('author', $exclude) )
		{	  
			$output .= "<span class='av-structured-data' {$author_markup}><span itemprop='name'>{$author_name}</span></span>";
		}
		if( !in_array('date', $exclude) )
		{
			$output .= "<span class='av-structured-data' {$entry_time_markup}>{$post->post_date}</span>";
		}
		
		if( !in_array('date_modified', $exclude) )
		{
			$output .= "<span class='av-structured-data' {$date_markup}>{$post->post_modified}</span>";
		}
		
		if( !in_array('mainEntityOfPage', $exclude) )
		{
			$output .= "<span class='av-structured-data' {$main_entity_markup}><span itemprop='name'>{$post->post_title}</span></span>";
		}
		
		if(!empty($output)) $output = "<span class='hidden'>{$output}</span>";
		
		return $output;
		
	}
}







