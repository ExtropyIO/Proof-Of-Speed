#!/bin/bash

# Check if coordinates are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <x_coordinate> <y_coordinate>"
    echo "Example: $0 5 10"
    exit 1
fi

X_COORD=$1
Y_COORD=$2

echo "Placing treasure at position ($X_COORD, $Y_COORD)..."
sozo execute dojo_starter-actions place_treasure -c "${X_COORD}", "${Y_COORD}" --wait

# address: 0x4a655ae081a867b4a84815b858451807caaf4165b70bff22a7a9673397b3d1f
