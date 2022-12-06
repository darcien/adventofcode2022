# List all available targets if just is executed with no arguments
default:
  @just --list

# Run puzzle solver for specific day
run DAY:
  deno run --allow-read --allow-net=deno.land "./executor.ts" --day={{DAY}}

# Run puzzle solver for specific day, BUT using the real input instead of sample
submit DAY:
  deno run --allow-read --allow-net=deno.land "./executor.ts" --day={{DAY}} --submit

# Create solver and sample input file from template
new DAY:
  cp "./day_template.ts" "./{{DAY}}.ts"
  touch "./{{DAY}}.sample.txt"

# Create empty input file
input DAY:
  touch "./{{DAY}}.input.txt"

# Run benchmark on all solvers (unstable)
bench:
  deno bench --unstable --allow-read --allow-net=deno.land bench.ts

# Run tests, leave flags empty to run all tests
test *FLAGS:
  deno test {{FLAGS}}
