#!/bin/bash

###############################################################################
# Aria iOS Build & Archive Script
#
# Purpose: Clean, generate, archive, validate and upload Aria to App Store
#
# Usage:
#   chmod +x scripts/xcode/archive.sh
#   ./scripts/xcode/archive.sh
#
###############################################################################

set -e

# Ensure we are in the project root
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_ROOT="$( cd "$SCRIPT_DIR/../.." && pwd )"
ARIA_DIR="$PROJECT_ROOT/Aria"
cd "$ARIA_DIR"
echo "Working directory: $(pwd)"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly BOLD='\033[1m'
readonly NC='\033[0m'

# ── Configuration ────────────────────────────────────────────────────────────
source "$SCRIPT_DIR/Config.sh"

readonly PROJECT_NAME="aria"
readonly SCHEME="aria"
readonly CONFIGURATION="Release"
readonly ARCHIVE_PATH="./build/aria.xcarchive"
readonly EXPORT_PATH="./build"
readonly EXPORT_OPTIONS_VALIDATE="./build/ExportOptions-Validate.plist"
readonly EXPORT_OPTIONS_UPLOAD="./build/ExportOptions-Upload.plist"

# ── Helpers ──────────────────────────────────────────────────────────────────
error()   { echo -e "${RED}[FAIL] $1${NC}"; exit 1; }
success() { echo -e "${GREEN}[OK] $1${NC}"; }
info()    { echo -e "${BLUE}ℹ $1${NC}"; }
warn()    { echo -e "${YELLOW}WARNING $1${NC}"; }

section() {
  echo ""
  echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}${BOLD}  $1${NC}"
  echo -e "${CYAN}${BOLD}═══════════════════════════════════════════════════════════════${NC}"
  echo ""
}

# ── Prerequisites Check ──────────────────────────────────────────────────────
section "0. Prerequisites Check"

if ! command -v xcodegen &> /dev/null; then
    error "XcodeGen not found. Install via: brew install xcodegen"
fi
success "XcodeGen found: $(xcodegen --version 2>&1 | head -1)"

if ! command -v xcodebuild &> /dev/null; then
    error "xcodebuild not found. Install Xcode from the App Store."
fi
success "xcodebuild found"

if [ ! -f "project.yml" ]; then
    error "project.yml not found in $ARIA_DIR"
fi
success "project.yml found"

if [ ! -f "GoogleService-Info.plist" ]; then
    warn "GoogleService-Info.plist not found — Firebase may not work correctly"
fi

if [ ! -f "PrivacyInfo.xcprivacy" ]; then
    error "PrivacyInfo.xcprivacy not found — App Store will reject the binary. Generate via: Privacy > Generate Privacy Report in Xcode"
fi
success "PrivacyInfo.xcprivacy found"

# ── Header ───────────────────────────────────────────────────────────────────
echo -e "${BOLD}${CYAN}"
cat <<"HEADER_EOF"
  ╔═══════════════════════════════════════════════════════════════╗
  ║                                                               ║
  ║               Aria iOS BUILD & ARCHIVE                        ║
  ║                                                               ║
  ╚═══════════════════════════════════════════════════════════════╝
HEADER_EOF
echo -e "${NC}"

# ── Step 1: Clean ────────────────────────────────────────────────────────────
section "1. Cleaning previous builds"
info "Removing old build artifacts..."
rm -rf build
rm -rf ~/Library/Developer/Xcode/DerivedData/aria-* 2>/dev/null || true
success "Caches and previous builds cleaned"

# ── Step 2: Auto-increment Build Number ──────────────────────────────────────
section "2. Auto-incrementing Build Number"
if [ -f "project.yml" ]; then
    CURRENT_BUILD=$(grep "CURRENT_PROJECT_VERSION:" project.yml | awk '{print $2}')
    if [[ ! "$CURRENT_BUILD" =~ ^[0-9]+$ ]]; then
        error "Invalid CURRENT_PROJECT_VERSION in project.yml: $CURRENT_BUILD"
    fi
    NEXT_BUILD=$((CURRENT_BUILD + 1))

    if command -v /usr/libexec/PlistBuddy &> /dev/null; then
        info "Using PlistBuddy for version update..."
    fi

    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' "s/CURRENT_PROJECT_VERSION: $CURRENT_BUILD/CURRENT_PROJECT_VERSION: $NEXT_BUILD/" project.yml
    else
        sed -i "s/CURRENT_PROJECT_VERSION: $CURRENT_BUILD/CURRENT_PROJECT_VERSION: $NEXT_BUILD/" project.yml
    fi
    success "Build number incremented: $CURRENT_BUILD → $NEXT_BUILD"
