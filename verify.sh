#!/bin/bash

# Conference Website Verification Script

echo "================================================"
echo "Conference Website - Implementation Verification"
echo "================================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check function
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $1"
        return 0
    else
        echo -e "${RED}✗${NC} $1 (MISSING)"
        return 1
    fi
}

# Check directory
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $1/"
        return 0
    else
        echo -e "${RED}✗${NC} $1/ (MISSING)"
        return 1
    fi
}

echo "Checking Directory Structure..."
echo "-------------------------------"
check_dir "events"
check_dir "data"
check_dir "js"
check_dir "lib"
echo ""

echo "Checking HTML Pages..."
echo "----------------------"
check_file "index.html"
check_file "key-dates.html"
check_file "multitrack.html"
check_file "events/all.html"
check_file "events/panels.html"
check_file "events/keynotes.html"
check_file "events/workshops.html"
echo ""

echo "Checking JavaScript Files..."
echo "----------------------------"
check_file "js/csv-parser.js"
check_file "js/event-renderer.js"
check_file "js/navigation.js"
check_file "lib/papaparse.min.js"
echo ""

echo "Checking Data Files..."
echo "----------------------"
check_file "data/events.csv"
check_file "data/conference-info.json"
echo ""

echo "Checking Stylesheets..."
echo "-----------------------"
check_file "style.css"
echo ""

echo "Checking Documentation..."
echo "-------------------------"
check_file "README.md"
check_file "QUICKSTART.md"
check_file "IMPLEMENTATION_SUMMARY.md"
echo ""

echo "Verifying Data Files..."
echo "-----------------------"

# Count events in CSV
if [ -f "data/events.csv" ]; then
    event_count=$(($(wc -l < data/events.csv) - 1))
    echo -e "${GREEN}✓${NC} events.csv contains $event_count events"
fi

# Check JSON is valid
if [ -f "data/conference-info.json" ]; then
    if command -v python3 &> /dev/null; then
        if python3 -c "import json; json.load(open('data/conference-info.json'))" 2>/dev/null; then
            echo -e "${GREEN}✓${NC} conference-info.json is valid JSON"
        else
            echo -e "${RED}✗${NC} conference-info.json has JSON errors"
        fi
    fi
fi
echo ""

echo "Quick Start Instructions..."
echo "---------------------------"
echo "To run the website locally, use one of these commands:"
echo ""
echo "  Python:  python3 -m http.server 8000"
echo "  Node.js: npx http-server"
echo "  PHP:     php -S localhost:8000"
echo ""
echo "Then open: http://localhost:8000"
echo ""
echo "================================================"
echo "Verification Complete!"
echo "================================================"
