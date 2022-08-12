SRC_DIR=src
SRC_TS_FILES = $(wildcard $(SRC_DIR)/*/*.ts) src/index.ts
SRC_CJS_FILES = $(wildcard $(SRC_DIR)/*/*_cjs.)

.PHONY: all
all:
	echo "please, run something else"

.PHONY: test_quick
test_quick: test/test_quick.ts
	npx ts-node -r tsconfig-paths/register test/test_quick.ts

.PHONY: launch
launch:
	npx ts-node -r tsconfig-paths/register src/index.ts

.PHONY: launch_with_core_ruleset
launch_with_core_ruleset:

make_dts: game_context.d.ts ruleset.d.ts

game_context.d.ts: $(SRC_TS_FILES) $(SRC_CJS_FILES)
	npx dts-bundle-generator src/executor/game_context.ts -o game_context.d.ts

ruleset.d.ts: $(SRC_TS_FILES) $(SRC_CJS_FILES)
	dts-bundle-generator src/ruleset/index.ts -o ruleset.d.ts

.PHONY: build_core_ruleset
build_core_ruleset: game_context.d.ts ruleset.d.ts
	npx tsc --project core_ruleset/tsconfig.json

.PHONY: clean
clean:
	rm -rf ./dist
	rm -f game_context.d.ts
	rm -f ruleset.d.ts
	rm -rf mods/*
