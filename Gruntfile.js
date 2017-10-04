module.exports = grunt => {
	require("load-grunt-tasks")(grunt)

	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		sass: {
			dist: {
				files: {
					"public/css/master.css": "assets/scss/master.scss"
				}
			}
		},
		autoprefixer: {
			dist: {
				files: {
					"public/css/master.css": "public/css/master.css"
				}
			}
		},
		cssmin: {
			dist: {
				files: {
					"public/css/master.css": ["public/css/master.css"]
				}
			}
		},
		watch: {
			scss: {
				files: "assets/scss/**/*.scss",
				tasks: [
					"sass",
					"autoprefixer",
					"cssmin"
				]
			}
		},
		nodemon: {
			dev: {
				script: "index.js"
			}
		},
		concurrent: {
			dev: [
				"watch",
				"nodemon"
			],
			options: {
				logConcurrentOutput: true
			}
		}
	})

	grunt.registerTask("default", ["concurrent"])
}
