<?php
/**
 * The Template for displaying all single posts.
 *
 * @package WordPress
 * @subpackage Twenty_Eleven
 * @since Twenty Eleven 1.0
 */

get_header(); ?>

		<div id="primary" class="content-area">
			<div id="content" class="site-content" role="main">

				<?php while ( have_posts() ) : the_post(); ?>

					
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

					<?php get_template_part( 'content', get_post_format() ); ?>
                    <?php twentythirteen_post_nav(); ?>
					<?php comments_template(); ?>

				<?php endwhile; // end of the loop. ?>

			</div><!-- #content -->
		</div><!-- #primary -->

<?php get_footer(); ?>
