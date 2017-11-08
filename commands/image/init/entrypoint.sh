#!/bin/sh

USER_ID=${LOCAL_USER_ID:-9001}

echo "Starting with UID : $USER_ID"

deluser --remove-home node
addgroup -S agneta -g $USER_ID
adduser -S -g agneta -u $USER_ID agneta
chown -R agneta:agneta .

exec su-exec agneta "$@"
