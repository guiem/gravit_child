<?php
/*
Template Name: Page Of Posts
*/

// if you are not using this in a child of Twenty Eleven, you need to replicate the html structure of your own theme.

get_header(); ?>
<div id="primary">
<div id="content" role="main">

<?php
$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;
$args= array(
	'category_name' => 'programming', // Change these category SLUGS to suit your use.
	'paged' => $paged
);
query_posts($args);
if( have_posts() ) :?>

<?php twentyeleven_content_nav( 'nav-above' );?>

<?php while ( have_posts() ) : the_post(); ?>

<?php get_template_part( 'content', get_post_format() ); ?>

<?php endwhile; ?>

<?php twentyeleven_content_nav_modified( 'nav-below' ); ?>

<?php else : ?>
<article id="post-0" class="post no-results not-found">
<header class="entry-header">
<h1 class="entry-title"><?php _e( 'Nothing Found', 'twentyeleven' ); ?></h1>
</header><!-- .entry-header -->

<div class="entry-content">
<p><?php _e( 'Apologies, but no results were found for the requested archive. Perhaps searching will help find a related post.', 'twentyeleven' ); ?></p>
<?php get_search_form(); ?>
</div>
</article>

<?php endif; ?>

</div>
</div>

<?php get_footer();?>
