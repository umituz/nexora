#!/bin/bash

###############################################################################
# Aria iPhone Simulator Run Script
#
# Purpose: Build and launch Aria on the best available iPhone simulator
#
# Usage:
#   chmod +x scripts/xcode/run.sh
#   ./scripts/xcode/run.sh
#
###############################################################################

set -e

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ARIA_DIR="$( cd "$SCRIPT_DIR/../../mobile/Aria" && pwd )"
cd "$ARIA_DIR"
echo "Working directory: $(pwd)"

# Colors
readonly GREEN='\033[0;32m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly BOLD='\033[1m'
readonly NC='\033[0m'

# Configuration
readonly BUNDLE_ID="com.umituz.aria"
readonly PROJECT_NAME="aria"
readonly SCHEME="aria"

# Preferred iPhone devices in order
readonly PREFERRED_DEVICES=(
    "iPhone 16 Pro Max"
    "iPhone 16 Pro"
    "iPhone 16"
    "iPhone 15 Pro Max"
    "iPhone 15 Pro"
    "iPhone 15"
)

section() { echo -e "\n${CYAN}${BOLD}═════ $1 ═════${NC}"; }

# Function to find available device
find_iphone_device() {
    for device in "${PREFERRED_DEVICES[@]}"; do
        DEVICE_ID=$(xcrun simctl list devices | grep "$device" | head -1 | grep -oE "[A-F0-9]{8}-([A-F0-9]{4}-){3}[A-F0-9]{12}")
        if [ -n "$DEVICE_ID" ]; then
            echo "$DEVICE_ID|$device"
            return 0
        fi
    done
    return 1
}

# Step 1: Generate Icons
section "1. Generating App Icons"
bash "$SCRIPT_DIR/generate_icons.sh"

# Step 2: Generate Project
section "2. Generating Project"
xcodegen generate

# Step 3: Find device
section "3. Finding iPhone Simulator"
DEVICE_INFO=$(find_iphone_device)
if [ -z "$DEVICE_INFO" ]; then
    echo "Error: No iPhone simulator found."
    echo "Available devices:"
    xcrun simctl list devices | grep "iPhone"
    exit 1
fi

DEVICE_ID=$(echo "$DEVICE_INFO" | cut -d'|' -f1)
DEVICE_NAME=$(echo "$DEVICE_INFO" | cut -d'|' -f2)
DESTINATION="id=$DEVICE_ID"

echo "Found: $DEVICE_NAME ($DEVICE_ID)"

# Boot if needed before building (to help IBAgent)
STATUS=$(xcrun simctl list devices | grep "$DEVICE_ID" | grep "Booted" || true)
if [ -z "$STATUS" ]; then
    echo "Booting $DEVICE_NAME ($DEVICE_ID)..."
    xcrun simctl boot "$DEVICE_ID" || true
    sleep 5
fi

# Step 4: Build for Simulator
section "4. Building for Simulator ($DEVICE_NAME)"
xcodebuild clean build \
  -project "$PROJECT_NAME.xcodeproj" \
  -scheme "$SCHEME" \
  -destination "$DESTINATION" \
  -derivedDataPath ./build/DerivedData \
  -configuration Debug \
  -quiet

# Step 5: Install and Launch
section "5. Installing and Launching"

# Kill existing instance
echo "Stopping $BUNDLE_ID if running..."
xcrun simctl terminate "$DEVICE_ID" "$BUNDLE_ID" 2>/dev/null || true

# Find built app
BUILD_DIR=$(xcodebuild -project "$PROJECT_NAME.xcodeproj" -scheme "$SCHEME" -showBuildSettings -destination "$DESTINATION" -derivedDataPath ./build/DerivedData | grep -m 1 " BUILT_PRODUCTS_DIR" | awk '{print $3}')
APP_PATH="$BUILD_DIR/Aria.app"

# Install and launch
echo "Installing: $APP_PATH"
xcrun simctl install "$DEVICE_ID" "$APP_PATH"
echo "Launching: $BUNDLE_ID"
xcrun simctl launch "$DEVICE_ID" "$BUNDLE_ID"

echo -e "\n${GREEN}${BOLD}Aria is running on $DEVICE_NAME!${NC}\n"
