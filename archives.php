<?php
/*
Template Name: Archives
*/
get_header(); ?>

<div id="container">
	<div id="content" role="main">
		<?php the_post(); ?>
		<h1 class="entry-title"><?php the_title(); ?></h1>
				
		<h2>Archives by Year & Month</h2>
		<?php
      			echo "<ul class='collapsCatList'>\n";
     			if( function_exists('collapsArch') ) {
      				collapsArch('animate=1&inExcludeCat=exclude&inExcludeCats=programming,wordpress,bluehost,unsolved,rdp,server,html5,code,snippet,plugin,application,javascript');
     			} else {
      				wp_get_archives();
     			}
			echo "</ul>\n";
    		?>
	</div><!-- #content -->
</div><!-- #container -->

<?php get_sidebar(); ?>
<div>&nbsp;</div>
<?php get_footer(); ?>
