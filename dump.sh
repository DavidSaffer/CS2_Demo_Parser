#!/bin/bash

# Usage instructions
usage() {
  echo "Usage: $0 [-e <exclude_pattern>] <extension1> [extension2] ..."
  echo "Example: dump.sh -e 'wasm_exec.js' js html"
  exit 1
}

# Check if no arguments were given
if [ $# -eq 0 ]; then
  usage
fi

# Parse optional arguments
exclude_pattern=""
while getopts ":e:" opt; do
  case ${opt} in
    e )
      exclude_pattern=$OPTARG
      ;;
    \? )
      echo "Invalid option: $OPTARG" 1>&2
      usage
      ;;
    : )
      echo "Invalid option: $OPTARG requires an argument" 1>&2
      usage
      ;;
  esac
done
shift $((OPTIND -1))

# Check if at least one extension is provided after the optional arguments
if [ $# -eq 0 ]; then
  usage
fi

# Name of the output file
output_file="all_files_dump.txt"

# Initialize or clear the output file
> "$output_file"

# Loop through each argument provided as file extension
for ext in "$@"
do
  # Find files with the current extension
  find . -type f -name "*.$ext" $(if [ -n "$exclude_pattern" ]; then echo "! -name $exclude_pattern"; fi) -print | while read filename
  do
    # Append the filename at the top of its content in the output file
    echo "Filename: $filename" >> "$output_file"
    cat "$filename" >> "$output_file"
    echo "" >> "$output_file"  # Adding a newline for better separation
  done
done

echo "All files have been appended to $output_file"