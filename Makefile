all:
	npm install
	bower install
	grunt
	npm start

force:
	npm install
	bower install
	grunt --force
	npm start

speed:
	grunt build --force
	npm start
