'use strict';

module.exports = function(grunt) {

    if (process.env.NODE_ENV !== 'production') {
        require('time-grunt')(grunt);
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        assets: grunt.file.readJSON('server/config/assets.json'),
        clean: ["public/build/css", "public/build/js"],
        watch: {
            js: {
                files: ['*.js', 'server/**/*.js', 'public/**/*.js', 'test/**/*.js'],
                tasks: ['jshint'],
                options: {
                    livereload: true
                }
            },
            html: {
                files: ['public/**/views/**', 'server/views/**'],
                options: {
                    livereload: true
                }
            },
            css: {
                files: ['public/**/css/**'],
                tasks: ['csslint'],
                options: {
                    livereload: true
                }
            }
        },
        jshint: {
            all: {
                src: ['*.js', 'server/**/*.js', 'public/**/*.js', 'test/**/*.js', '!test/coverage/**/*.js', '!public/system/lib/**'],
                options: {
                    jshintrc: true
                }
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            production: {
                files: '<%= assets.js %>'
            }
        },
        csslint: {
            options: {
                csslintrc: '.csslintrc'
            },
            all: {
                src: ['public/**/css/**/*', '!public/system/lib/**']
            }
        },
        cssmin: {
            combine: {
                files: '<%= assets.css %>'
            }
        },
        copy: {
            main: {
                expand: true,
                cwd: 'public/system/assets/fonts/',
                src: '**',
                dest: 'public/build/fonts/',
                flatten: true,
                filter: 'isFile',
            },
            bootstrap: {
                expand: true,
                cwd: 'public/system/lib/bootstrap/dist/fonts/',
                src: '**',
                dest: 'public/build/fonts/',
                flatten: true,
                filter: 'isFile',
            },
        },
        nodemon: {
            dev: {
                script: 'server.js',
                options: {
                    args: [],
                    ignore: ['public/**'],
                    ext: 'js,html',
                    nodeArgs: ['--debug'],
                    delayTime: 1,
                    env: {
                        PORT: require('./server/config/config').port
                    },
                    cwd: __dirname
                }
            }
        },
        concurrent: {
            tasks: ['nodemon', 'watch'],
            options: {
                logConcurrentOutput: true
            }
        },
        mochaTest: {
            options: {
                reporter: 'spec',
                require: 'server.js'
            },
            src: ['test/mocha/**/*.js']
        },
        env: {
            test: {
                NODE_ENV: 'production'
            }
        },
        karma: {
            unit: {
                configFile: 'test/karma/karma.conf.js'
            }
        }
    });

    // Load NPM tasks
    require('load-grunt-tasks')(grunt);

    // Making grunt default to force in order not to break the project.
    grunt.option('force', true);

    // Default task(s).
    if (process.env.NODE_ENV === 'production') {
        grunt.registerTask('default', ['clean', 'jshint', 'csslint', 'cssmin', 'copy', 'uglify', 'concurrent']);
    } else {
        grunt.registerTask('default', ['jshint', 'csslint', 'concurrent']);
    }

    // Test task.
    grunt.registerTask('test', ['env:test', 'mochaTest', 'karma:unit']);

};
