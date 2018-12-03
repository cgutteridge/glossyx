<?php
/**
 * @package GlossyX
 * @version 0.1
 */
/*
Plugin Name: GlossyX
Plugin URI: https://github.com/cgutteridge/???
Description: Javascript to add glossaries in a light-touch way
Author: Christopher Gutteridge
Version: 0.1
Author URI: http://www.ecs.soton.ac.uk/people/cjg
*/

function glossyx_scripts()
{
    wp_register_script( 'glossyx-script', plugins_url( '/glossyx.js', __FILE__ ), array( 'jquery' ), '0.1', true );
    wp_enqueue_script( 'glossyx-script' );
}
add_action( 'wp_enqueue_scripts', 'glossyx_scripts' );