else
    error "project.yml not found — cannot increment build number"
fi

# Read new marketing version for display
MARKETING_VERSION=$(grep "MARKETING_VERSION:" project.yml | awk '{print $2}')
info "Version: $MARKETING_VERSION (Build: $NEXT_BUILD)"

# ── Step 3: Generate Icons ───────────────────────────────────────────────────
section "3. Generating App Icons"
if [ -f "$SCRIPT_DIR/generate_icons.sh" ]; then
    bash "$SCRIPT_DIR/generate_icons.sh"
    success "Icons generated"
else
    warn "generate_icons.sh not found, skipping icon generation"
fi

# ── Step 4: XcodeGen ─────────────────────────────────────────────────────────
section "4. Generating Project with XcodeGen"
info "Removing old project file..."
rm -rf "$PROJECT_NAME.xcodeproj"
info "Running xcodegen generate..."
xcodegen generate
success "aria.xcodeproj generated successfully"

# ── Step 5: SwiftLint ──────────────────────────────────────────────────────────
section "5. SwiftLint Check"

if command -v swiftlint &> /dev/null; then
    success "SwiftLint found: $(swiftlint version 2>&1)"
    info "Running SwiftLint (strict mode)..."

    mkdir -p build
    LINT_LOG="./build/swiftlint.log"

    set +e
    swiftlint lint --strict 2>&1 | tee "$LINT_LOG"
    LINT_EXIT_CODE=${PIPESTATUS[0]}
    set -e

    if [ $LINT_EXIT_CODE -ne 0 ]; then
        VIOLATION_COUNT=$(grep -cE " error:| warning:" "$LINT_LOG" 2>/dev/null || echo "0")
        echo ""
        echo -e "${RED}${BOLD}[FAIL]  SWIFTLINT: ${VIOLATION_COUNT} violation(s) found  [FAIL]${NC}"
        echo ""
        echo -e "${YELLOW}All violations:${NC}"
        grep -E " error:| warning:" "$LINT_LOG" | sed 's/^/  /'
        echo ""
        error "Fix ALL SwiftLint violations before archiving. Log: $LINT_LOG"
    fi

    success "SwiftLint passed — 0 violations"
else
    warn "SwiftLint not found — skipping lint check. Install via: brew install swiftlint"
fi

# ── Step 6: Validate Project ──────────────────────────────────────────────────
section "6. Validating Project"
info "Checking scheme exists..."
if xcodebuild -project "$PROJECT_NAME.xcodeproj" -list 2>&1 | grep -q "$SCHEME"; then
    success "Scheme '$SCHEME' found"
else
    error "Scheme '$SCHEME' not found in the generated project"
fi

# ── Step 7: Archive ───────────────────────────────────────────────────────────
section "7. Creating Archive"
info "Team ID:   $DEVELOPMENT_TEAM"
info "Bundle ID: $PRODUCT_BUNDLE_IDENTIFIER"
info "Version:   $MARKETING_VERSION"
echo ""

mkdir -p build
ARCHIVE_LOG="./build/archive.log"

set +e
xcodebuild archive \
  -project "$PROJECT_NAME.xcodeproj" \
  -scheme "$SCHEME" \
  -configuration "$CONFIGURATION" \
  -archivePath "$ARCHIVE_PATH" \
  -destination 'generic/platform=iOS' \
  -allowProvisioningUpdates \
  DEVELOPMENT_TEAM="$DEVELOPMENT_TEAM" \
  CODE_SIGN_STYLE=Automatic \
  2>&1 | tee "$ARCHIVE_LOG"

XCODE_EXIT_CODE=${PIPESTATUS[0]}
set -e

if [ $XCODE_EXIT_CODE -ne 0 ]; then
    echo ""
    echo -e "${RED}${BOLD}[FAIL]  ARCHIVE FAILED  [FAIL]${NC}"
    echo ""
    echo -e "${YELLOW}Last 80 lines of log:${NC}"
    tail -80 "$ARCHIVE_LOG"
    exit 1
