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

sync:
	git add -A
	git commit -m "[Tak] Bug Fixing"
	git push origin master

compile it:
	grunt build --force
	cp -r bower_components/bootstrap/fonts build/fonts
	npm start
