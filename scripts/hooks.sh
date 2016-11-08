#!/bin/bash
rm -f .git/hooks/pre-commit
touch .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo npm run lint >> .git/hooks/pre-commit
echo npm test >> .git/hooks/pre-commit
