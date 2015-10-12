module.exports = function(grunt) {

	grunt.initConfig({
		bower_concat: {
			all: {
				dest: 'dist/squared.js',
				mainFiles: {
					'Squared': 'src/squared.js'
				},
				callback: function (mainFiles, component) {
					console.log(mainFiles);
					return mainFiles;
				}
			}
		},
		concat: {
			options: {
				separator: ';'
			},
			dist: {
				src: ['dist/squared.js', 'src/squared.js'],
				dest: 'dist/squared.js'
			}
		},
		uglify: {
			my_target: {
				files: {
					'dist/squared.min.js': ['dist/squared.js']
				}
			}
		}
	});
	
	

	grunt.loadNpmTasks('grunt-bower-concat');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	
	grunt.registerTask('default', ['bower_concat', 'concat', 'uglify']);
};