#!/bin/sh

cp /etc/postfix/config/postfix-config.conf /etc/postfix/main.cf

exec postfix start-fg
