#!/bin/sh

USER_ID=${USER_ID:-9001}
GROUP_ID=${GROUP_ID:-9001}

echo "Starting with UID : $USER_ID"

mv /root/.ssh $HOME/.ssh

deluser --remove-home node
addgroup -S agneta -g $GROUP_ID
adduser -S -g agneta -u $USER_ID agneta
chown -R agneta:agneta $HOME

exec su-exec agneta "$@"
