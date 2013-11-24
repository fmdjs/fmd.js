/**
 * the Gruntfile for fmd.js
 * @author Edgar
 * @date 131112
 * */

module.exports = function( grunt ){
    
    var bannerTpl = '/*! fmd.js v<%= pkg.version %> | http://fmdjs.org/ | MIT */';
    
    var baseSource = [
        'src/boot.js',
        'src/lang.js',
        'src/event.js',
        'src/config.js',
        'src/module.js',
        'src/relative.js',
        'src/alias.js'
    ],
    defaultSource = baseSource.concat([
        'src/id2url.js',
        'src/assets.js',
        'src/when.js',
        'src/request.js',
        'src/loader.js',
        'src/remote.js',
        'src/use.js',
        'src/async.js',
        'src/logger.js'
    ]),
    aioSource = defaultSource.concat([
        'src/plugin.js',
        'src/preload.js',
        'src/non.js'
    ]);
    
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
            base: {
                options: {
                    separator: '\n\n',
                    banner: bannerTpl
                },
                src: baseSource,
                dest: 'dist/fmd-base-debug.js'
            },
            fmd: {
                options: {
                    separator: '\n\n',
                    banner: bannerTpl
                },
                src: defaultSource,
                dest: 'dist/fmd-debug.js'
            },
            aio: {
                options: {
                    separator: '\n\n',
                    banner: bannerTpl
                },
                src: aioSource,
                dest: 'dist/fmd-aio-debug.js'
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
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['dist/*-debug.js'],
                    dest: 'dist/',
                    rename: function(dest,src){
                        return dest + src.replace('-debug','');
                    }
                }]
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
                    src: ['dist/fmd/boot.js'],
                    dest: 'dist/fmd/boot.js'
                }]
            }
        },
        copy: {
            combo: {
                files: {
                    'dist/plugin/combo.js': ['dist/fmd/combo.js'],
                    'dist/plugin/combo-debug.js': ['src/combo.js']
                }
            }
        },
        markdown: {}

    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-replace');
    grunt.loadNpmTasks('grunt-gcc');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-markdown');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('build', ['jshint','clean','concat','gcc','replace','copy']);
    
    grunt.registerTask('default', ['build']);

};
