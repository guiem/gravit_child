<?php
/*
Template Name: Archives
*/
get_header(); ?>

<div id="primary" class="content-area">
    <div id="content" class="site-content" role="main">
        <div>&nbsp;</div>
        <div class="entry-content">
            <?php the_post(); ?>
            <h1 class="entry-title"><?php the_title(); ?></h1>
                    
            <h2>Archives by Year & Month</h2>
            <?php
                    echo "<ul class='collapsCatList'>\n";
                    if( function_exists('collapsArch') ) {
                        collapsArch('animate=1&inExcludeCat=exclude&inExcludeCats=uncategorized,programming,wordpress,bluehost,unsolved,rdp,server,html5,code,snippet,plugin,application,javascript,notebooks');
                    } else {
                        wp_get_archives();
                    }
                echo "</ul>\n";
                ?>
        </div>
	</div><!-- #content -->
</div><!-- #container -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