fi

success "Archive created at: $ARCHIVE_PATH"

# ── Step 7: Validate App ────────────────────────────────────────────────────
section "8. Validating App for App Store"
info "Generating validation ExportOptions.plist..."

cat > "$EXPORT_OPTIONS_VALIDATE" <<PLIST_EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store-connect</string>
    <key>teamID</key>
    <string>$DEVELOPMENT_TEAM</string>
    <key>uploadSymbols</key>
    <true/>
    <key>uploadBitcode</key>
    <false/>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>manageAppVersionAndBuildNumber</key>
    <true/>
</dict>
</plist>
PLIST_EOF

VALIDATE_LOG="./build/validate.log"

info "Running local export to validate signing and provisioning..."
set +e
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS_VALIDATE" \
  -allowProvisioningUpdates \
  2>&1 | tee "$VALIDATE_LOG"

VALIDATE_EXIT_CODE=${PIPESTATUS[0]}
set -e

if [ $VALIDATE_EXIT_CODE -ne 0 ]; then
    echo ""
    echo -e "${RED}${BOLD}[FAIL]  VALIDATION FAILED  [FAIL]${NC}"
    echo ""
    echo -e "${YELLOW}Last 80 lines of log:${NC}"
    tail -80 "$VALIDATE_LOG"
    echo ""
    echo -e "${RED}Fix the issues above before uploading to Apple.${NC}"
    echo -e "${YELLOW}Archive is preserved at: $ARCHIVE_PATH${NC}"
    exit 1
fi

success "App validation passed — signing, provisioning and entitlements OK"
rm -f "$EXPORT_PATH/aria.ipa"

# ── Step 8: Upload to Apple ──────────────────────────────────────────────────
section "9. Uploading to App Store Connect"
info "Generating upload ExportOptions.plist..."

cat > "$EXPORT_OPTIONS_UPLOAD" <<PLIST_EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>app-store-connect</string>
    <key>teamID</key>
    <string>$DEVELOPMENT_TEAM</string>
    <key>uploadSymbols</key>
    <true/>
    <key>uploadBitcode</key>
    <false/>
    <key>signingStyle</key>
    <string>automatic</string>
    <key>manageAppVersionAndBuildNumber</key>
    <true/>
    <key>destination</key>
    <string>upload</string>
</dict>
</plist>
PLIST_EOF

UPLOAD_LOG="./build/upload.log"

info "Uploading to Apple..."
set +e
xcodebuild -exportArchive \
  -archivePath "$ARCHIVE_PATH" \
  -exportPath "$EXPORT_PATH" \
  -exportOptionsPlist "$EXPORT_OPTIONS_UPLOAD" \
  -allowProvisioningUpdates \
  2>&1 | tee "$UPLOAD_LOG"

UPLOAD_EXIT_CODE=${PIPESTATUS[0]}
set -e

if [ $UPLOAD_EXIT_CODE -ne 0 ]; then
    echo ""
    echo -e "${RED}${BOLD}[FAIL]  UPLOAD FAILED  [FAIL]${NC}"
    echo ""
    echo -e "${YELLOW}Last 80 lines of log:${NC}"
    tail -80 "$UPLOAD_LOG"
    exit 1
fi

success "Aria uploaded to App Store Connect"

# ── Final Summary ─────────────────────────────────────────────────────────────
section "Build Completed!"
echo -e "${GREEN}${BOLD}[OK] Uploaded successfully to App Store Connect!${NC}"
echo ""
echo -e "${BOLD}Version:${NC}  $MARKETING_VERSION (Build $NEXT_BUILD)"
echo -e "${BOLD}Archive:${NC}  $ARCHIVE_PATH"
echo ""
echo -e "${CYAN}Next steps:${NC}"
echo -e "  1. Go to ${BOLD}appstoreconnect.apple.com${NC}"
echo -e "  2. Select your app → TestFlight or App Store tab"
echo -e "  3. Wait for Apple to process the build (usually 5-15 minutes)"
echo -e "  4. Check for any warnings from Apple"
echo ""
echo -e "${GREEN}${BOLD}Process completed!${NC}"
echo ""
