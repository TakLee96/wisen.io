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

update:
	git add -A
	git commit -m "[Tak] Bug Fixing"
	git push origin master
