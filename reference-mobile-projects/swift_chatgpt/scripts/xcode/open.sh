#!/bin/bash

# Aria – Xcode Open Script
# Purpose: Regenerate project with XcodeGen and open in Xcode

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ARIA_DIR="$( cd "$SCRIPT_DIR/../../mobile/Aria" && pwd )"
cd "$ARIA_DIR"
echo "Working directory: $(pwd)"

# Step 1: Generate Icons
echo "Generating app icons..."
bash "$SCRIPT_DIR/generate_icons.sh"

# Step 2: Generate Project
echo "Generating project with XcodeGen..."
xcodegen generate

# Step 3: Open Project
echo "Opening aria.xcodeproj in Xcode..."
open aria.xcodeproj

echo "[OK] Ready to develop Aria!"
