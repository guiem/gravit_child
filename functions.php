<?php
/**
 * Setup Twenty Eleven Child Theme's textdomain.
 *
 * Declare textdomain for this child theme.
 * Translations can be filed in the /languages/ directory.
 */
function twentythirteenchild_setup() {
    load_child_theme_textdomain( 'twentythirteenchild', get_stylesheet_directory() . '/languages' );
}
add_action( 'after_setup_theme', 'twentythirteenchild_setup' );
    
    
/**
 * Displays navigation to next/previous post when applicable.
 *
 * @since Twenty Thirteen 1.0
 *
 * @return void
 */
function twentythirteen_post_nav() {
    global $post;
    // Don't print empty markup if there's nowhere to navigate.
    $previous = ( is_attachment() ) ? get_post( $post->post_parent ) : get_adjacent_post( true, '', true );
    $next     = get_adjacent_post( true , '', true );
    
    if ( ! $next && ! $previous )
        return;
    ?>
    <nav class="navigation post-navigation" role="navigation">
    <h1 class="screen-reader-text"><?php _e( 'Post navigation', 'twentythirteen' ); ?></h1>
    <div class="nav-links">
        <?php previous_post_link( '%link', _x( '<span class="meta-nav">&larr;</span> %title', 'Previous post link', 'twentythirteen' ), true ); ?>
        <?php next_post_link( '%link', _x( '%title <span class="meta-nav">&rarr;</span>', 'Next post link', 'twentythirteen' ), true ); ?>
    </div><!-- .nav-links -->
    </nav><!-- .navigation -->
    <?php
}

?>