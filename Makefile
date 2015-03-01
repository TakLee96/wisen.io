all:
	grunt
	npm start

force:
	grunt --force
	npm start

launch:
	npm start

speed:
	grunt build
	npm start
