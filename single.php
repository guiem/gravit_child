<?php
/**
 * The Template for displaying all single posts.
 *
 * @package WordPress
 * @subpackage Twenty_Eleven
 * @since Twenty Eleven 1.0
 */

get_header(); ?>

		<div id="primary">
			<div id="content" role="main">

				<?php while ( have_posts() ) : the_post(); ?>

					<nav id="nav-single">
						<h3 class="assistive-text"><?php _e( 'Post navigation', 'twentyeleven' ); ?></h3>
						<!-- G.Bosch: filtering for my two different posts-->
						<?php
							$cat_prog = get_cat_ID('programming');
							$cat_pers = get_cat_ID('personal');
							$cat_wp = get_cat_ID('wordpress');
							$cat_bh = get_cat_ID('bluehost');
							$cat_un = get_cat_ID('unsolved');
							$cat_rdp = get_cat_ID('rdp');
							$cat_serv = get_cat_ID('server');
							$cat_html5 = get_cat_ID('html5');
							$category = get_the_category(); // G.Bosch: current category
                                			if (in_category($cat_prog) or cat_is_ancestor_of($cat_prog, $category[0]->cat_ID)) {
								$cat_filter = $cat_pers;
							}
							elseif (in_category($cat_pers)){
								$cat_filter = $cat_prog.','.$cat_wp.','.$cat_bh.','.$cat_un.','.$cat_rdp.','.$cat_serv.','.$cat_html5;
							} 
						?>
						<span class="nav-previous"><?php previous_post_link( '%link', __( '<span class="meta-nav">&larr;</span> Previous', 'twentyeleven' ),FALSE,$cat_filter); ?></span>
						<span class="nav-next"><?php next_post_link( '%link', __( 'Next <span class="meta-nav">&rarr;</span>', 'twentyeleven' ),FALSE,$cat_filter ); ?></span>
						<!-- G.Bosch -->
					</nav><!-- #nav-single -->

					<?php get_template_part( 'content', 'single' ); ?>

					<?php comments_template( '', true ); ?>

				<?php endwhile; // end of the loop. ?>

			</div><!-- #content -->
		</div><!-- #primary -->

<?php get_footer(); ?>
