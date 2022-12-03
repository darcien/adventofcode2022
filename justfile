# List all available targets if just is executed with no arguments
default:
  @just --list

# Run puzzle solver for specific day
run DAY:
  deno run --allow-read "./{{DAY}}.ts"

# Create solver and sample input file from template
new DAY:
  cp "./day_template.ts" "./{{DAY}}.ts"
  touch "./{{DAY}}.sample.txt"

# Create empty input file
input DAY:
  touch "./{{DAY}}.input.txt"

# Run tests, leave flags empty to run all tests
test *FLAGS:
  deno test {{FLAGS}}
