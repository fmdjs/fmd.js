/**
 * the Gruntfile for fmd.js
 * @author Edgar
 * @date 140219
 * */

module.exports = function( grunt ){
    
    var bannerTpl = '/*! fmd.js v<%= pkg.version %> | http://fmdjs.org/ | MIT */';
    
    var source = [
        'src/boot.js',
        'src/lang.js',
        'src/event.js',
        'src/config.js',
        'src/module.js',
        'src/alias.js',
        'src/relative.js',
        'src/id2url.js',
        'src/assets.js',
        'src/when.js',
        'src/request.js',
        'src/loader.js',
        'src/remote.js',
        'src/use.js',
        'src/async.js',
        'src/logger.js'
    ];
    
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            files: 'src/*.js',
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
                    'dist/fmd-debug.js': source
                }
            },
            nonDebug: {
                options: {
                    separator: '\n\n'
                },
                files: {
                    'dist/plugins/non-debug.js': ['src/preload.js','src/non.js']
                }
            },
            non: {
                options: {
                    separator: ''
                },
                files: {
                    'dist/plugins/non.js': ['dist/fmd/preload.js','dist/fmd/non.js']
                }
            }
        },
        gcc: {
            boot: {
                options: {
                    banner: bannerTpl
                },
                files: {
                    'dist/fmd/boot.js': ['src/boot.js']
                }
            },
            all: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['*.js','!boot.js'],
                    dest: 'dist/fmd/',
                    ext: '.js'
                }]
            },
            merge: {
                options: {
                    banner: bannerTpl
                },
                files: {
                    'dist/fmd.js': ['dist/fmd-debug.js']
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
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['dist/*.js'],
                    dest: 'dist/'
                }, {
                    'dist/fmd/boot.js': ['dist/fmd/boot.js']
                }]
            }
        },
        copy: {
            combo: {
                files: {
                    'dist/plugins/combo.js': ['dist/fmd/combo.js'],
                    'dist/plugins/combo-debug.js': ['src/combo.js'],
                    'dist/plugins/plugin.js': ['dist/fmd/plugin.js'],
                    'dist/plugins/plugin-debug.js': ['src/plugin.js']
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

    grunt.registerTask('concatPluginNon', ['concat:nonDebug','concat:non']);
    
    grunt.registerTask('build', ['jshint','clean','concat:merge','gcc','concatPluginNon','replace','copy']);
    
    grunt.registerTask('default', ['build']);

};
