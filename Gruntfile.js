/**
 * the Gruntfile for fmd.js
 * @author Edgar
 * @date 170104
 * */

module.exports = function( grunt ){
    
    var bannerTpl = '/*! fmd.js v<%= pkg.version %> | http://fmdjs.org/ | MIT */';
    
    var source = [
        'src/boot.js',
        'src/utils/lang.js',
        'src/event.js',
        'src/config.js',
        'src/module.js',
        'src/injector/alias.js',
        'src/injector/relative.js',
        'src/loader/resolve.js',
        'src/loader/id2url.js',
        'src/loader/assets.js',
        'src/utils/when.js',
        'src/loader/request.js',
        'src/loader/loader.js',
        'src/loader/remote.js',
        'src/injector/use.js',
        'src/injector/async.js',
        'src/helper/logger.js'
    ];
    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: ['src/*.js', 'src/*/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        clean: {
            clear: ['dist']
        },
        concat: {
            merge: {
                options: {
                    separator: '\n\n',
                    banner: bannerTpl + '\n'
                },
                files: {
                    'dist/fmd.js': source
                }
            },
            non: {
                options: {
                    separator: '\n\n'
                },
                files: {
                    'dist/plugins/non.js': ['src/plugins/preload.js','src/plugins/non.js']
                }
            }
        },
        gcc: {
            merge: {
                options: {
                    banner: bannerTpl,
                    create_source_map: 'dist/fmd.min.js.map'
                },
                files: {
                    'dist/fmd.min.js': ['dist/fmd.js']
                }
            }
        },
        replace: {
            version: {
                options: {
                    patterns: [{
                        match: /@VERSION/,
                        replacement: '<%= pkg.version %>'
                    }]
                },
                files: {
                    'dist/fmd.js': 'dist/fmd.js'
                }
            }
        },
        copy: {
            combo: {
                files: {
                    'dist/fmd/plugin.js': 'src/injector/plugin.js',
                    'dist/plugins/combo.js': 'src/plugins/combo.js',
                    'dist/fmd/console.js': 'src/helper/console.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-gcc');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', ['jshint','clean','concat','replace','gcc','copy']);
    
    grunt.registerTask('default', ['build']);

};
