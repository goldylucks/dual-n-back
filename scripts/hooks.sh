#!/bin/bash
set -e # stop on error

rm -f .git/hooks/pre-commit
touch .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
echo set -e >> .git/hooks/pre-commit
echo npm run lint >> .git/hooks/pre-commit
echo npm run lintstyle >> .git/hooks/pre-commit
echo npm test >> .git/hooks/pre-commit
# commented out until react native and mocha react native
# will support react 15.4
# echo npm run test:native >> .git/hooks/pre-commit

echo pre-commit hooks installed successfully:
echo npm run lint
echo npm test
exit 0