module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

  		jshint: {
  			dev: {
  				src: ["script.js"]
  			}
  		},
  		autoprefixer: {
  			
  			dev: {
  				/*  settings of autoprefixer
  				options: {
 					 browsers: ['last 2 versions']
  			},*/
  			src: ["*.css"]
     		}
  		},
  		uglify: {
           my_target: {
              files: {
                 'output.min.js': ['script.js']
                     }
           }
        },
		watch: {
		  scripts: {
		    files: ['script.js'],
		    tasks: ['jshint'],
		    options: {
		      spawn: false,
		    },
		  },
		}
  	  });
  
  // Load the plugin that provides the "jshint" "autoprefixer" tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  // Default task(s). to start default hit grunt, but to start build hit grunt build
  grunt.registerTask('default', ['jshint', 'autoprefixer', 'watch']);
  grunt.registerTask('build', ['jshint', 'autoprefixer', 'uglify']);

};