#!/bin/bash

###############################################################################
# Aria Icon Generator
#
# Purpose: Generate all required AppIcon sizes for iPhone + iPad from source
#
# Usage:
#   chmod +x scripts/xcode/generate_icons.sh
#   ./scripts/xcode/generate_icons.sh
#
###############################################################################

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
ICON_DIR="$PROJECT_ROOT/Aria/Assets.xcassets/AppIcon.appiconset"
SOURCE_ICON="$(cd "$SCRIPT_DIR/../../.." && pwd)/images/assets/icon.png"

# All required sizes: "filename size scale idiom"
declare -a ICONS=(
    "Icon-20x20@2x.png      20    2   iphone"
    "Icon-20x20@3x.png      20    3   iphone"
    "Icon-29x29@2x.png      29    2   iphone"
    "Icon-29x29@3x.png      29    3   iphone"
    "Icon-40x40@2x.png      40    2   iphone"
    "Icon-40x40@3x.png      40    3   iphone"
    "Icon-60x60@2x.png      60    2   iphone"
    "Icon-60x60@3x.png      60    3   iphone"
    "Icon-76x76@2x.png      76    2   iphone"
    "Icon-83.5x83.5@2x.png  83.5  2   iphone"
    "Icon-20x20@1x-ipad.png    20    1   ipad"
    "Icon-20x20@2x-ipad.png    20    2   ipad"
    "Icon-29x29@1x-ipad.png    29    1   ipad"
    "Icon-29x29@2x-ipad.png    29    2   ipad"
    "Icon-40x40@1x-ipad.png    40    1   ipad"
    "Icon-40x40@2x-ipad.png    40    2   ipad"
    "Icon-76x76@1x-ipad.png    76    1   ipad"
    "Icon-76x76@2x-ipad.png    76    2   ipad"
    "Icon-83.5x83.5@2x-ipad.png 83.5 2   ipad"
    "Icon-1024x1024.png      1024  1   ios-marketing"
)

echo "=== Aria Icon Generator ==="
echo "Source: $SOURCE_ICON"
echo "Output: $ICON_DIR"
echo ""

if [ ! -f "$SOURCE_ICON" ]; then
    echo "ERROR: Source icon not found at $SOURCE_ICON"
    exit 1
fi

# Check source icon dimensions
SRC_W=$(sips -g pixelWidth "$SOURCE_ICON" | tail -1 | awk '{print $2}')
SRC_H=$(sips -g pixelHeight "$SOURCE_ICON" | tail -1 | awk '{print $2}')
echo "Source icon: ${SRC_W}x${SRC_H}"

# First create a proper 1024x1024 PNG from source (in case it's JPEG or wrong size)
MASTER_ICON="$ICON_DIR/AppIcon-1024-master.png"
echo "Creating 1024x1024 master icon..."
sips -z 1024 1024 -s format png "$SOURCE_ICON" --out "$MASTER_ICON" > /dev/null 2>&1

# Generate all icon sizes
echo "Generating icons..."
for entry in "${ICONS[@]}"; do
    read -r filename size scale idiom <<< "$entry"
    pixels=$(echo "$size * $scale" | bc)
    pixels_int=$(printf "%.0f" "$pixels")
    echo "  $filename (${pixels_int}x${pixels_int}) [$idiom ${scale}x]"
    sips -z "$pixels_int" "$pixels_int" -s format png "$MASTER_ICON" --out "$ICON_DIR/$filename" > /dev/null 2>&1
done

# Clean up master
rm -f "$MASTER_ICON"

# Clean up old files that don't belong
find "$ICON_DIR" -name "*.png" ! -name "Icon-*" ! -name "AppIcon-1024-master.png" -delete 2>/dev/null || true

echo ""
echo "Icons generated successfully!"
echo ""

# Count generated files
ICON_COUNT=$(ls -1 "$ICON_DIR"/Icon-*.png 2>/dev/null | wc -l | tr -d ' ')
echo "Total icon files: $ICON_COUNT"
