const mix = require('laravel-mix');
const webpack = require('webpack');


/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */
mix.copy('resources/assets/admin', 'public/admin');
mix.copy('resources/assets/css', 'public/css');
mix.copy('resources/assets/fonts', 'public/fonts');
mix.copy('resources/assets/images', 'public/images');
mix.copy('resources/js/assets/images', 'public/images');
mix.copy('resources/assets/js', 'public/js');
mix.js('resources/js/app.js', 'public/js')
   .sass('resources/sass/app.scss', 'public/css')
   .vue()
   .version()    
   .webpackConfig({
    resolve: {
        fallback: {
            crypto: require.resolve('crypto-browserify'),
            vm: require.resolve('vm-browserify'),
            stream: require.resolve('stream-browserify'),
        }
    }
});;