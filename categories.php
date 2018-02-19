<?php
/*
Template Name: Categories
*/
get_header(); ?>
<div id="primary" class="content-area">
    <div id="content" class="site-content" role="main">
        <div>&nbsp;</div>
        <div class="entry-content">
            <?php the_post(); ?>
            <h1 class="entry-title"><?php the_title(); ?></h1>
                    
            <h2>Archives by Category</h2>
            <?php
                    if( function_exists('collapsCat') ) {
                        collapsCat('animate=1&inExclude=exclude&accordion=0&inExcludeCats=personal&showTopLevel=1&showEmptyCat=0&defaultExpand=notebooks,programming,bluehost,rdp,wordpress,unsolved,server,html5&postSort=postDate&postSortOrder=DESC');
                    } else {
                        echo "<ul>\n";
                        wp_get_categories();
                        echo "</ul>\n";
                    }
                ?>
        </div>
	</div><!-- #content -->
</div><!-- #container -->

<?php get_sidebar(); ?>
<?php get_footer(); ?>
