// Generated on 2016-05-28 using generator-angular-fullstack 3.0.2
'use strict';

module.exports = function (grunt) {
  var localConfig;
  try {
    localConfig = require('./lib/config/local.env');
  } catch(e) {
    localConfig = {};
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    cdnify: 'grunt-google-cdn',
    buildcontrol: 'grunt-build-control',
    istanbul_check_coverage: 'grunt-mocha-istanbul'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    yeoman: {
      // configurable paths
      client: 'client',
      server: 'lib',
      dist: 'dist'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: '<%= yeoman.server %>',
          debug: true
        }
      },
      prod: {
        options: {
          script: '<%= yeoman.dist %>/<%= yeoman.server %>'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>/api/things'
      }
    },
    watch: {
      mochaTest: {
        files: ['<%= yeoman.server %>/**/*.{spec,integration}.js'],
        tasks: ['env:test', 'mochaTest']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      express: {
        files: ['<%= yeoman.server %>/**/*.{js,json}'],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          spawn: false //Without this option specified express won't be reloaded
        }
      },
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '<%= yeoman.client %>/.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: '<%= yeoman.server %>/.jshintrc'
        },
        src: ['<%= yeoman.server %>/**/!(*.spec|*.integration).js']
      },
      serverTest: {
        options: {
          jshintrc: '<%= yeoman.server %>/.jshintrc-spec'
        },
        src: ['<%= yeoman.server %>/**/*.{spec,integration}.js']
      },
      all: ['<%= yeoman.client %>/{app,components}/**/!(*.spec|*.mock).js'],
      test: {
        src: ['<%= yeoman.client %>/{app,components}/**/*.{spec,mock}.js']
      }
    },

    jscs: {
      options: {
        config: ".jscsrc"
      },
      main: {
        files: {
          src: [
            '<%= yeoman.server %>/**/*.js'
          ]
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= yeoman.dist %>/!(.git*|.openshift|Procfile)**'
          ]
        }]
      },
      server: '.tmp'
    },

    // Debugging with node inspector
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: '<%= yeoman.server %>',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },



    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif,svg}',
          dest: '<%= yeoman.dist %>/<%= yeoman.client %>/assets/images'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= yeoman.dist %>/<%= yeoman.client %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= yeoman.client %>',
          dest: '<%= yeoman.dist %>/<%= yeoman.client %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'assets/images/{,*/}*.{webp}',
            'assets/fonts/**/*',
            'index.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= yeoman.dist %>/<%= yeoman.client %>/assets/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: '<%= yeoman.dist %>',
          src: [
            'package.json',
            '<%= yeoman.server %>/**/*'
          ]
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.client %>',
        dest: '.tmp/',
        src: ['{app,components}/**/*.css']
      }
    },

    buildcontrol: {
      options: {
        dir: '<%= yeoman.dist %>',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      heroku: {
        options: {
          remote: 'heroku',
          branch: 'master'
        }
      },
      openshift: {
        options: {
          remote: 'openshift',
          branch: 'master'
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      pre: [],
      server: [
        'newer:babel:client',
      ],
      test: [
        'newer:babel:client',
      ],
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        'newer:babel:client',
        'imagemin'
      ]
    },

    // Test settings
    mochaTest: {
      options: {
        reporter: 'spec',
        require: 'mocha.conf.js',
        timeout: 5000 // set default mocha spec timeout
      },
      unit: {
        src: ['<%= yeoman.server %>/**/*.spec.js']
      },
      integration: {
        src: ['<%= yeoman.server %>/**/*.integration.js']
      }
    },

    mocha_istanbul: {
      unit: {
        options: {
          excludes: ['**/*.{spec,mock,integration}.js'],
          reporter: 'spec',
          require: ['mocha.conf.js'],
          mask: '**/*.spec.js',
          coverageFolder: 'coverage/server/unit'
        },
        src: '<%= yeoman.server %>'
      },
      integration: {
        options: {
          excludes: ['**/*.{spec,mock,integration}.js'],
          reporter: 'spec',
          require: ['mocha.conf.js'],
          mask: '**/*.integration.js',
          coverageFolder: 'coverage/server/integration'
        },
        src: '<%= yeoman.server %>'
      }
    },

    istanbul_check_coverage: {
      default: {
        options: {
          coverageFolder: 'coverage/**',
          check: {
            lines: 80,
            statements: 80,
            branches: 80,
            functions: 80
          }
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    // Compiles ES6 to JavaScript using Babel
    babel: {
      options: {
        sourceMap: true,
        optional: [
          'es7.classProperties'
        ]
      },
      client: {
        files: [{
          expand: true,
          cwd: '<%= yeoman.client %>',
          src: ['{app,components}/**/!(*.spec).js'],
          dest: '.tmp'
        }]
      },
      server: {
        options: {
          optional: ['runtime']
        },
        files: [{
          expand: true,
          cwd: '<%= yeoman.server %>',
          src: ['**/*.{js,json}'],
          dest: '<%= yeoman.dist %>/<%= yeoman.server %>'
        }]
      }
    },

  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'concurrent:pre',
        'concurrent:server',
        'concurrent:debug'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'env:all',
      'concurrent:pre',
      'concurrent:server',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', function(target, option) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
        'env:test',
        'mochaTest:unit',
        'mochaTest:integration'
      ]);
    }

    else if (target === 'coverage') {

      if (option === 'unit') {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul:unit'
        ]);
      }

      else if (option === 'integration') {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul:integration'
        ]);
      }

      else if (option === 'check') {
        return grunt.task.run([
          'istanbul_check_coverage'
        ]);
      }

      else {
        return grunt.task.run([
          'env:all',
          'env:test',
          'mocha_istanbul',
          'istanbul_check_coverage'
        ]);
      }

    }

    else grunt.task.run([
      'test:server'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'concurrent:pre',
    'concurrent:dist',
    'concat',
    'copy:dist',
    'babel:server',
    'cdnify',
    'cssmin',
    'uglify',
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);
};
