<?php
/*
Template Name: Page that displays the CV
*/

// if you are not using this in a child of Twenty Thirteen, you need to replicate the html structure of your own theme.

get_header(); ?>
<div id="primary">
<div id="content" role="main">
<body onload="init()">
<?php get_template_part( 'content', 'page' ); ?>
<canvas id="canvas1" width="600" height="200" style="border: 1px solid black;margin-top:-40px">
This text is displayed if your browser does not support HTML5 Canvas.
</canvas>
<font style="font-size:12px;">
<input style="display:none" id="screen-slider" type="range" value="0" max="100" min="0" onchange="changeScreenOffset(event)">
<input style="display:none" id="zoom-slider" type="range" value="0" max="10" min="0" onchange="changeZoom(event)">
<font color="66CCCC"><b>studies</b></font>, <font color="FF99CC"><b>yoga</b></font>, <font color="CCCCFF"><b>research</b></font>, <font color="EEBBEE"><b>freelancer</b></font>, <font color="99CC00"><b>hobbies</b></font>, <font color="66FF00"><b>altruistic</b></font></font>

<!--<input id="zoom-slider" type="range" value="3.5" max="10" min="0" onchange="changeZoom(event)">-->
<!--<input id="studies" type="checkbox" checked="checked" onchange="changeStudiesSelection(event)"/>Studies-->
<br/>
<font style="font-size:20px"><strong>More information</strong></font>
<p id="information" style="color:grey"><em>Click on any activity to display more information.</em></p>
<p style="font-size:small"><i>Disclaimer: this is just the first CV's preview that I programmed. Code is still very unpretty but it is intended to end up as a WordPress plugin. Right now it has been built ad-hoc, so keep in mind that several changes will come. Check its own evolution <a href="http://guiem.info/wp-cv-plugin-creation/">here</a>.</i></p>

<script type="text/javascript" src="/wp-content/themes/twentythirteen/js/prototype.js"></script>
<script src="/wp-content/themes/twentythirteenchild/js/activities.js"></script>

</body>

</div>
</div>
<?php get_footer();?>
