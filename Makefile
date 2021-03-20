all: build

test: lint

build: node_modules
	node tools/clean.js
	node tools/build.js

deps: node_modules

node_modules: yarn.lock
	@yarn -s --pure-lockfile
	@touch node_modules

lint: node_modules
	yarn -s run eslint --color src/gen tools
	yarn -s run stylelint --color src

clean: node_modules
	node tools/clean.js

install: node_modules
	node tools/install.js

update: node_modules
	yarn -s run updates -cu
	yarn -s run rimraf node_modules
	yarn -s
	@touch yarn.lock

.PHONY: all test build deps lint clean install update patch minor major