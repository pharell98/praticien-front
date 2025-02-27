#!/bin/bash

# Définition du répertoire source
SRC_DIR="./src"

# Supprimer les commentaires sur une ligne et les consoles logs
find "$SRC_DIR" -type f \( -name "*.ts" -o -name "*.js" -o -name "*.html" \) -print0 | while IFS= read -r -d '' file; do
    # Suppression des commentaires sur une ligne
    sed -i '/^\s*\/\//d' "$file"

    # Suppression des commentaires multi-lignes
    sed -i ':a;N;$!ba;s|/\*.*\*/||g' "$file"

    # Suppression des logs console
    sed -i '/console\./d' "$file"
done

echo "Suppression des commentaires et des console.log terminée."
