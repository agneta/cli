npm config set cache <%-config.path.home%>/.cache/npm --global
npm config set package-lock false

export HOME=<%-config.path.home%>
export USER=<%-config.user.username%>
export USER_ID=<%-config.user.uid%>
export GROUP_ID=<%-config.user.gid%>

USER_ID=${USER_ID:-9001}
GROUP_ID=${GROUP_ID:-9001}
GROUP_NAME=$(getent group $GROUP_ID | cut -d: -f1)

deluser --remove-home node
if [ -z GROUP_NAME ]
then
addgroup -S -g $GROUP_ID $USER
else
groupmod -n $USER $GROUP_NAME
fi
adduser -S -u $USER_ID -G $USER $USER
chown -R $USER:$USER $HOME